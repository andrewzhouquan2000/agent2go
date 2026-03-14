'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/dashboard/BottomNav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Integration {
  id: string
  userId: string
  type: string
  credentials: any
  createdAt: string
  updatedAt: string
}

const integrationIcons: Record<string, string> = {
  OpenAI: '🤖',
  Anthropic: '🧠',
  Stripe: '💳',
  Shopify: '🛍️',
  Google: '🔍',
  Microsoft: '💼',
  Slack: '💬',
  GitHub: '🐙',
  Custom: '⚙️',
}

export default function IntegrationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/integrations')
      return
    }

    if (status === 'authenticated') {
      fetchIntegrations()
    }
  }, [status, router])

  const fetchIntegrations = async () => {
    try {
      const res = await fetch('/api/integrations')
      const data = await res.json()
      setIntegrations(data.integrations || [])
    } catch (error) {
      console.error('Failed to fetch integrations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要断开此集成吗？')) return

    try {
      const res = await fetch(`/api/integrations/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setIntegrations(integrations.filter(i => i.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete integration:', error)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-[#2563EB] text-white px-4 py-3 shadow-md">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Agent2Go</h1>
            <div className="w-8 h-8 bg-white/20 rounded-full"></div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="text-gray-500">正在加载...</p>
          </div>
        </main>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Blue Navbar */}
      <header className="bg-[#2563EB] text-white px-4 py-3 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Agent2Go</h1>
          <div className="w-8 h-8 bg-white/20 rounded-full"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">集成管理</h2>
              <p className="text-gray-600 mt-1">管理您的第三方服务集成</p>
            </div>
            <Button onClick={() => router.push('/integrations/add')}>
              + 添加集成
            </Button>
          </div>

          {/* Integration List */}
          {integrations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-6xl mb-4">🔌</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  暂无集成
                </h3>
                <p className="text-gray-600 mb-4">
                  添加第一个集成来连接您的服务
                </p>
                <Button onClick={() => router.push('/integrations/add')}>
                  添加集成
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {integrations.map((integration) => (
                <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">
                          {integrationIcons[integration.type] || '⚙️'}
                        </span>
                        <div>
                          <CardTitle className="text-lg">{integration.type}</CardTitle>
                          <p className="text-sm text-gray-500">
                            创建于 {new Date(integration.createdAt).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">已连接</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push(`/integrations/${integration.id}/edit`)}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleDelete(integration.id)}
                      >
                        断开
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
