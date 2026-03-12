"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TaskFormProps {
  teamId?: string;
  isSubmitting?: boolean;
  onSubmit?: (task: { title: string; description: string; teamId?: string; agentId?: string }) => Promise<{ success: boolean; error?: string } | void>;
}

export default function TaskForm({ teamId, isSubmitting: externalSubmitting, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isSubmitting = externalSubmitting || internalSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    if (!onSubmit) {
      setMessage({ type: 'error', text: '提交处理函数未提供' });
      return
    }

    setInternalSubmitting(true);

    try {
      const result = await onSubmit({ title, description, teamId });
      
      if (result?.success === false) {
        setMessage({ type: 'error', text: result.error || '提交失败' });
      } else {
        setMessage({ type: 'success', text: '任务发布成功！' });
        setTitle("");
        setDescription("");
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : '提交失败' 
      });
    } finally {
      setInternalSubmitting(false);
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
          {message && (
            <div className={`p-3 text-sm rounded ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-600' 
                : 'bg-red-50 text-red-600'
            }`}>
              {message.text}
            </div>
          )}

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
