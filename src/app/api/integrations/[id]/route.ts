import { NextRequest, NextResponse } from 'next/server'
import getPrisma from '@/lib/prisma'
import { IntegrationType } from '@prisma/client'

// GET /api/integrations/[id] - Get a single integration
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = getPrisma()
    const { id } = await params

    const integration = await prisma.integration.findUnique({
      where: { id }
    })

    if (!integration) {
      return NextResponse.json(
        { error: '集成不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ integration })
  } catch (error) {
    console.error('Error fetching integration:', error)
    return NextResponse.json(
      { error: '获取集成失败' },
      { status: 500 }
    )
  }
}

// PUT /api/integrations/[id] - Update an integration
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = getPrisma()
    const { id } = await params
    const body = await request.json()
    const { type, credentials } = body

    // Check if integration exists
    const existing = await prisma.integration.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: '集成不存在' },
        { status: 404 }
      )
    }

    // Validate integration type if provided
    if (type) {
      const validTypes = Object.values(IntegrationType)
      if (!validTypes.includes(type as IntegrationType)) {
        return NextResponse.json(
          { error: `无效的集成类型。有效值：${validTypes.join(', ')}` },
          { status: 400 }
        )
      }
    }

    const integration = await prisma.integration.update({
      where: { id },
      data: {
        type: type as IntegrationType | undefined,
        credentials: credentials !== undefined ? credentials : undefined,
      }
    })

    return NextResponse.json({ integration })
  } catch (error) {
    console.error('Error updating integration:', error)
    return NextResponse.json(
      { error: '更新集成失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/integrations/[id] - Delete an integration
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = getPrisma()
    const { id } = await params

    // Check if integration exists
    const existing = await prisma.integration.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: '集成不存在' },
        { status: 404 }
      )
    }

    await prisma.integration.delete({
      where: { id }
    })

    return NextResponse.json({ message: '集成已删除' })
  } catch (error) {
    console.error('Error deleting integration:', error)
    return NextResponse.json(
      { error: '删除集成失败' },
      { status: 500 }
    )
  }
}
