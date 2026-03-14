import { NextRequest, NextResponse } from 'next/server'
import getPrisma from '@/lib/prisma'
import { IntegrationType } from '@prisma/client'

// GET /api/integrations - List all integrations (optionally filtered by userId)
export async function GET(request: NextRequest) {
  try {
    const prisma = getPrisma()
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    const where = userId ? { userId } : {}

    const integrations = await prisma.integration.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ integrations })
  } catch (error) {
    console.error('Error fetching integrations:', error)
    return NextResponse.json(
      { error: '获取集成列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/integrations - Create a new integration
export async function POST(request: NextRequest) {
  try {
    const prisma = getPrisma()
    const body = await request.json()
    const { userId, type, credentials } = body

    // Validation
    if (!userId || !type) {
      return NextResponse.json(
        { error: '用户 ID 和集成类型不能为空' },
        { status: 400 }
      )
    }

    // Validate integration type
    const validTypes = Object.values(IntegrationType)
    if (!validTypes.includes(type as IntegrationType)) {
      return NextResponse.json(
        { error: `无效的集成类型。有效值：${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    const integration = await prisma.integration.create({
      data: {
        userId,
        type: type as IntegrationType,
        credentials: credentials || null,
      }
    })

    return NextResponse.json({ integration }, { status: 201 })
  } catch (error) {
    console.error('Error creating integration:', error)
    return NextResponse.json(
      { error: '创建集成失败' },
      { status: 500 }
    )
  }
}
