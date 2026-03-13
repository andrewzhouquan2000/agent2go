import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/agents - Get all agents
export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { name: 'asc' }
    })

    // Add caching headers
    const response = NextResponse.json({ agents });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return response;
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
    // Validate Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type 必须为 application/json' },
        { status: 415 }
      );
    }

    const body = await request.json()
    
    // Validate payload size
    const payloadSize = JSON.stringify(body).length;
    if (payloadSize > 50000) { // 50KB limit for agent config
      return NextResponse.json(
        { error: '请求数据过大' },
        { status: 413 }
      );
    }

    const { name, displayName, description, capabilities, avatar } = body

    // Validation
    if (!name || !displayName) {
      return NextResponse.json(
        { error: '名称和显示名称不能为空' },
        { status: 400 }
      )
    }

    // Validate field lengths
    if (name.length > 100) {
      return NextResponse.json(
        { error: '名称长度不能超过 100 字符' },
        { status: 400 }
      );
    }

    if (displayName.length > 100) {
      return NextResponse.json(
        { error: '显示名称长度不能超过 100 字符' },
        { status: 400 }
      );
    }

    if (description && description.length > 1000) {
      return NextResponse.json(
        { error: '描述长度不能超过 1000 字符' },
        { status: 400 }
      );
    }

    const agent = await prisma.agent.create({
      data: {
        name,
        displayName,
        description: description || '',
        category: 'custom',
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
