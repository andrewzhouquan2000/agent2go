import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="space-y-6 pb-12 pt-8 md:pb-16 md:pt-12 lg:py-24">
      <div className="container flex max-w-[64rem] flex-col items-center gap-6 text-center px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          35 岁小老板的<br className="sm:hidden" />AI 员工团队
        </h1>
        <p className="max-w-[42rem] leading-relaxed text-muted-foreground sm:text-lg px-2">
          每月¥699，干 3 个人的活。无需学习复杂工具，
          AI 员工帮您完成研究、开发、内容创作等各类任务。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link href="/team">
              免费组建团队
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/templates">
              查看场景模板
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
