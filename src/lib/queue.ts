import { Redis } from '@upstash/redis'

// Lazy initialization to avoid build-time errors
let redisInstance: Redis | null = null

function getRedis(): Redis {
  if (!redisInstance) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error('Upstash Redis credentials not configured')
    }
    
    redisInstance = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return redisInstance
}

// Queue names
export const TASK_QUEUE = 'agent2go:tasks:queue'
export const TASK_RESULTS = 'agent2go:tasks:results'

// Task types
export interface Task {
  id: string
  type: string
  payload: Record<string, unknown>
  createdAt: number
  priority?: number
}

// Add task to queue
export async function addTask(task: Task): Promise<void> {
  const redis = getRedis()
  await redis.lpush(TASK_QUEUE, JSON.stringify(task))
}

// Get next task from queue
export async function getNextTask(): Promise<Task | null> {
  const redis = getRedis()
  const taskStr = await redis.rpop(TASK_QUEUE)
  
  if (!taskStr) {
    return null
  }
  
  return JSON.parse(taskStr as string) as Task
}

// Get queue length
export async function getQueueLength(): Promise<number> {
  const redis = getRedis()
  return await redis.llen(TASK_QUEUE)
}

// Store task result
export async function storeTaskResult(taskId: string, result: unknown): Promise<void> {
  const redis = getRedis()
  await redis.set(`${TASK_RESULTS}:${taskId}`, JSON.stringify(result))
}

// Get task result
export async function getTaskResult(taskId: string): Promise<unknown | null> {
  const redis = getRedis()
  const result = await redis.get(`${TASK_RESULTS}:${taskId}`)
  return result as unknown
}

// Peek at next task without removing
export async function peekTask(): Promise<Task | null> {
  const redis = getRedis()
  const taskStr = await redis.lindex(TASK_QUEUE, -1)
  
  if (!taskStr) {
    return null
  }
  
  return JSON.parse(taskStr as string) as Task
}

// Clear queue (for testing)
export async function clearQueue(): Promise<void> {
  const redis = getRedis()
  await redis.del(TASK_QUEUE)
}
