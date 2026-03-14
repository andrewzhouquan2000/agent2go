'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/dashboard/BottomNav'
import StatsCards from '@/components/dashboard/StatsCards'
import RecentTasks from '@/components/dashboard/RecentTasks'
import UsageWidget from '@/components/dashboard/UsageWidget'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DashboardStats {
  totalTasks: number
  successCount: number
  runningCount: number
  remainingQuota: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    successCount: 0,
    runningCount: 0,
    remainingQuota: 100,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard')
      return
    }

    if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status, router])

  const fetchDashboardData = async () => {
    try {
      // Fetch tasks
      const tasksRes = await fetch('/api/tasks')
      const tasksData = await tasksRes.json()
      const tasks = tasksData.tasks || []

      // Calculate stats from tasks
      const totalTasks = tasks.length
      const successCount = tasks.filter((t: any) => t.status === 'completed').length
      const runningCount = tasks.filter((t: any) => t.status === 'running' || t.status === 'pending').length

      // Fetch usage from API
      let remainingQuota = 100
      try {
        const usageRes = await fetch('/api/usage')
        if (usageRes.ok) {
          const usageData = await usageRes.json()
          remainingQuota = usageData.usage?.remainingQuota ?? 100
        }
      } catch (usageError) {
        console.warn('Failed to fetch usage, using default:', usageError)
      }

      setStats({
        totalTasks,
        successCount,
        runningCount,
        remainingQuota,
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Blue Navbar - Solid #2563EB */}
        <header className="bg-[#2563EB] text-white px-4 py-3 shadow-md">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Agent2Go</h1>
            <div className="w-8 h-8 bg-white/20 rounded-full"></div>
          </div>
        </header>

        {/* Loading Content */}
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="text-gray-500">正在加载...</p>
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || '用户'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Blue Navbar - Solid #2563EB */}
      <header className="bg-[#2563EB] text-white px-4 py-3 shadow-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Agent2Go</h1>
            <p className="text-xs text-blue-100">AI 工作流编排平台</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {session?.user?.email?.split('@')[0]}
            </Badge>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
              {userName[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">欢迎回来，{userName}</h2>
            <p className="text-sm text-gray-500">查看您的 AI Agent 运行情况</p>
          </div>

          {/* Stats Cards - 4 Metrics */}
          <StatsCards
            totalTasks={stats.totalTasks}
            successCount={stats.successCount}
            runningCount={stats.runningCount}
            remainingQuota={stats.remainingQuota}
          />

          {/* Usage Widget */}
          <UsageWidget />

          {/* Recent Tasks */}
          <RecentTasks limit={5} />

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">快速操作</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.push('/agents/new')}
                className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all text-left"
              >
                <div className="text-2xl mb-2">➕</div>
                <div className="font-medium text-gray-900">创建 Agent</div>
                <div className="text-xs text-gray-500 mt-1">3 步快速创建</div>
              </button>
              <button
                onClick={() => router.push('/workflows')}
                className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all text-left"
              >
                <div className="text-2xl mb-2">🔗</div>
                <div className="font-medium text-gray-900">工作流</div>
                <div className="text-xs text-gray-500 mt-1">可视化编排</div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
