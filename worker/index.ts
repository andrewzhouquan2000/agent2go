/**
 * Agent2Go Worker
 * 
 * This worker processes tasks from the Upstash Redis Queue.
 * Deploy to Railway or run locally with: tsx worker/index.ts
 */

import { getNextTask, storeTaskResult, getQueueLength, Task } from '../src/lib/queue'

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

// Agent execution handler (placeholder)
async function handleAgentExecution(task: Task): Promise<unknown> {
  console.log('Agent execution task received:', task.payload)
  
  // TODO: Implement actual agent execution logic
  // This will integrate with CrewAI or other agent frameworks
  
  return {
    status: 'placeholder',
    note: 'Agent execution not yet implemented',
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
