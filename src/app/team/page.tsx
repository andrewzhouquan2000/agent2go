import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamBuilder from "@/components/TeamBuilder";

// Mock data for demonstration
const availableAgents = [
  {
    id: "1",
    name: "ceo",
    displayName: "CEO",
    description: "战略规划与决策",
  },
  {
    id: "2",
    name: "researcher",
    displayName: "Researcher",
    description: "深度研究与分析",
  },
  {
    id: "3",
    name: "coder",
    displayName: "Coder",
    description: "代码开发与实现",
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6 sm:py-8 px-3 sm:px-0">
        <div className="space-y-6 sm:space-y-8">
          <div className="px-2">
            <h1 className="text-2xl sm:text-3xl font-bold">组建团队</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              选择 AI Agent 创建您的专属团队
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <TeamBuilder availableAgents={availableAgents} />
          </div>

          {/* Existing Teams */}
          <div className="px-2">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">我的团队</h2>
            <div className="text-sm sm:text-base text-muted-foreground">
              暂无团队，点击上方创建第一个团队
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
