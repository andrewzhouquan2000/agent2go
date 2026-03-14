'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface UsageData {
  usedQuota: number
  totalQuota: number
  remainingQuota: number
  resetDate?: string
}

export default function UsageWidget() {
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsage()
  }, [])

  const fetchUsage = async () => {
    try {
      const res = await fetch('/api/usage')
      if (res.ok) {
        const data = await res.json()
        setUsage(data.usage || { usedQuota: 0, totalQuota: 100, remainingQuota: 100 })
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">额度使用情况</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
            <div className="animate-pulse h-2 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!usage) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">额度使用情况</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500 text-sm">无法加载额度信息</p>
        </CardContent>
      </Card>
    )
  }

  const usagePercent = Math.min((usage.usedQuota / usage.totalQuota) * 100, 100)
  const isOverLimit = usage.remainingQuota <= 0
  const isWarning = usage.remainingQuota < 20 && !isOverLimit

  return (
    <Card className={isOverLimit ? 'border-red-500 border-2' : ''}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">额度使用情况</CardTitle>
          {isOverLimit && (
            <Badge variant="destructive" className="bg-red-500 text-white border-0">
              ⚠️ 已超额
            </Badge>
          )}
          {isWarning && !isOverLimit && (
            <Badge variant="secondary" className="bg-orange-500 text-white border-0">
              ⚠️ 即将用完
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">已用 {usage.usedQuota} / {usage.totalQuota}</span>
            <span className={`font-medium ${isOverLimit ? 'text-red-600' : isWarning ? 'text-orange-600' : 'text-gray-900'}`}>
              剩余 {usage.remainingQuota}
            </span>
          </div>
          <Progress 
            value={usagePercent} 
            className={`h-2 ${isOverLimit ? 'bg-red-100' : isWarning ? 'bg-orange-100' : 'bg-gray-100'}`}
          />
        </div>

        {/* Reset Date */}
        {usage.resetDate && (
          <div className="text-xs text-gray-500">
            📅 额度重置：{new Date(usage.resetDate).toLocaleDateString('zh-CN')}
          </div>
        )}

        {/* Over Limit Warning */}
        {isOverLimit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700 font-medium">⚠️ 额度已用完</p>
            <p className="text-xs text-red-600 mt-1">请升级套餐或等待下月重置</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
