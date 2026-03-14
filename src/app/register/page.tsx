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

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('密码至少需要 6 位')
      return
    }

    setIsLoading(true)

    try {
      // Register new user
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
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

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-16 flex items-center justify-center px-4 sm:px-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-3 pb-4">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center">
              创建账户
            </CardTitle>
            <CardDescription className="text-center text-sm">
              10 分钟创建您的第一个 AI 员工
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Registration Form - Vertical Layout for Mobile */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">密码</Label>
                <Input
                  id="password"
                  type="password"
                  inputMode="text"
                  placeholder="至少 6 位"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm">确认密码</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  inputMode="text"
                  placeholder="再次输入密码"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={isLoading}
                  required
                  minLength={6}
                />
              </div>

              {/* Submit Button - Full Width, Touch-friendly, Blue #2563EB */}
              <Button 
                type="submit"
                size="lg"
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white" 
                disabled={isLoading}
              >
                {isLoading ? '注册中...' : '创建账户'}
              </Button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground">
              已有账户？{' '}
              <button 
                type="button"
                className="text-[#2563EB] hover:underline font-medium"
                onClick={() => router.push('/login')}
              >
                登录
              </button>
            </p>

            {/* Trust Indicators */}
            <div className="pt-5 border-t space-y-2">
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
