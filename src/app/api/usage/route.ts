import { NextRequest, NextResponse } from 'next/server'
import getPrisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/usage - Get current user's usage stats
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const prisma = getPrisma()
    
    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // Get task count for current month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const taskCount = await prisma.task.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfMonth,
        },
      },
    })

    // TODO: Get actual quota from user's subscription plan
    // For now, using free tier limit
    const monthlyQuota = 100
    const remainingQuota = monthlyQuota - taskCount

    return NextResponse.json({
      usage: {
        totalTasks: taskCount,
        monthlyQuota,
        remainingQuota: Math.max(0, remainingQuota),
        resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
      },
    })
  } catch (error) {
    console.error('Error fetching usage:', error)
    return NextResponse.json(
      { error: '获取用量数据失败' },
      { status: 500 }
    )
  }
}
