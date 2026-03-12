"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TaskForm from "@/components/TaskForm";
import TaskProgress from "@/components/TaskProgress";
import { Card, CardContent } from "@/components/ui/card";

interface Task {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  progress: number;
  agentName?: string;
  logs: string[];
}

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    id: "1",
    title: "竞品分析报告",
    status: "in_progress",
    progress: 65,
    agentName: "Researcher",
    logs: ["正在收集数据...", "分析中..."],
  },
  {
    id: "2",
    title: "网站原型设计",
    status: "completed",
    progress: 100,
    agentName: "Designer",
    logs: ["设计完成"],
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const handleCreateTask = (task: { title: string; description: string; teamId?: string }) => {
    console.log("Task created:", task);
    // Add to local state for demo
    const newTask: Task = {
      id: String(Date.now()),
      title: task.title,
      status: "pending",
      progress: 0,
      agentName: undefined,
      logs: [],
    };
    setTasks([newTask, ...tasks]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">任务管理</h1>
            <p className="text-muted-foreground">
              发布任务并追踪执行进度
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Task Form */}
            <div className="lg:col-span-1">
              <TaskForm onSubmit={handleCreateTask} />
            </div>

            {/* Task List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold">所有任务</h2>
              {tasks.length > 0 ? (
                <div className="grid gap-4">
                  {tasks.map((task) => (
                    <TaskProgress
                      key={task.id}
                      taskId={task.id}
                      title={task.title}
                      status={task.status}
                      progress={task.progress}
                      agentName={task.agentName}
                      logs={task.logs}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    暂无任务，发布您的第一个任务
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
