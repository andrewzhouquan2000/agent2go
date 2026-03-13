import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section with Clear Value Proposition */}
        <section className="container py-12 sm:py-16 md:py-24">
          <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
            <div className="space-y-4 max-w-3xl px-2">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                让小老板 <span className="text-primary">10 分钟</span>
                <br className="hidden sm:block" />拥有自己的 AI 员工
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground leading-relaxed">
                无需技术背景，3 步创建您的专属 AI 助手
                <br className="hidden sm:block" />
                客服自动回复、营销文案、数据分析，样样精通
              </p>
            </div>

            {/* Login/CTA Buttons - Mobile First: Full Width */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Button size="lg" className="h-11 sm:h-12 px-6 sm:px-8 text-base w-full sm:w-auto" asChild>
                <Link href="/login">
                  <span className="mr-2">💚</span> 微信一键登录
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-11 sm:h-12 px-6 sm:px-8 text-base w-full sm:w-auto" asChild>
                <Link href="/login">
                  <span className="mr-2">📱</span> 手机号登录
                </Link>
              </Button>
            </div>

            {/* Guest Trial */}
            <div className="pt-2 sm:pt-4">
              <Link
                href="/templates"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="mr-2">✨</span> 无需注册，先试用 →
              </Link>
            </div>
          </div>
        </section>

        {/* Social Proof - Use Cases */}
        <section className="container py-8 sm:py-12 bg-muted/50 rounded-lg">
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-center px-4">同行都在用 Agent2Go</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🛍️</span>
                      <h3 className="font-semibold">电商老板</h3>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      用 Agent2Go 自动回复客户咨询，每天省 3 小时
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🍽️</span>
                      <h3 className="font-semibold">餐饮老板</h3>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      用 Agent2Go 自动回复咨询，提升顾客满意度
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📚</span>
                      <h3 className="font-semibold">教培老板</h3>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      用 Agent2Go 管理学员，自动化运营更高效
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="container py-12 sm:py-16 md:py-24">
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center space-y-2 px-4">
              <h2 className="text-2xl sm:text-3xl font-bold">为什么选择 Agent2Go？</h2>
              <p className="text-sm sm:text-base text-muted-foreground">专为小老板设计，简单易用，快速见效</p>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-5 sm:p-6 shadow-sm space-y-3">
                <div className="text-3xl">⚡</div>
                <h3 className="text-lg sm:text-xl font-bold">10 分钟创建</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  3 步简单流程，无需技术背景，10 分钟拥有您的第一个 AI 员工
                </p>
              </div>
              <div className="rounded-lg border bg-card p-5 sm:p-6 shadow-sm space-y-3">
                <div className="text-3xl">💰</div>
                <h3 className="text-lg sm:text-xl font-bold">透明定价</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  按 Agent 数量计费，¥0 起，无隐性支出，随时升级/降级
                </p>
              </div>
              <div className="rounded-lg border bg-card p-5 sm:p-6 shadow-sm space-y-3">
                <div className="text-3xl">💬</div>
                <h3 className="text-lg sm:text-xl font-bold">5 分钟客服响应</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  专业客服团队，工作时间 5 分钟内响应，紧急问题不等待
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-12 sm:py-16 bg-primary text-primary-foreground rounded-lg">
          <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold">准备好开始了吗？</h2>
            <p className="text-sm sm:text-base text-primary-foreground/80 max-w-2xl">
              立即创建您的第一个 AI 员工，前 3 个 Agent 免费使用
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="h-11 sm:h-12 px-6 sm:px-8 text-base w-full sm:w-auto" asChild>
                <Link href="/login">
                  免费创建 Agent
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-11 sm:h-12 px-6 sm:px-8 text-base w-full sm:w-auto bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/pricing">
                  查看价格
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
