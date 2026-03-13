'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Agent {
  id: string
  name: string
  displayName: string
  status: 'running' | 'paused' | 'error'
  todayCount: number
  description: string
}

interface BusinessMetrics {
  conversations: number
  resolutionRate: number
  timeSaved: number
  trend: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([])
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    conversations: 0,
    resolutionRate: 0,
    timeSaved: 0,
    trend: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [agentLimit] = useState(5) // Free tier limit

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
      // TODO: Replace with actual API calls
      // Simulated data for now
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock data
      setAgents([
        {
          id: '1',
          name: 'customer-service',
          displayName: '客服小助手',
          status: 'running',
          todayCount: 23,
          description: '自动回复客户咨询',
        },
        {
          id: '2',
          name: 'marketing',
          displayName: '营销文案助手',
          status: 'running',
          todayCount: 5,
          description: '生成营销文案',
        },
      ])

      setMetrics({
        conversations: 1234,
        resolutionRate: 89,
        timeSaved: 12,
        trend: 23,
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">正在加载您的数据...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || '用户'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-4 sm:py-8 px-3 sm:px-0">
        <div className="space-y-6 sm:space-y-8">
          {/* Header - Mobile First: Stacked Layout */}
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold">早上好，{userName}！</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                查看您的 AI 员工工作情况和业务数据
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {session?.user?.email}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                className="h-9 sm:h-10 text-sm"
                onClick={() => router.push('/agents/new')}
              >
                ➕ 创建 Agent
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 sm:h-10 text-sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                退出
              </Button>
            </div>
          </div>

          {/* Business Metrics - Card Layout for Mobile */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-semibold">本月概览</h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">对话次数</CardTitle>
                  <span className="text-xl sm:text-2xl">💬</span>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{metrics.conversations.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 font-medium">↑{metrics.trend}%</span> 较上月
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">问题解决率</CardTitle>
                  <span className="text-xl sm:text-2xl">✅</span>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{metrics.resolutionRate}%</div>
                  <Progress value={metrics.resolutionRate} className="mt-2 h-1" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">节省时间</CardTitle>
                  <span className="text-xl sm:text-2xl">⏰</span>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{metrics.timeSaved} 小时</div>
                  <p className="text-xs text-muted-foreground">
                    相当于 {Math.round(metrics.timeSaved / 8)} 个工作日
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions - Vertical Stack on Mobile */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <Card 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push('/agents/new')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">➕ 创建新 Agent</CardTitle>
                <CardDescription className="text-xs sm:text-sm">3 步，10 分钟完成</CardDescription>
              </CardHeader>
            </Card>
            <Card 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push('/templates')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">📚 使用教程</CardTitle>
                <CardDescription className="text-xs sm:text-sm">快速上手指南</CardDescription>
              </CardHeader>
            </Card>
            <Card 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push('/pricing')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">💎 升级专业版</CardTitle>
                <CardDescription className="text-xs sm:text-sm">解锁更多功能</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* My Agents */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold">我的 Agent</h2>
              <Badge variant="outline" className="text-xs">
                {agents.length}/{agentLimit} 免费
              </Badge>
            </div>

            {agents.length === 0 ? (
              <Card>
                <CardContent className="py-8 sm:py-12 text-center space-y-3 sm:space-y-4">
                  <div className="text-5xl sm:text-6xl">🤖</div>
                  <div className="space-y-2">
                    <p className="text-base sm:text-lg font-medium">还没有 Agent</p>
                    <p className="text-sm text-muted-foreground">
                      创建您的第一个 AI 员工，10 分钟即可完成
                    </p>
                  </div>
                  <Button onClick={() => router.push('/agents/new')} className="h-10 sm:h-11">
                    创建第一个 Agent
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {agents.map((agent) => (
                  <Card key={agent.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1 flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg truncate">{agent.displayName}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm truncate">{agent.description}</CardDescription>
                        </div>
                        <Badge variant={agent.status === 'running' ? 'default' : 'secondary'} className="text-xs whitespace-nowrap">
                          {agent.status === 'running' ? '● 运行中' : '○ 已暂停'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        今天 {agent.todayCount} 次对话
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 h-9 text-xs sm:text-sm">
                          查看数据
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-9 text-xs sm:text-sm">
                          调整配置
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add New Agent Card */}
                {agents.length < agentLimit && (
                  <Card 
                    className="hover:shadow-md transition-shadow cursor-pointer border-dashed"
                    onClick={() => router.push('/agents/new')}
                  >
                    <CardContent className="py-8 sm:py-12 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">➕</div>
                      <p className="text-sm sm:text-base font-medium">创建新 Agent</p>
                      <p className="text-xs text-muted-foreground">
                        剩余 {agentLimit - agents.length} 个免费名额
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Usage & Upgrade - Mobile Friendly */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="py-4 sm:py-6">
              <div className="flex flex-col gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-sm sm:text-base font-medium">
                    用量：{agents.length}/{agentLimit} Agent（免费）
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    剩余 {agentLimit - agents.length} 个免费名额
                  </p>
                </div>
                <Button asChild className="w-full sm:w-auto h-10 sm:h-11">
                  <a href="/pricing">
                    升级到专业版 ¥99/月 →
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
