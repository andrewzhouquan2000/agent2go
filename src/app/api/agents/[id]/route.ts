import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';

// GET /api/agents/[id] - Get a single agent
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = getPrisma();
    const { id } = await params;

    const agent = await prisma.agent.findUnique({
      where: { id },
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'AI 员工不存在' },
        { status: 404 }
      );
    }

    // Parse capabilities JSON
    const agentWithParsedCapabilities = {
      ...agent,
      capabilities: JSON.parse(agent.capabilities as string) || [],
    };

    return NextResponse.json({ agent: agentWithParsedCapabilities });
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      { error: '获取 AI 员工信息失败' },
      { status: 500 }
    );
  }
}

// PUT /api/agents/[id] - Update an agent
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = getPrisma();
    const { id } = await params;

    // Validate Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type 必须为 application/json' },
        { status: 415 }
      );
    }

    const body = await request.json();

    // Validate payload size
    const payloadSize = JSON.stringify(body).length;
    if (payloadSize > 50000) {
      return NextResponse.json(
        { error: '请求数据过大' },
        { status: 413 }
      );
    }

    const { displayName, description } = body;

    // Validation
    if (!displayName) {
      return NextResponse.json(
        { error: '显示名称不能为空' },
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

    // Check if agent exists
    const existingAgent = await prisma.agent.findUnique({
      where: { id },
    });

    if (!existingAgent) {
      return NextResponse.json(
        { error: 'AI 员工不存在' },
        { status: 404 }
      );
    }

    const agent = await prisma.agent.update({
      where: { id },
      data: {
        displayName,
        description: description || existingAgent.description,
      },
    });

    return NextResponse.json({ agent });
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { error: '更新 AI 员工失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/agents/[id] - Delete an agent
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = getPrisma();
    const { id } = await params;

    await prisma.agent.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      { error: '删除 AI 员工失败' },
      { status: 500 }
    );
  }
}
