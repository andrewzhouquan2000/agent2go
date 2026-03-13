import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/tasks - Get all tasks (optionally filtered by userId)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    const where = userId ? { userId } : {}

    const tasks = await prisma.task.findMany({
      where,
      include: {
        agent: true,
        team: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: '获取任务列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, userId, teamId, agentId } = body

    // Validation
    if (!title || !userId) {
      return NextResponse.json(
        { error: '标题和用户 ID 不能为空' },
        { status: 400 }
      )
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        status: 'pending',
        userId,
        teamId: teamId || null,
        agentId: agentId || null,
      },
      include: {
        agent: true,
        team: true,
      }
    })

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: '创建任务失败' },
      { status: 500 }
    )
  }
}
