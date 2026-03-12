import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        
        {/* Value Proposition Section */}
        <section className="container py-12 md:py-24">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-2">👥 专业 AI 员工</h3>
              <p className="text-muted-foreground">
                AI CEO、AI 研究员、AI 工程师等专业角色，各司其职，协同工作
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-2">⚡ 快速交付</h3>
              <p className="text-muted-foreground">
                AI 员工 24/7 不间断工作，7 天生成 30 篇小红书笔记
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-2">💰 透明定价</h3>
              <p className="text-muted-foreground">
                ¥699/月起，含 AI Token 费用，无隐性支出
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-12 bg-muted rounded-lg">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold">准备好开始了吗？</h2>
            <p className="text-muted-foreground max-w-2xl">
              立即组建您的 AI 员工团队，首月仅需¥399（原价¥699）
            </p>
            <div className="flex gap-4">
              <a
                href="/team"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                免费组建团队
              </a>
              <a
                href="/pricing"
                className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                查看价格
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
