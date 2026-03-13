'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CustomerServiceButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="h-14 w-14 rounded-full shadow-lg text-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          💬
        </Button>
      </div>

      {/* Popup Card */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 animate-in fade-in slide-in-from-bottom-4">
          <Card className="shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">在线客服</CardTitle>
                  <p className="text-sm text-muted-foreground">平均响应&lt;5 分钟</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://wechat.com" target="_blank" rel="noopener noreferrer">
                    <span className="mr-2">💚</span> 微信咨询
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="tel:400-123-4567">
                    <span className="mr-2">📞</span> 电话咨询
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">✉️</span> 在线留言
                </Button>
              </div>
              
              <div className="pt-2 border-t text-xs text-muted-foreground">
                <p>工作时间：9:00-18:00</p>
                <p>非工作时间请留言，我们会尽快回复</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
