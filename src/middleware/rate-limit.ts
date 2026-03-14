/**
 * Rate Limit Middleware
 * Limits request frequency based on user subscription plan
 */

import { NextRequest, NextResponse } from 'next/server'
import getPrisma from '@/lib/prisma'
import { checkUsageLimit } from '@/lib/usage'

interface RateLimitConfig {
  free: {
    requestsPerMinute: number
    requestsPerHour: number
    requestsPerDay: number
  }
  pro: {
    requestsPerMinute: number
    requestsPerHour: number
    requestsPerDay: number
  }
  enterprise: {
    requestsPerMinute: number
    requestsPerHour: number
    requestsPerDay: number
  }
}

const RATE_LIMITS: RateLimitConfig = {
  free: {
    requestsPerMinute: 5,
    requestsPerHour: 50,
    requestsPerDay: 100,
  },
  pro: {
    requestsPerMinute: 30,
    requestsPerHour: 500,
    requestsPerDay: 5000,
  },
  enterprise: {
    requestsPerMinute: 100,
    requestsPerHour: 2000,
    requestsPerDay: 50000,
  },
}

interface RateLimitRecord {
  id: string
  userId: string
  endpoint: string
  window: string
  count: number
  resetAt: Date
}

/**
 * Check and update rate limit for a user
 */
export async function checkRateLimit(
  request: NextRequest,
  userId: string,
  userPlan: 'free' | 'pro' | 'enterprise' = 'free'
): Promise<{
  allowed: boolean
  remaining: number
  resetAt: Date
  limit: number
}> {
  const prisma = getPrisma()
  const endpoint = request.nextUrl.pathname
  const now = new Date()
  
  const limits = RATE_LIMITS[userPlan]
  
  // Check minute window
  const minuteReset = new Date(now.getTime() + 60 * 1000)
  const minuteLimit = await checkWindow(
    prisma,
    userId,
    endpoint,
    'minute',
    limits.requestsPerMinute,
    minuteReset
  )
  
  if (!minuteLimit.allowed) {
    return minuteLimit
  }
  
  // Check hour window
  const hourReset = new Date(now.getTime() + 60 * 60 * 1000)
  const hourLimit = await checkWindow(
    prisma,
    userId,
    endpoint,
    'hour',
    limits.requestsPerHour,
    hourReset
  )
  
  if (!hourLimit.allowed) {
    return hourLimit
  }
  
  // Check day window
  const dayReset = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  dayReset.setHours(0, 0, 0, 0)
  const dayLimit = await checkWindow(
    prisma,
    userId,
    endpoint,
    'day',
    limits.requestsPerDay,
    dayReset
  )
  
  return dayLimit
}

/**
 * Check a single time window
 */
async function checkWindow(
  prisma: any,
  userId: string,
  endpoint: string,
  window: string,
  limit: number,
  resetAt: Date
): Promise<{
  allowed: boolean
  remaining: number
  resetAt: Date
  limit: number
}> {
  const record = await prisma.rateLimit.findUnique({
    where: {
      userId_endpoint_window: {
        userId,
        endpoint,
        window,
      }
    }
  })
  
  const now = new Date()
  
  // Reset if expired
  if (record && record.resetAt <= now) {
    await prisma.rateLimit.update({
      where: { id: record.id },
      data: { count: 0, resetAt }
    })
    return { allowed: true, remaining: limit, resetAt, limit }
  }
  
  // Create new record if doesn't exist
  if (!record) {
    await prisma.rateLimit.create({
      data: {
        userId,
        endpoint,
        window,
        count: 1,
        resetAt,
      }
    })
    return { allowed: true, remaining: limit - 1, resetAt, limit }
  }
  
  // Check if limit exceeded
  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
      limit,
    }
  }
  
  // Increment count
  await prisma.rateLimit.update({
    where: { id: record.id },
    data: { count: { increment: 1 } }
  })
  
  return {
    allowed: true,
    remaining: limit - record.count - 1,
    resetAt: record.resetAt,
    limit,
  }
}

/**
 * Rate limit middleware wrapper for API routes
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean
    plan?: 'free' | 'pro' | 'enterprise'
  } = {}
) {
  return async function (request: NextRequest): Promise<NextResponse> {
    try {
      // Get user from request (assuming auth middleware sets userId)
      const userId = request.headers.get('x-user-id')
      const userPlan = (request.headers.get('x-user-plan') as 'free' | 'pro' | 'enterprise') || 'free'
      
      if (options.requireAuth && !userId) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
      
      if (userId) {
        const rateLimit = await checkRateLimit(request, userId, userPlan)
        
        // Add rate limit headers
        const response = await handler(request)
        response.headers.set('X-RateLimit-Limit', rateLimit.limit.toString())
        response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
        response.headers.set('X-RateLimit-Reset', rateLimit.resetAt.toISOString())
        
        if (!rateLimit.allowed) {
          return NextResponse.json(
            { 
              error: 'Rate limit exceeded',
              retryAfter: Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000)
            },
            { 
              status: 429,
              headers: {
                'Retry-After': Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000).toString()
              }
            }
          )
        }
        
        return response
      }
      
      return handler(request)
    } catch (error) {
      console.error('Rate limit error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}
