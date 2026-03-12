'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import TaskProgress from "@/components/TaskProgress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Task {
  id: string
  title: string
  description: string
  status: string
  agent: { displayName: string } | null
  createdAt: string
}

interface Stats {
  total: number
  inProgress: number
  completed: number
  pending: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, inProgress: 0, completed: 0, pending: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard')
      return
    }

    if (status === 'authenticated') {
      fetchTasks()
    }
  }, [status, router])

  const fetchTasks = async () => {
    try {
      const userId = (session?.user as any)?.id
      if (!userId) return

      const res = await fetch(`/api/tasks?userId=${userId}`)
      const data = await res.json()

      if (data.tasks) {
        setTasks(data.tasks)
        setStats({
          total: data.tasks.length,
          inProgress: data.tasks.filter((t: Task) => t.status === 'in_progress').length,
          completed: data.tasks.filter((t: Task) => t.status === 'completed').length,
          pending: data.tasks.filter((t: Task) => t.status === 'pending').length,
        })
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">加载中...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">欢迎回来，{session?.user?.name || '用户'}!</h1>
              <p className="text-muted-foreground">
                管理您的任务和 AI 员工团队
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{session?.user?.email}</Badge>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                退出登录
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总任务数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">进行中</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.inProgress}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">已完成</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">待处理</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.pending}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/tasks')}>
              <CardHeader>
                <CardTitle className="text-lg">➕ 创建任务</CardTitle>
                <CardDescription>发布新任务给 AI 员工</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/agents')}>
              <CardHeader>
                <CardTitle className="text-lg">🤖 AI 员工</CardTitle>
                <CardDescription>查看可雇佣的 AI 员工</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/team')}>
              <CardHeader>
                <CardTitle className="text-lg">👥 我的团队</CardTitle>
                <CardDescription>管理您的 AI 员工团队</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Recent Tasks */}
          <div>
            <h2 className="text-2xl font-bold mb-4">最近任务</h2>
            {tasks.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>暂无任务</p>
                  <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => router.push('/tasks')}
                  >
                    创建第一个任务 →
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {tasks.slice(0, 5).map((task) => (
                  <TaskProgress
                    key={task.id}
                    taskId={task.id}
                    title={task.title}
                    status={task.status as any}
                    progress={task.status === 'completed' ? 100 : task.status === 'in_progress' ? 50 : 0}
                    agentName={task.agent?.displayName || '未分配'}
                    logs={[]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
