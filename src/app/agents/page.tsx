import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgentCard from "@/components/AgentCard";

// Mock data for demonstration
const agents = [
  {
    id: "1",
    name: "ceo",
    displayName: "CEO",
    description: "战略规划与决策，协调团队工作，确保项目方向正确",
    capabilities: ["战略规划", "团队管理", "决策制定"],
    avatar: "",
  },
  {
    id: "2",
    name: "researcher",
    displayName: "Researcher",
    description: "深度研究与分析，收集竞品信息，提供数据支持",
    capabilities: ["市场调研", "竞品分析", "数据收集"],
    avatar: "",
  },
  {
    id: "3",
    name: "coder",
    displayName: "Coder",
    description: "代码开发与实现，构建产品功能，解决技术问题",
    capabilities: ["前端开发", "后端开发", "代码审查"],
    avatar: "",
  },
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">AI Agents</h1>
            <p className="text-muted-foreground">
              浏览可雇佣的专业 AI 角色
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                name={agent.name}
                displayName={agent.displayName}
                description={agent.description}
                capabilities={agent.capabilities}
                avatar={agent.avatar}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
