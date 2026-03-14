import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const prisma = getPrisma()
    const { sessionId } = await params;
    
    const messages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
    
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const prisma = getPrisma()
    const { sessionId } = await params;
    const body = await request.json();
    const { senderType, senderName, senderRole, content, metadata } = body;
    
    if (!senderType || !senderName || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Verify session exists
    const session = await prisma.taskSession.findUnique({
      where: { id: sessionId },
    });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }
    
    const message = await prisma.message.create({
      data: {
        sessionId,
        senderType,
        senderName,
        senderRole: senderRole || null,
        content,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
    
    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
