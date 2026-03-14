/**
 * Worker Test Script
 * 
 * Adds test tasks to the queue and verifies processing
 */

import { addTask, clearQueue, getQueueLength, Task, getTaskResult } from '../src/lib/queue'

async function runTest(): Promise<void> {
  console.log('=== Worker Test ===\n')

  try {
    // Clear queue
    console.log('1. Clearing queue...')
    await clearQueue()
    console.log('   Queue cleared\n')

    // Add test tasks
    console.log('2. Adding test tasks...')
    const tasks: Task[] = [
      {
        id: 'test-1',
        type: 'test',
        payload: { message: 'Hello from task 1!' },
        createdAt: Date.now(),
        priority: 1,
      },
      {
        id: 'test-2',
        type: 'test',
        payload: { message: 'Hello from task 2!' },
        createdAt: Date.now(),
        priority: 2,
      },
    ]

    for (const task of tasks) {
      await addTask(task)
      console.log(`   Added: ${task.id}`)
    }
    console.log()

    // Check queue length
    const length = await getQueueLength()
    console.log(`3. Queue length: ${length}\n`)

    // Simulate worker processing
    console.log('4. Simulating worker processing...')
    console.log('   (Run `npm run worker` in another terminal to process tasks)\n')

    console.log('=== Test Complete ===')
    console.log('\nNext steps:')
    console.log('1. Run `npm run worker` to start the worker')
    console.log('2. Watch the worker process tasks from the queue')
    console.log('3. Check task results in Redis')
  } catch (error) {
    console.error('Test failed:', error)
    process.exit(1)
  }
}

runTest()
