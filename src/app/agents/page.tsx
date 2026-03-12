import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgentCard from "@/components/AgentCard";

// Static data for Phase 2 (API integration in Phase 3)
const agents = [
  {
    id: "1",
    name: "ceo",
    displayName: "AI CEO",
    description: "战略规划与决策专家，帮助您制定业务方向和增长策略",
    capabilities: ["战略规划", "业务分析", "团队管理", "决策支持"],
    avatar: "",
  },
  {
    id: "2",
    name: "researcher",
    displayName: "AI 研究员",
    description: "市场研究与数据分析专家，提供深度行业洞察和竞品分析",
    capabilities: ["市场调研", "竞品分析", "数据收集", "报告撰写"],
    avatar: "",
  },
  {
    id: "3",
    name: "coder",
    displayName: "AI 工程师",
    description: "全栈开发专家，快速构建网站、应用和自动化脚本",
    capabilities: ["网站开发", "应用开发", "代码审查", "自动化"],
    avatar: "",
  },
  {
    id: "4",
    name: "designer",
    displayName: "AI 设计师",
    description: "UI/UX 设计专家，创建美观易用的产品界面和品牌视觉",
    capabilities: ["UI 设计", "UX 优化", "品牌设计", "原型制作"],
    avatar: "",
  },
  {
    id: "5",
    name: "writer",
    displayName: "AI 内容专家",
    description: "内容创作专家，撰写高质量的文章、文案和营销材料",
    capabilities: ["文章写作", "文案创作", "SEO 优化", "社交媒体"],
    avatar: "",
  },
  {
    id: "6",
    name: "marketing",
    displayName: "AI 营销专家",
    description: "数字营销专家，制定营销策略并执行推广活动",
    capabilities: ["营销策略", "社交媒体运营", "广告投放", "数据分析"],
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
            <h1 className="text-3xl font-bold">AI 员工团队</h1>
            <p className="text-muted-foreground">
              浏览可雇佣的专业 AI 员工，组建您的虚拟团队
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
