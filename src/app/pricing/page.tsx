import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "基础版",
    price: "¥699",
    period: "/月",
    description: "适合初创小团队（2-5 人）",
    features: [
      "创建最多 5 个 AI 员工",
      "每月包含 10 个标准任务额度",
      "所有基础功能",
      "社区支持（飞书群）",
      "标准任务模板",
    ],
    cta: "开始试用",
    popular: false,
  },
  {
    name: "专业版",
    price: "¥1,999",
    period: "/月",
    description: "适合成长型团队",
    features: [
      "创建最多 10 个 AI 员工",
      "每月包含 30 个标准任务额度",
      "所有高级功能",
      "优先支持（1 对 1 飞书）",
      "自定义 AI 员工训练",
      "数据分析报告",
      "API 访问权限",
    ],
    cta: "免费试用 14 天",
    popular: true,
  },
  {
    name: "企业版",
    price: "定制",
    period: "",
    description: "适合大规模部署",
    features: [
      "无限 AI 员工",
      "无限任务额度",
      "专属客户经理",
      "私有化部署",
      "定制化开发",
      "SLA 保障",
      "培训与咨询",
    ],
    cta: "联系销售",
    popular: false,
  },
];

const taskPricing = [
  { name: "小红书笔记生成", price: "¥99", unit: "/篇", description: "含 AI Token，含 3 个版本" },
  { name: "公众号文章", price: "¥199", unit: "/篇", description: "含 AI Token，含 SEO 优化" },
  { name: "市场研究报告", price: "¥499", unit: "/份", description: "含竞品分析、数据洞察" },
  { name: "独立站开发", price: "¥2,999", unit: "/站", description: "基础站，含域名配置" },
  { name: "客服自动回复", price: "¥299", unit: "/月", description: "7x24 小时自动回复" },
  { name: "数据分析报告", price: "¥399", unit: "/份", description: "含可视化图表" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section - Mobile First */}
        <section className="container py-8 sm:py-12 md:py-24 text-center px-4">
          <h1 className="font-heading text-2xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
            透明定价，无隐性费用
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            选择适合您团队的方案，所有价格均包含 AI Token 费用
            <br className="hidden sm:block" />
            随时取消，无绑定
          </p>
        </section>

        {/* Pricing Plans - Mobile: Stack, Tablet+: Grid */}
        <section className="container py-8 sm:py-12 px-3 sm:px-0">
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.popular ? "border-primary shadow-lg" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="bg-primary text-primary-foreground text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-full">
                      最受欢迎
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl sm:text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm sm:text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="text-center">
                    <span className="text-3xl sm:text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm sm:text-base">{plan.period}</span>
                  </div>
                  <ul className="space-y-2 sm:space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full h-10 sm:h-11 text-sm sm:text-base"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Task-based Pricing - Mobile Friendly */}
        <section className="container py-8 sm:py-12 md:py-24 px-3 sm:px-0">
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">按任务付费</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              超出额度后，按需购买任务，灵活付费
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {taskPricing.map((task) => (
              <Card key={task.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">{task.name}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{task.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold">{task.price}</span>
                    <span className="text-muted-foreground text-sm">{task.unit}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ - Mobile Friendly */}
        <section className="container py-8 sm:py-12 md:py-24 bg-muted rounded-lg px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">常见问题</h2>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-bold text-sm sm:text-base mb-2">Q: 任务额度如何计算？</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  每个标准任务（如小红书笔记、公众号文章）消耗 1 个额度。
                  复杂任务（如独立站开发）消耗多个额度，具体在任务页面会明确显示。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base mb-2">Q: AI Token 费用包含在价格中吗？</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  是的！所有价格都已包含 AI Token 费用，无需额外支付。
                  您只需关注任务结果，无需担心用量。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base mb-2">Q: 可以随时取消订阅吗？</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  可以！随时取消，无绑定。取消后当月仍可继续使用，
                  下月不再扣费。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base mb-2">Q: 支持退款吗？</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  订阅费用支持 7 天无理由退款。按任务付费的项目，
                  如对结果不满意可申请重新生成或退款。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA - Mobile Friendly */}
        <section className="container py-8 sm:py-12 md:py-24 text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">准备好开始了吗？</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            立即注册，享受首月¥399 体验价（原价¥699）
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto">
              免费注册
            </Button>
            <Button size="lg" variant="outline" className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto">
              联系销售
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
