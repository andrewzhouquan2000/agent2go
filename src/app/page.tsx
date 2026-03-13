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
        {/* Hero Section with Gradient Background and Enhanced Visual Hierarchy */}
        <section className="relative overflow-hidden py-20 sm:py-32">
          {/* Decorative gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5 -z-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl -z-10" />
          
          <div className="container flex flex-col items-center text-center space-y-8 sm:space-y-12 px-4 sm:px-6">
            <div className="space-y-6 max-w-4xl animate-slide-up">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/50 text-sm font-medium mb-4">
                <span className="mr-2">🚀</span> 小老板的 AI 员工团队
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                让小老板 <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">10 分钟</span>
                <br className="hidden sm:block" />拥有自己的 AI 员工
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                无需技术背景，3 步创建您的专属 AI 助手
                <br className="hidden sm:block" />
                客服自动回复、营销文案、数据分析，样样精通
              </p>
            </div>

            {/* Login/CTA Buttons - Enhanced with shadows */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Button size="lg" className="w-full sm:w-auto shadow-xl hover:shadow-2xl" asChild>
                <Link href="/login">
                  <span className="mr-2">💚</span> 微信一键登录
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto shadow-lg hover:shadow-xl" asChild>
                <Link href="/login">
                  <span className="mr-2">📱</span> 手机号登录
                </Link>
              </Button>
            </div>

            {/* Guest Trial with enhanced styling */}
            <div className="pt-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Link
                href="/templates"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:-translate-y-0.5"
              >
                <span className="mr-2">✨</span> 无需注册，先试用 →
              </Link>
            </div>
          </div>
        </section>

        {/* Social Proof - Use Cases with Enhanced Cards */}
        <section className="container py-16 sm:py-24">
          <div className="space-y-10 px-4 sm:px-0">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold">同行都在用 Agent2Go</h2>
              <p className="text-sm sm:text-base text-muted-foreground">看看他们如何用 AI 提升效率</p>
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <Card className="overflow-hidden group">
                <CardContent className="pt-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-3xl flex-shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">🛍️</div>
                      <h3 className="font-bold text-lg">电商老板</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      用 Agent2Go 自动回复客户咨询，每天省 3 小时
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden group">
                <CardContent className="pt-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-3xl flex-shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">🍽️</div>
                      <h3 className="font-bold text-lg">餐饮老板</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      用 Agent2Go 自动回复咨询，提升顾客满意度
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden group">
                <CardContent className="pt-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-3xl flex-shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">📚</div>
                      <h3 className="font-bold text-lg">教培老板</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      用 Agent2Go 管理学员，自动化运营更高效
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Value Proposition Section with Enhanced Visual Design */}
        <section className="container py-16 sm:py-24">
          <div className="space-y-12 px-4 sm:px-0">
            <div className="text-center space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold">为什么选择 Agent2Go？</h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">专为小老板设计，简单易用，快速见效</p>
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <Card className="overflow-hidden group">
                <CardContent className="pt-8">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center text-3xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">⚡</div>
                    <h3 className="text-lg font-bold">10 分钟创建</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      3 步简单流程，无需技术背景，10 分钟拥有您的第一个 AI 员工
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden group">
                <CardContent className="pt-8">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-3xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">💰</div>
                    <h3 className="text-lg font-bold">透明定价</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      按 Agent 数量计费，¥0 起，无隐性支出，随时升级/降级
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden group">
                <CardContent className="pt-8">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-3xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">💬</div>
                    <h3 className="text-lg font-bold">5 分钟客服响应</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      专业客服团队，工作时间 5 分钟内响应，紧急问题不等待
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section with Gradient Background */}
        <section className="container py-20 sm:py-28">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-6 sm:px-12 py-16 sm:py-20">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex flex-col items-center text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold">准备好开始了吗？</h2>
                <p className="text-base sm:text-lg text-primary-foreground/80 max-w-2xl">
                  立即创建您的第一个 AI 员工，前 3 个 Agent 免费使用
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-xl hover:shadow-2xl" asChild>
                  <Link href="/login">
                    免费创建 Agent
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10 hover:border-primary-foreground/50"
                  asChild
                >
                  <Link href="/pricing">
                    查看价格
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
