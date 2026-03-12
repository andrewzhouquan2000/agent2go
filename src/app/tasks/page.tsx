"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TaskForm from "@/components/TaskForm";
import TaskProgress from "@/components/TaskProgress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  agent: { displayName: string } | null;
  logs: string | null;
  createdAt: string;
}

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/tasks')
      return
    }

    if (status === 'authenticated') {
      fetchTasks()
    }
  }, [status, router]);

  const fetchTasks = async () => {
    try {
      const userId = (session?.user as any)?.id
      if (!userId) return

      const res = await fetch(`/api/tasks?userId=${userId}`)
      const data = await res.json()

      if (data.tasks) {
        setTasks(data.tasks)
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = async (task: { title: string; description: string; teamId?: string; agentId?: string }) => {
    if (!session?.user) return

    setIsSubmitting(true)
    try {
      const userId = (session.user as any).id
      
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          description: task.description || '',
          userId,
          teamId: task.teamId || null,
          agentId: task.agentId || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '创建任务失败')
      }

      // Refresh task list
      await fetchTasks()
      
      return { success: true }
    } catch (error) {
      console.error('Failed to create task:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '创建任务失败' 
      }
    } finally {
      setIsSubmitting(false)
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
          <div>
            <h1 className="text-3xl font-bold">任务管理</h1>
            <p className="text-muted-foreground">
              发布任务并追踪 AI 员工执行进度
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Task Form */}
            <div className="lg:col-span-1">
              <TaskForm 
                onSubmit={handleCreateTask}
                isSubmitting={isSubmitting}
              />
            </div>

            {/* Task List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">所有任务</h2>
                <Button variant="outline" size="sm" onClick={fetchTasks}>
                  🔄 刷新
                </Button>
              </div>
              {tasks.length > 0 ? (
                <div className="grid gap-4">
                  {tasks.map((task) => (
                    <TaskProgress
                      key={task.id}
                      taskId={task.id}
                      title={task.title}
                      status={task.status}
                      progress={task.status === 'completed' ? 100 : task.status === 'in_progress' ? 50 : 0}
                      agentName={task.agent?.displayName || '未分配'}
                      logs={task.logs ? JSON.parse(task.logs) : []}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground mb-4">暂无任务</p>
                    <p className="text-sm text-muted-foreground">
                      在左侧表单中填写任务信息，发布您的第一个任务
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
