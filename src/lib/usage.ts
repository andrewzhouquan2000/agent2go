/**
 * Usage Tracking Library
 * Tracks user usage for billing and rate limiting
 */

import getPrisma from './prisma'

interface UsageRecord {
  userId: string
  date: Date
  taskCount: number
  tokenCount: number
  costCents: number
}

/**
 * Track task execution for a user
 */
export async function trackTaskUsage(
  userId: string,
  tokenCount: number = 0
): Promise<UsageRecord> {
  const prisma = getPrisma()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Calculate cost based on provider (simplified)
  // OpenAI: ~$0.15 per 1M tokens for gpt-4o-mini
  // Claude: ~$3 per 1M tokens for claude-3-5-sonnet
  const costCents = Math.round((tokenCount * 0.15) / 10000) // ~0.15 cents per 1K tokens
  
  const record = await prisma.userUsage.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      }
    },
    update: {
      taskCount: { increment: 1 },
      tokenCount: { increment: tokenCount },
      costCents: { increment: costCents },
    },
    create: {
      userId,
      date: today,
      taskCount: 1,
      tokenCount,
      costCents,
    }
  })
  
  return record
}

/**
 * Get user usage for a date range
 */
export async function getUserUsage(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<UsageRecord[]> {
  const prisma = getPrisma()
  
  const records = await prisma.userUsage.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      }
    },
    orderBy: { date: 'asc' }
  })
  
  return records
}

/**
 * Get current month usage summary
 */
export async function getMonthlyUsageSummary(userId: string): Promise<{
  totalTasks: number
  totalTokens: number
  totalCostCents: number
  dailyAverage: number
}> {
  const prisma = getPrisma()
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  const records = await prisma.userUsage.findMany({
    where: {
      userId,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      }
    }
  })
  
  const totalTasks = records.reduce((sum, r) => sum + r.taskCount, 0)
  const totalTokens = records.reduce((sum, r) => sum + r.tokenCount, 0)
  const totalCostCents = records.reduce((sum, r) => sum + r.costCents, 0)
  
  const daysInMonth = endOfMonth.getDate()
  const daysPassed = now.getDate()
  const dailyAverage = daysPassed > 0 ? totalTasks / daysPassed : 0
  
  return {
    totalTasks,
    totalTokens,
    totalCostCents,
    dailyAverage,
  }
}

/**
 * Check if user has exceeded their plan limits
 */
export async function checkUsageLimit(
  userId: string,
  plan: 'free' | 'pro' | 'enterprise'
): Promise<{
  allowed: boolean
  remaining: number
  limit: number
}> {
  const limits = {
    free: 10,      // 10 tasks per day
    pro: 100,      // 100 tasks per day
    enterprise: -1 // unlimited
  }
  
  if (plan === 'enterprise') {
    return { allowed: true, remaining: -1, limit: -1 }
  }
  
  const prisma = getPrisma()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const usage = await prisma.userUsage.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      }
    }
  })
  
  const currentCount = usage?.taskCount || 0
  const limit = limits[plan]
  const remaining = limit - currentCount
  
  return {
    allowed: remaining > 0,
    remaining,
    limit,
  }
}
