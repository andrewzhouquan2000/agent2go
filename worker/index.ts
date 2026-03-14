/**
 * Agent2Go Worker
 * 
 * This worker processes tasks from the Upstash Redis Queue.
 * Deploy to Railway or run locally with: tsx worker/index.ts
 */

import { getNextTask, storeTaskResult, getQueueLength, Task } from '../src/lib/queue'
import { callAI } from '../src/lib/ai-client'
import getPrisma from '../src/lib/prisma'

// Worker configuration
const POLL_INTERVAL_MS = parseInt(process.env.WORKER_POLL_INTERVAL || '5000', 10)
const MAX_CONCURRENT_TASKS = parseInt(process.env.WORKER_MAX_CONCURRENT || '1', 10)

// Track running tasks
let activeTasks = 0
let isRunning = true

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...')
  isRunning = false
})

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully...')
  isRunning = false
})

// Process a single task
async function processTask(task: Task): Promise<void> {
  activeTasks++
  console.log(`[${new Date().toISOString()}] Processing task: ${task.id} (type: ${task.type})`)

  try {
    // Task processing logic
    const result = await executeTask(task)
    
    // Store result
    await storeTaskResult(task.id, {
      status: 'completed',
      result,
      completedAt: Date.now(),
    })
    
    console.log(`[${new Date().toISOString()}] Task completed: ${task.id}`)
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Task failed: ${task.id}`, error)
    
    // Store error
    await storeTaskResult(task.id, {
      status: 'failed',
      error: (error as Error).message,
      failedAt: Date.now(),
    })
  } finally {
    activeTasks--
  }
}

// Execute task based on type
async function executeTask(task: Task): Promise<unknown> {
  switch (task.type) {
    case 'test':
      return await handleTestTask(task)
    
    case 'agent_execution':
      return await handleAgentExecution(task)
    
    default:
      console.warn(`Unknown task type: ${task.type}`)
      return { handled: false, type: task.type }
  }
}

// Test task handler
async function handleTestTask(task: Task): Promise<{ message: string }> {
  // Simulate work
  await sleep(1000)
  
  const message = task.payload.message as string || 'No message'
  return {
    message: `Processed: ${message}`,
    processedAt: new Date().toISOString(),
  }
}

// Agent execution handler with AI integration
async function handleAgentExecution(task: Task): Promise<unknown> {
  console.log('Agent execution task received:', task.payload)
  
  const prisma = getPrisma()
  
  // Get task details from database if taskId is provided
  let taskDetails = null
  if (task.payload.taskId) {
    taskDetails = await prisma.task.findUnique({
      where: { id: task.payload.taskId as string },
      include: {
        agent: true,
        user: true,
      }
    })
    
    if (!taskDetails) {
      throw new Error(`Task not found: ${task.payload.taskId}`)
    }
    
    // Update task status to processing
    await prisma.task.update({
      where: { id: taskDetails.id },
      data: { status: 'processing' }
    })
  }
  
  // Build AI prompt
  const systemPrompt = `You are an AI assistant helping to execute tasks for Agent2Go platform.
Be helpful, concise, and professional.`
  
  const userPrompt = taskDetails
    ? `Task: ${taskDetails.title}
Description: ${taskDetails.description}
Input: ${taskDetails.input || 'N/A'}

Please execute this task and provide the output.`
    : `Task payload: ${JSON.stringify(task.payload, null, 2)}

Please process this task.`
  
  // Get AI configuration from environment
  const aiProvider = process.env.AI_PROVIDER || 'openai'
  const apiKey = process.env.OPENAI_API_KEY || process.env.CLAUDE_API_KEY || ''
  const model = process.env.AI_MODEL || undefined
  
  if (!apiKey) {
    throw new Error('AI API key not configured. Set OPENAI_API_KEY or CLAUDE_API_KEY')
  }
  
  // Call AI
  const response = await callAI(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    {
      provider: aiProvider as 'openai' | 'claude',
      apiKey,
      model,
    }
  )
  
  // Update task in database
  if (taskDetails) {
    await prisma.task.update({
      where: { id: taskDetails.id },
      data: {
        status: 'completed',
        output: response.content,
        result: JSON.stringify({
          success: true,
          tokensUsed: response.usage?.totalTokens || 0,
        }),
      }
    })
    
    // Track usage
    await prisma.userUsage.upsert({
      where: {
        userId_date: {
          userId: taskDetails.userId,
          date: new Date(),
        }
      },
      update: {
        taskCount: { increment: 1 },
        tokenCount: { increment: response.usage?.totalTokens || 0 },
      },
      create: {
        userId: taskDetails.userId,
        date: new Date(),
        taskCount: 1,
        tokenCount: response.usage?.totalTokens || 0,
        costCents: 0, // TODO: Calculate based on provider pricing
      }
    })
  }
  
  return {
    status: 'completed',
    content: response.content,
    tokensUsed: response.usage?.totalTokens || 0,
    taskId: taskDetails?.id,
  }
}

// Utility: sleep
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Main worker loop
async function workerLoop(): Promise<void> {
  console.log(`[${new Date().toISOString()}] Worker started`)
  console.log(`Poll interval: ${POLL_INTERVAL_MS}ms`)
  console.log(`Max concurrent tasks: ${MAX_CONCURRENT_TASKS}`)

  while (isRunning) {
    try {
      // Check if we can process more tasks
      if (activeTasks >= MAX_CONCURRENT_TASKS) {
        await sleep(POLL_INTERVAL_MS)
        continue
      }

      // Get queue length
      const queueLength = await getQueueLength()
      
      if (queueLength === 0) {
        await sleep(POLL_INTERVAL_MS)
        continue
      }

      console.log(`[${new Date().toISOString()}] Queue length: ${queueLength}`)

      // Get and process next task
      const task = await getNextTask()
      
      if (task) {
        // Fire and forget (with error handling)
        processTask(task).catch(err => {
          console.error('Unhandled error in processTask:', err)
        })
      }
    } catch (error) {
      console.error('Worker loop error:', error)
      await sleep(POLL_INTERVAL_MS)
    }
  }

  // Wait for active tasks to complete
  while (activeTasks > 0) {
    console.log(`Waiting for ${activeTasks} active tasks to complete...`)
    await sleep(1000)
  }

  console.log(`[${new Date().toISOString()}] Worker shut down complete`)
  process.exit(0)
}

// Start worker
workerLoop().catch(err => {
  console.error('Fatal worker error:', err)
  process.exit(1)
})
