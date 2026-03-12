import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/agents - Get all agents
export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ agents })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: '获取 AI 员工列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/agents - Create a new agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, displayName, description, capabilities, avatar } = body

    // Validation
    if (!name || !displayName) {
      return NextResponse.json(
        { error: '名称和显示名称不能为空' },
        { status: 400 }
      )
    }

    const agent = await prisma.agent.create({
      data: {
        name,
        displayName,
        description: description || '',
        capabilities: JSON.stringify(capabilities || []),
        avatar: avatar || null,
      }
    })

    return NextResponse.json({ agent }, { status: 201 })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json(
      { error: '创建 AI 员工失败' },
      { status: 500 }
    )
  }
}
