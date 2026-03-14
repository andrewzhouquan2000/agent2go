import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
const adapter = new PrismaLibSql({
  url: `file:${dbPath}`,
});

const prisma = new PrismaClient({ adapter });

const templates = [
  {
    name: 'Content Creator',
    description: '内容创作者助手，帮助生成高质量社交媒体内容',
    category: 'content',
    config: JSON.stringify({
      role: '内容创作专家',
      goal: '帮助用户创作吸引人的社交媒体内容',
      skills: ['文案写作', '内容策划', 'SEO 优化', '多媒体内容'],
      defaultChannels: ['xiaohongshu', 'wechat', 'weibo'],
      tone: 'friendly',
      outputFormat: 'markdown',
    }),
  },
  {
    name: 'Amazon Operator',
    description: '亚马逊运营专家，优化产品 listing 和广告策略',
    category: 'ecommerce',
    config: JSON.stringify({
      role: '亚马逊运营专家',
      goal: '提升产品曝光和转化率',
      skills: ['Listing 优化', '关键词研究', 'PPC 广告', '竞品分析'],
      marketplaces: ['US', 'EU', 'JP'],
      focus: ['SEO', 'conversion', 'advertising'],
    }),
  },
  {
    name: 'Xiaohongshu Marketing',
    description: '小红书营销专家，打造爆款笔记和品牌建设',
    category: 'marketing',
    config: JSON.stringify({
      role: '小红书营销专家',
      goal: '创建高互动笔记，提升品牌影响力',
      skills: ['笔记创作', '话题策划', 'KOL 合作', '数据分析'],
      contentTypes: ['图文', '视频', '直播'],
      audienceAnalysis: true,
    }),
  },
  {
    name: 'Data Analyst',
    description: '数据分析师，提供数据洞察和可视化报告',
    category: 'analytics',
    config: JSON.stringify({
      role: '数据分析专家',
      goal: '从数据中提取有价值的商业洞察',
      skills: ['数据统计', '可视化', '趋势分析', '预测建模'],
      tools: ['Python', 'SQL', 'Tableau', 'Excel'],
      reportFormats: ['dashboard', 'pdf', 'excel'],
    }),
  },
  {
    name: 'Customer Support',
    description: '客服助手，提供专业友好的客户支持服务',
    category: 'support',
    config: JSON.stringify({
      role: '客户服务专家',
      goal: '快速响应并解决客户问题',
      skills: ['问题诊断', '沟通技巧', '产品知识', '投诉处理'],
      languages: ['zh-CN', 'en-US'],
      responseTime: '< 1 hour',
      satisfactionTarget: 95,
    }),
  },
];

async function main() {
  console.log('🌱 开始导入官方模板数据...');

  for (const template of templates) {
    const created = await prisma.template.create({
      data: template,
    });
    console.log(`✅ 创建模板：${created.name} (${created.id})`);
  }

  const count = await prisma.template.count();
  console.log(`\n📊 模板总数：${count}`);
}

main()
  .catch((e) => {
    console.error('❌ 导入失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
