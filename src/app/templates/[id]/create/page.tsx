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

interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string;
  config: {
    role?: string;
    goal?: string;
    skills?: string[];
    [key: string]: any;
  };
}

export default function CreateAgentFromTemplate({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [agentName, setAgentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [templateId, setTemplateId] = useState('');

  useEffect(() => {
    params.then(({ id }) => {
      setTemplateId(id);
      fetchTemplate(id);
    });
  }, [params]);

  const fetchTemplate = async (id: string) => {
    try {
      const res = await fetch(`/api/templates`);
      const templates = await res.json();
      const found = templates.find((t: Template) => t.id === id);
      setTemplate(found);
      if (found) {
        setAgentName(`${found.name} Agent`);
      }
    } catch (error) {
      console.error('Failed to fetch template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template || !agentName.trim()) return;

    setCreating(true);
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: agentName.trim(),
          templateId: template.id,
          config: template.config,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create agent');
      }

      const agent = await res.json();
      router.push(`/agents/${agent.id}/config`);
    } catch (error: any) {
      alert('创建失败：' + error.message);
    } finally {
      setCreating(false);
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

  if (!template) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">模板不存在</div>
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">创建 AI 员工</h1>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{getIconForCategory(template.category)}</div>
                <div>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{template.category}</Badge>
                {template.config.skills?.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>为你的 AI 员工填写名称</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">AI 员工名称</Label>
                  <Input
                    id="name"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="例如：我的内容创作助手"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    取消
                  </Button>
                  <Button type="submit" className="flex-1" disabled={creating || !agentName.trim()}>
                    {creating ? '创建中...' : '创建 AI 员工'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function getIconForCategory(category: string): string {
  const icons: Record<string, string> = {
    content: '✍️',
    ecommerce: '🛒',
    marketing: '📢',
    analytics: '📊',
    support: '💬',
  };
  return icons[category] || '🤖';
}
