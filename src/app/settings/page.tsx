'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/dashboard/BottomNav'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SettingsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/settings')
      return
    }

    if (status === 'authenticated' && session?.user) {
      setName(session.user.name || '')
      setEmail(session.user.email || '')
      setIsLoading(false)
    }
  }, [status, session, router])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      // TODO: Implement profile update API
      // For now, just update local session
      await update({ name, email })
      setMessage({ type: 'success', text: '个人信息已更新' })
    } catch (error) {
      setMessage({ type: 'error', text: '更新失败，请稍后重试' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpgrade = () => {
    router.push('/pricing')
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
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">设置</h2>
            <p className="text-gray-600 mt-1">管理您的账户和偏好设置</p>
          </div>

          {message && (
            <Alert variant={message.type === 'success' ? 'default' : 'destructive'} 
                   className={message.type === 'success' ? 'bg-green-50 border-green-200' : ''}>
              <AlertDescription className={message.type === 'success' ? 'text-green-800' : ''}>
                {message.type === 'success' ? '✓' : '✗'} {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>个人信息</CardTitle>
              <CardDescription>更新您的个人资料信息</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="您的姓名"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? '保存中...' : '保存更改'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Key 管理</CardTitle>
                  <CardDescription>管理您的 API 访问密钥</CardDescription>
                </div>
                <Badge variant="secondary">Beta</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">默认 API Key</span>
                  <Badge>Active</Badge>
                </div>
                <code className="block p-2 bg-white rounded text-sm font-mono break-all">
                  ak_•••••••••••••••••••••
                </code>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm">复制</Button>
                  <Button variant="outline" size="sm">重置</Button>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                + 生成新的 API Key
              </Button>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-purple-900">订阅计划</CardTitle>
                  <CardDescription className="text-purple-700">
                    当前计划：免费套餐
                  </CardDescription>
                </div>
                <Badge className="bg-purple-600">Free</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm text-purple-800">
                <span>本月剩余额度</span>
                <span className="font-semibold">100 / 100 任务</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <Button onClick={handleUpgrade} className="w-full bg-purple-600 hover:bg-purple-700">
                🚀 升级套餐
              </Button>
              <p className="text-xs text-purple-700 text-center">
                升级后可享受更多任务额度、优先支持和高级功能
              </p>
            </CardContent>
          </Card>

          {/* Integrations Link */}
          <Card>
            <CardHeader>
              <CardTitle>第三方集成</CardTitle>
              <CardDescription>管理您的服务集成</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => router.push('/integrations')} className="w-full">
                管理集成 →
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">危险区域</CardTitle>
              <CardDescription>这些操作不可撤销</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">删除账户</p>
                  <p className="text-sm text-gray-500">永久删除您的账户和所有数据</p>
                </div>
                <Button variant="destructive" size="sm">删除账户</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
