export default function Footer() {
  return (
    <footer className="border-t bg-background/50 backdrop-blur-sm py-8 sm:py-12">
      <div className="container px-4">
        <div className="flex flex-col items-center justify-between gap-6">
          <div className="text-center space-y-2">
            <p className="text-sm font-semibold text-foreground">Agent2Go</p>
            <p className="text-balance text-center text-xs sm:text-sm text-muted-foreground">
              © 2026 Agent2Go. 构建您的 AI 团队，释放无限可能。
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
