'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'

type Step = 1 | 2 | 3

interface AgentFormData {
  description: string
  name: string
  businessTypes: string[]
  tone: 'professional' | 'friendly' | 'casual'
  channels: string[]
}

const SCENARIOS = [
  { id: 'customer-service', label: '客服自动回复', icon: '💬' },
  { id: 'marketing', label: '营销文案', icon: '📝' },
  { id: 'data-analysis', label: '数据分析', icon: '📊' },
  { id: 'schedule', label: '日程管理', icon: '📅' },
  { id: 'document', label: '文档处理', icon: '📄' },
  { id: 'other', label: '其他', icon: '✨' },
]

const BUSINESS_TYPES = [
  '产品咨询',
  '售后问题',
  '订单查询',
  '投诉建议',
  '其他',
]

export default function AgentCreationWizard() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<AgentFormData>({
    description: '',
    name: '',
    businessTypes: [],
    tone: 'friendly',
    channels: ['wechat'],
  })

  const handleNext = () => {
    if (step < 3) setStep((step + 1) as Step)
  }

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step)
  }

  const toggleBusinessType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      businessTypes: prev.businessTypes.includes(type)
        ? prev.businessTypes.filter(t => t !== type)
        : [...prev.businessTypes, type]
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // TODO: Call API to create agent
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1500))
      router.push('/dashboard?agentCreated=true')
    } catch (error) {
      console.error('Failed to create agent:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getProgress = () => {
    return step === 1 ? 33 : step === 2 ? 66 : 100
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-2xl">
            创建 Agent - 步骤 {step}/3
          </CardTitle>
          <Progress value={getProgress()} className="h-2" />
        </div>
        <CardDescription>
          {step === 1 && '用一句话说说你想要什么'}
          {step === 2 && '配置您的 Agent 细节'}
          {step === 3 && '预览并发布您的 Agent'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1: Describe Requirement */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">用一句话说说你想要什么：</Label>
              <Textarea
                id="description"
                placeholder="我想要一个能自动回复客户咨询的助手..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-3">
              <Label>或者选择常见场景：</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SCENARIOS.map((scenario) => (
                  <Button
                    key={scenario.id}
                    type="button"
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => setFormData({ ...formData, description: scenario.label })}
                  >
                    <span className="text-2xl">{scenario.icon}</span>
                    <span className="text-sm">{scenario.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={!formData.description.trim()}>
                下一步
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Configure Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">给你的 Agent 起个名字：</Label>
              <Input
                id="name"
                placeholder="客服小助手"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <Label>它主要处理什么业务？</Label>
              <div className="grid grid-cols-2 gap-3">
                {BUSINESS_TYPES.map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={formData.businessTypes.includes(type) ? 'default' : 'outline'}
                    onClick={() => toggleBusinessType(type)}
                  >
                    {formData.businessTypes.includes(type) ? '☑' : '☐'} {type}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>希望它说话的语气：</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.tone === 'professional' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, tone: 'professional' })}
                >
                  专业正式
                </Button>
                <Button
                  type="button"
                  variant={formData.tone === 'friendly' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, tone: 'friendly' })}
                >
                  亲切友好
                </Button>
                <Button
                  type="button"
                  variant={formData.tone === 'casual' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, tone: 'casual' })}
                >
                  活泼有趣
                </Button>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                上一步
              </Button>
              <Button onClick={handleNext} disabled={!formData.name.trim()}>
                下一步
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Preview & Publish */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">✅ 你的 Agent 已准备好！</p>
            </div>

            <div className="space-y-2">
              <Label>预览效果：</Label>
              <Card className="bg-muted/50">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">
                      用
                    </div>
                    <div className="bg-background rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">这个产品多少钱？</p>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm">
                      AI
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">
                        您好！这款产品的价格是¥{Math.floor(Math.random() * 1000) + 100}，
                        现在购买还有优惠活动哦~ 请问您想了解哪方面呢？
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <Label>发布到哪里？</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.channels.includes('wechat') ? 'default' : 'outline'}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      channels: prev.channels.includes('wechat')
                        ? prev.channels.filter(c => c !== 'wechat')
                        : [...prev.channels, 'wechat']
                    }))
                  }}
                >
                  ☑ 微信客服
                </Button>
                <Button
                  type="button"
                  variant={formData.channels.includes('website') ? 'default' : 'outline'}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      channels: prev.channels.includes('website')
                        ? prev.channels.filter(c => c !== 'website')
                        : [...prev.channels, 'website']
                    }))
                  }}
                >
                  ☐ 网站
                </Button>
                <Button
                  type="button"
                  variant={formData.channels.includes('feishu') ? 'default' : 'outline'}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      channels: prev.channels.includes('feishu')
                        ? prev.channels.filter(c => c !== 'feishu')
                        : [...prev.channels, 'feishu']
                    }))
                  }}
                >
                  ☐ 飞书
                </Button>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                上一步
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? '发布中...' : '完成，开始使用'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
