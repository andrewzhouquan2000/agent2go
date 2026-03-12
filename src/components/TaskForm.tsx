"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TaskFormProps {
  teamId?: string;
  onSubmit?: (task: { title: string; description: string; teamId?: string }) => void;
}

export default function TaskForm({ teamId, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        onSubmit({ title, description, teamId });
      }
      // TODO: Implement API call to create task
      console.log("Creating task:", { title, description, teamId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>发布新任务</CardTitle>
        <CardDescription>
          描述您的任务，AI 团队将为您执行
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">任务标题</Label>
            <Input
              id="task-title"
              placeholder="例如：竞品分析报告"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">任务描述</Label>
            <Textarea
              id="task-description"
              placeholder="详细描述您的需求、期望结果和任何特殊要求..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting || !title || !description} className="w-full">
            {isSubmitting ? "发布中..." : "发布任务"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
