'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

const categoryLabels: Record<string, string> = {
  content: '内容创作',
  ecommerce: '电商运营',
  marketing: '营销推广',
  analytics: '数据分析',
  support: '客户服务',
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      if (search) params.set('search', search);

      const res = await fetch(`/api/templates?${params.toString()}`);
      const data = await res.json();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchTemplates();
    }, 300);
    return () => clearTimeout(debounce);
  }, [search, category]);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      !search ||
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || template.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-8 sm:py-12 md:py-24 text-center px-4">
          <h1 className="font-heading text-2xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
            Agent 模板，开箱即用
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            基于真实业务场景设计的 AI Agent 模板
            <br className="hidden sm:block" />
            选择模板，一键创建专属 AI 员工
          </p>
        </section>

        {/* Search & Filter */}
        <section className="container py-4 px-3 sm:px-0">
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <Input
              placeholder="搜索模板..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="全部分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="content">内容创作</SelectItem>
                <SelectItem value="ecommerce">电商运营</SelectItem>
                <SelectItem value="marketing">营销推广</SelectItem>
                <SelectItem value="analytics">数据分析</SelectItem>
                <SelectItem value="support">客户服务</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Templates Grid */}
        <section className="container py-8 sm:py-12 px-3 sm:px-0">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">加载中...</div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              暂无匹配的模板
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="text-3xl sm:text-4xl">
                        {getIconForCategory(template.category)}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {categoryLabels[template.category] || template.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg sm:text-xl mt-2">
                      {template.name}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    {template.config.skills && (
                      <ul className="space-y-1.5 sm:space-y-2">
                        {template.config.skills.slice(0, 4).map((skill, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-xs sm:text-sm"
                          >
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span className="text-muted-foreground">{skill}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button className="w-full h-10 sm:h-11 text-sm sm:text-base" asChild>
                      <a href={`/templates/${template.id}/create`}>使用此模板</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* How It Works */}
        <section className="container py-8 sm:py-12 md:py-24 bg-muted rounded-lg px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
              3 步创建你的 AI 员工
            </h2>
            <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3">
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                  1
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">选择模板</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  根据您的业务需求，选择合适的 Agent 模板
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                  2
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">填写名称</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  为你的 AI 员工起个名字，快速完成创建
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                  3
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">开始使用</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  AI 员工已就绪，立即开始处理任务
                </p>
              </div>
            </div>
          </div>
        </section>
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
