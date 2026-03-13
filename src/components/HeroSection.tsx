import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="container flex max-w-[64rem] flex-col items-center gap-5 text-center px-4">
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
          35 岁小老板的<br className="sm:hidden"/>AI 员工团队
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 px-2">
          每月¥699，干 3 个人的活。无需学习复杂工具，
          AI 员工帮您完成研究、开发、内容创作等各类任务。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/team"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-medium text-primary-foreground shadow-md transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring flex-1 sm:flex-none"
          >
            免费组建团队
          </Link>
          <Link
            href="/templates"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring flex-1 sm:flex-none"
          >
            查看场景模板
          </Link>
        </div>
      </div>
    </section>
  );
}
