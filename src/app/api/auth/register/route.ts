import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import getPrisma from '@/lib/prisma'

// Input sanitization helper
function sanitizeInput(input: string): string {
  return input.replace(/[<>\"'&]/g, (char) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '&': '&amp;'
    };
    return entities[char] || char;
  });
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    // Validate Content-Type header
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type 必须为 application/json' },
        { status: 415 }
      );
    }

    const body = await request.json()
    const { email, password, name } = body

    // Validate payload size (prevent large payload attacks)
    const payloadSize = JSON.stringify(body).length;
    if (payloadSize > 10000) { // 10KB limit
      return NextResponse.json(
        { error: '请求数据过大' },
        { status: 413 }
      );
    }

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少为 6 位' },
        { status: 400 }
      )
    }

    // Validate name length and sanitize
    if (name && name.length > 100) {
      return NextResponse.json(
        { error: '昵称长度不能超过 100 字符' },
        { status: 400 }
      );
    }

    // Check if user exists
    const prisma = getPrisma()
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user (sanitize name to prevent XSS)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name ? sanitizeInput(name) : email.split('@')[0],
      }
    })

    return NextResponse.json(
      { 
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
}
