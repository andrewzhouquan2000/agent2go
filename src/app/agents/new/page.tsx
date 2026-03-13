'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AgentCreationWizard from "@/components/AgentCreationWizard"

export default function NewAgentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/agents/new')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">加载中...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">创建您的 AI 员工</h1>
            <p className="text-muted-foreground">
              3 步，10 分钟完成 · 前 3 个 Agent 免费
            </p>
          </div>
          
          <AgentCreationWizard />
        </div>
      </main>
      <Footer />
    </div>
  )
}
