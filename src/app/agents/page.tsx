import ExpertCard from "@/components/ExpertCard";
import TeamTools from "@/components/TeamTools";

// Static data for Phase 2 (API integration in Phase 3)
const agents = [
  {
    id: "1",
    name: "ceo",
    displayName: "AI CEO",
    role: "CEO/战略专家",
    description: "战略规划与决策专家，帮助您制定业务方向和增长策略",
    capabilities: ["战略规划", "业务分析", "团队管理", "决策支持"],
    avatar: "",
    rating: 4.9,
  },
  {
    id: "2",
    name: "researcher",
    displayName: "AI 研究员",
    role: "市场研究专家",
    description: "市场研究与数据分析专家，提供深度行业洞察和竞品分析",
    capabilities: ["市场调研", "竞品分析", "数据收集", "报告撰写"],
    avatar: "",
    rating: 4.8,
  },
  {
    id: "3",
    name: "coder",
    displayName: "AI 工程师",
    role: "全栈开发专家",
    description: "全栈开发专家，快速构建网站、应用和自动化脚本",
    capabilities: ["网站开发", "应用开发", "代码审查", "自动化"],
    avatar: "",
    rating: 4.9,
  },
  {
    id: "4",
    name: "designer",
    displayName: "AI 设计师",
    role: "UI/UX 设计专家",
    description: "UI/UX 设计专家，创建美观易用的产品界面和品牌视觉",
    capabilities: ["UI 设计", "UX 优化", "品牌设计", "原型制作"],
    avatar: "",
    rating: 4.7,
  },
  {
    id: "5",
    name: "writer",
    displayName: "AI 内容专家",
    role: "内容创作专家",
    description: "内容创作专家，撰写高质量的文章、文案和营销材料",
    capabilities: ["文章写作", "文案创作", "SEO 优化", "社交媒体"],
    avatar: "",
    rating: 4.6,
  },
  {
    id: "6",
    name: "marketing",
    displayName: "AI 营销专家",
    role: "数字营销专家",
    description: "数字营销专家，制定营销策略并执行推广活动",
    capabilities: ["营销策略", "社交媒体运营", "广告投放", "数据分析"],
    avatar: "",
    rating: 4.8,
  },
];

export default function AgentsPage() {
  return (
    <div className="flex min-h-screen">
      {/* Main Content Area */}
      <main className="flex-1 ml-60 mr-72">
        <div className="container py-12 px-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-gray-900">人才大厅</h1>
              <p className="text-base text-gray-600">
                浏览可雇佣的专业 AI 员工，组建您的虚拟团队
              </p>
            </div>

            {/* Filter Tags */}
            <div className="flex gap-2 flex-wrap">
              <button className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium">
                全部
              </button>
              <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200">
                战略管理
              </button>
              <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200">
                产品研发
              </button>
              <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200">
                市场营销
              </button>
              <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200">
                运营增长
              </button>
            </div>

            {/* Agent Cards Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <ExpertCard
                  key={agent.id}
                  name={agent.displayName}
                  role={agent.role}
                  avatar={agent.avatar}
                  rating={agent.rating}
                  skills={agent.capabilities.slice(0, 3)}
                  variant="default"
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Team Tools */}
      <TeamTools />
    </div>
  );
}
