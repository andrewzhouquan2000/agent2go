import type { NextApiRequest, NextApiResponse } from 'next'
import { addTask, getNextTask, getQueueLength, Task } from '@/lib/queue'
import { getPrisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { action } = req.query

  try {
    if (action === 'add') {
      // Add a test task
      const task: Task = {
        id: `task-${Date.now()}`,
        type: 'test',
        payload: { message: 'Hello from queue!' },
        createdAt: Date.now(),
        priority: 1,
      }

      await addTask(task)
      return res.status(200).json({ success: true, task })
    }

    if (action === 'get') {
      // Get next task
      const task = await getNextTask()
      return res.status(200).json({ success: true, task })
    }

    if (action === 'length') {
      // Get queue length
      const length = await getQueueLength()
      return res.status(200).json({ success: true, length })
    }

    return res.status(400).json({ error: 'Invalid action. Use: add, get, or length' })
  } catch (error) {
    console.error('Queue test error:', error)
    return res.status(500).json({ error: 'Queue operation failed', details: (error as Error).message })
  }
}
