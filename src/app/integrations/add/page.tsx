'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/dashboard/BottomNav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

const integrationTypes = [
  { value: 'OpenAI', label: 'OpenAI', icon: '🤖' },
  { value: 'Anthropic', label: 'Anthropic', icon: '🧠' },
  { value: 'Stripe', label: 'Stripe', icon: '💳' },
  { value: 'Shopify', label: 'Shopify', icon: '🛍️' },
  { value: 'Google', label: 'Google', icon: '🔍' },
  { value: 'Microsoft', label: 'Microsoft', icon: '💼' },
  { value: 'Slack', label: 'Slack', icon: '💬' },
  { value: 'GitHub', label: 'GitHub', icon: '🐙' },
  { value: 'Custom', label: 'Custom', icon: '⚙️' },
]

export default function AddIntegrationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [type, setType] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [apiSecret, setApiSecret] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Build credentials object based on type
      const credentials: any = {}
      if (apiKey) credentials.apiKey = apiKey
      if (apiSecret) credentials.apiSecret = apiSecret

      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          type,
          credentials: Object.keys(credentials).length > 0 ? credentials : null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '添加集成失败')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/integrations')
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-[#2563EB] text-white px-4 py-3 shadow-md">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Agent2Go</h1>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
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
          <button onClick={() => router.back()} className="text-sm">
            ← 返回
          </button>
          <h1 className="text-xl font-bold">Agent2Go</h1>
          <div className="w-8"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">添加集成</h2>
            <p className="text-gray-600 mt-1">连接您的第三方服务</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                ✓ 集成添加成功！正在跳转...
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>集成信息</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Integration Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">服务类型</Label>
                  <Select value={type} onValueChange={setType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="选择服务类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {integrationTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.icon} {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* API Key */}
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    您的 API Key 将被加密存储
                  </p>
                </div>

                {/* API Secret (optional) */}
                <div className="space-y-2">
                  <Label htmlFor="apiSecret">API Secret (可选)</Label>
                  <Input
                    id="apiSecret"
                    type="password"
                    placeholder="用于需要双密钥的服务"
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading || !type}>
                  {isLoading ? '添加中...' : '添加集成'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Help Text */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-4">
              <h3 className="font-semibold text-blue-900 mb-2">💡 如何获取 API Key？</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• OpenAI: platform.openai.com/api-keys</li>
                <li>• Anthropic: console.anthropic.com/settings/keys</li>
                <li>• Stripe: dashboard.stripe.com/apikeys</li>
                <li>• Shopify: admin.shopify.com/settings/apps</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
