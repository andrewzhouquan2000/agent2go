"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TaskProgressProps {
  taskId: string;
  title: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  progress: number;
  agentName?: string;
  logs?: string[];
}

export default function TaskProgress({
  taskId,
  title,
  status,
  progress,
  agentName,
  logs,
}: TaskProgressProps) {
  const getStatusBadge = () => {
    const statusConfig = {
      pending: { label: "待处理", variant: "secondary" as const },
      in_progress: { label: "进行中", variant: "default" as const },
      completed: { label: "已完成", variant: "success" as const },
      failed: { label: "失败", variant: "destructive" as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>
            {agentName ? `执行 Agent: ${agentName}` : "未分配 Agent"}
          </CardDescription>
        </div>
        {getStatusBadge()}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>进度</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {logs && logs.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">执行日志:</p>
            <div className="rounded-md bg-muted p-3 font-mono text-xs">
              {logs.slice(-5).map((log, index) => (
                <div key={index} className="text-muted-foreground">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
