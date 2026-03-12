import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const templates = [
  {
    name: "小红书笔记生成",
    description: "7 天 30 篇小红书笔记，引流到店",
    price: "¥99/篇",
    category: "内容营销",
    features: [
      "AI 自动生成爆款标题",
      "高质量文案创作",
      "Emoji 表情优化",
      "话题标签推荐",
      "3 个版本可选",
    ],
    useCase: "适合电商、餐饮、美业老板快速生成小红书内容",
    icon: "📱",
  },
  {
    name: "公众号文章",
    description: "3 小时生成竞品分析报告，避开对手踩过的坑",
    price: "¥199/篇",
    category: "内容营销",
    features: [
      "SEO 优化标题",
      "深度内容创作",
      "排版优化",
      "配图建议",
      "阅读量预测",
    ],
    useCase: "适合品牌方、知识博主定期输出专业内容",
    icon: "📝",
  },
  {
    name: "市场研究报告",
    description: "深度行业洞察，辅助商业决策",
    price: "¥499/份",
    category: "商业分析",
    features: [
      "竞品分析",
      "市场规模估算",
      "用户画像",
      "趋势预测",
      "数据可视化",
    ],
    useCase: "适合创业者、投资人做市场调研和决策参考",
    icon: "📊",
  },
  {
    name: "独立站开发",
    description: "快速搭建品牌独立站，开启出海业务",
    price: "¥2,999/站",
    category: "网站开发",
    features: [
      "响应式设计",
      "SEO 基础优化",
      "支付集成",
      "域名配置",
      "基础 SEO 设置",
    ],
    useCase: "适合 DTC 品牌、外贸商家快速上线独立站",
    icon: "🌐",
  },
  {
    name: "客服自动回复",
    description: "7x24 小时自动回复，提升客户满意度",
    price: "¥299/月",
    category: "客户服务",
    features: [
      "常见问题自动回复",
      "智能转人工",
      "多轮对话",
      "客户情绪识别",
      "数据分析报表",
    ],
    useCase: "适合电商、SaaS 企业降低客服成本",
    icon: "💬",
  },
  {
    name: "数据分析报告",
    description: "业务数据深度分析，发现增长机会",
    price: "¥399/份",
    category: "商业分析",
    features: [
      "数据清洗整理",
      "趋势分析",
      "异常检测",
      "可视化图表",
      " actionable 建议",
    ],
    useCase: "适合运营、产品经理做数据驱动决策",
    icon: "📈",
  },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-12 md:py-24 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
            场景化模板，开箱即用
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            基于真实业务场景设计的 AI 任务模板
            <br />
            无需配置，一键启动，快速见效
          </p>
        </section>

        {/* Templates Grid */}
        <section className="container py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="text-4xl mb-2">{template.icon}</div>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{template.name}</CardTitle>
                  <CardDescription className="text-base">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{template.price}</span>
                    <span className="text-muted-foreground text-sm">
                      （含 AI Token）
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {template.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <span className="text-green-500">✓</span>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      💡 {template.useCase}
                    </p>
                  </div>
                  <Button className="w-full">
                    使用此模板
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="container py-12 md:py-24 bg-muted rounded-lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              3 步开始使用
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-bold text-lg mb-2">选择模板</h3>
                <p className="text-muted-foreground">
                  根据您的业务需求，选择合适的场景模板
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lg mb-2">提供信息</h3>
                <p className="text-muted-foreground">
                  填写简单的需求说明，AI 员工开始工作
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lg mb-2">验收成果</h3>
                <p className="text-muted-foreground">
                  查看 AI 生成的成果，满意后下载使用
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container py-12 md:py-24 text-center">
          <h2 className="text-3xl font-bold mb-4">
            没有找到合适的模板？
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            我们可以为您定制专属 AI 员工，满足特定业务需求
          </p>
          <Button size="lg" variant="outline" className="h-12 px-8">
            联系定制
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
