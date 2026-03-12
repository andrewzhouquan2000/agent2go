import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TaskProgress from "@/components/TaskProgress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for demonstration
const mockTasks = [
  {
    id: "1",
    title: "竞品分析报告",
    status: "in_progress" as const,
    progress: 65,
    agentName: "Researcher",
    logs: ["正在收集数据...", "分析中...", "生成报告..."],
  },
  {
    id: "2",
    title: "网站原型设计",
    status: "completed" as const,
    progress: 100,
    agentName: "Designer",
    logs: ["设计完成"],
  },
  {
    id: "3",
    title: "API 开发",
    status: "pending" as const,
    progress: 0,
    agentName: "Coder",
    logs: [],
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">仪表板</h1>
            <p className="text-muted-foreground">
              查看您的任务和团队状态
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总任务数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTasks.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">进行中</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockTasks.filter((t) => t.status === "in_progress").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">已完成</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockTasks.filter((t) => t.status === "completed").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">待处理</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockTasks.filter((t) => t.status === "pending").length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tasks */}
          <div>
            <h2 className="text-2xl font-bold mb-4">最近任务</h2>
            <div className="grid gap-4">
              {mockTasks.map((task) => (
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
