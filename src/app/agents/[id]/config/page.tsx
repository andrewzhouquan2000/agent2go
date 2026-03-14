'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Agent {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  capabilities: string[];
  avatar: string | null;
  goal: string | null;
  backstory: string | null;
}

const models = [
  { value: 'qwen-portal/qwen3.5-plus', label: 'Qwen 3.5 Plus' },
  { value: 'qwen-portal/qwen3-235b-a22b', label: 'Qwen 3 235B' },
  { value: 'deepseek-ai/deepseek-v3-0324', label: 'DeepSeek V3' },
  { value: 'zhipu-ai/glm-4-32b', label: 'GLM-4 32B' },
];

export default function AgentConfigPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    description: '',
    model: 'qwen-portal/qwen3.5-plus',
  });
  const [agentId, setAgentId] = useState('');

  useEffect(() => {
    params.then(({ id }) => {
      setAgentId(id);
      fetchAgent(id);
    });
  }, [params]);

  const fetchAgent = async (id: string) => {
    try {
      const res = await fetch(`/api/agents/${id}`);
      if (!res.ok) throw new Error('Agent not found');
      const data = await res.json();
      setAgent(data.agent);
      setFormData({
        displayName: data.agent.displayName,
        description: data.agent.description,
        model: 'qwen-portal/qwen3.5-plus',
      });
    } catch (error) {
      console.error('Failed to fetch agent:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/agents/${agentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: formData.displayName,
          description: formData.description,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || '保存失败');
      }

      alert('配置已保存');
    } catch (error: any) {
      alert('保存失败：' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">加载中...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">AI 员工不存在</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <Button variant="ghost" onClick={() => router.push('/agents')}>
              ← 返回
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">配置 AI 员工</h1>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{agent.displayName}</CardTitle>
              <CardDescription>{agent.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{agent.category}</Badge>
                {agent.capabilities.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>编辑 AI 员工的名称和描述</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">显示名称</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">描述</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="简短描述 AI 员工的功能"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/agents/${agentId}`)}
                    className="flex-1"
                  >
                    取消
                  </Button>
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? '保存中...' : '保存配置'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>模型选择</CardTitle>
              <CardDescription>选择 AI 员工使用的语言模型</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="model">语言模型</Label>
                <Select
                  value={formData.model}
                  onValueChange={(value) => setFormData({ ...formData, model: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择模型" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  不同模型在性能和成本上有所差异，请根据需求选择
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>高级配置</CardTitle>
              <CardDescription>自定义 Prompt 和高级设置</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-2">🔒 高级功能</p>
                <p className="text-sm">Prompt Editor 等功能将在后续版本开放</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
