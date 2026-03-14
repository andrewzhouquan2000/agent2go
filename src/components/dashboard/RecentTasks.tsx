'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Task {
  id: string
  title: string
  status: string
  createdAt: string
  agent?: {
    name: string
  }
}

interface RecentTasksProps {
  limit?: number
}

export default function RecentTasks({ limit = 5 }: RecentTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchTasks()
  }, [refreshKey])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks')
      const data = await res.json()
      const allTasks = data.tasks || []
      setTasks(allTasks.slice(0, limit))
    } catch (error) {
      console.error('Failed to fetch recent tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setRefreshKey(prev => prev + 1)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string, color: string }> = {
      completed: { variant: 'default', label: '已完成', color: 'bg-green-500' },
      running: { variant: 'default', label: '进行中', color: 'bg-blue-500' },
      pending: { variant: 'secondary', label: '等待中', color: 'bg-orange-500' },
      failed: { variant: 'destructive', label: '失败', color: 'bg-red-500' },
    }

    const config = statusConfig[status] || { variant: 'outline' as const, label: status, color: 'bg-gray-500' }

    return (
      <Badge variant={config.variant} className={`${config.color} text-white border-0`}>
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins}分钟前`
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 7) return `${diffDays}天前`
    return date.toLocaleDateString('zh-CN')
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">最近任务</CardTitle>
            <Button variant="outline" size="sm" disabled>
              🔄 刷新
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between py-2">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">最近任务</CardTitle>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              🔄 刷新
            </Button>
          </div>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-500 text-sm">暂无任务</p>
          <p className="text-gray-400 text-xs mt-1">创建一个新任务开始使用</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">最近任务</CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            🔄 刷新
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                  {task.agent && (
                    <span className="text-xs text-gray-500">· {task.agent.name}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{formatDate(task.createdAt)}</p>
              </div>
              <div className="ml-4">
                {getStatusBadge(task.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
