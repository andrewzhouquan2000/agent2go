'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })

  const handleWeChatLogin = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      // In production, this would redirect to WeChat OAuth
      // For now, simulate with a message
      alert('微信登录功能开发中，请使用邮箱登录')
      // await signIn('wechat', { callbackUrl: '/dashboard' })
    } catch (err) {
      setError('微信登录失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isRegisterMode) {
        // Register new user
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || '注册失败')
        }

        // Auto login after registration
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (signInResult?.error) {
          throw new Error('注册成功但登录失败，请重新登录')
        }

        router.push('/dashboard')
      } else {
        // Login existing user
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          throw new Error(result.error)
        }

        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {isRegisterMode ? '注册账户' : '欢迎回来'}
            </CardTitle>
            <CardDescription>
              {isRegisterMode 
                ? '创建新账户，10 分钟创建您的第一个 AI 员工' 
                : '使用微信或邮箱快速登录'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* WeChat Login Button - Primary */}
            <Button 
              className="w-full bg-[#07C160] hover:bg-[#06AD56] text-white" 
              onClick={handleWeChatLogin}
              disabled={isLoading}
            >
              <span className="mr-2">💚</span> 微信一键登录
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  或
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            {isRegisterMode && (
              <div className="space-y-2">
                <Label htmlFor="name">昵称</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="怎么称呼您"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder={isRegisterMode ? "至少 6 位" : "请输入密码"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading 
                ? (isRegisterMode ? '注册中...' : '登录中...')
                : (isRegisterMode ? '注册账户' : '邮箱登录')}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {isRegisterMode ? (
                <>
                  已有账户？{' '}
                  <button 
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setIsRegisterMode(false)}
                  >
                    登录
                  </button>
                </>
              ) : (
                <>
                  还没有账户？{' '}
                  <button 
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setIsRegisterMode(true)}
                  >
                    免费注册
                  </button>
                </>
              )}
            </p>

            {/* Trust Indicators */}
            <div className="pt-4 border-t space-y-2">
              <p className="text-xs text-center text-muted-foreground">
                🔒 安全加密 · 📱 手机可用 · ⚡ 1 分钟完成
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
