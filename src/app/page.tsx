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
              <h3 className="text-xl font-bold mb-2">🤖 专业 AI Agent</h3>
              <p className="text-muted-foreground">
                CEO、Researcher、Coder 等专业角色，各司其职，协同工作
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-2">⚡ 快速交付</h3>
              <p className="text-muted-foreground">
                AI 团队 24/7 不间断工作，大幅缩短项目周期
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-2">💰 成本优化</h3>
              <p className="text-muted-foreground">
                按需雇佣，无需长期人力成本，灵活高效
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-12 bg-muted rounded-lg">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold">准备好开始了吗？</h2>
            <p className="text-muted-foreground max-w-2xl">
              立即组建您的 AI 团队，开始第一个任务
            </p>
            <a
              href="/team"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              免费开始
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
