#!/usr/bin/env python3
"""
专家库导入脚本
从 EXPERT_LIBRARY.md 解析 120 位专家并导入数据库
"""

import re
import json
from pathlib import Path
from typing import TypedDict


class Expert(TypedDict):
    name: str
    display_name: str
    category: str
    description: str
    capabilities: list[str]
    goal: str
    backstory: str


def parse_expert_library(md_path: str) -> list[Expert]:
    """解析专家库 Markdown 文件"""
    content = Path(md_path).read_text(encoding='utf-8')
    experts: list[Expert] = []
    
    # 按分类解析
    categories = {
        '🎨 设计与创意': '设计与创意',
        '💻 技术与开发': '技术与开发',
        '📈 营销与增长': '营销与增长',
        '📝 内容与媒体': '内容与媒体',
        '🎮 游戏开发': '游戏开发',
        '🏢 商业与管理': '商业与管理',
        '🔒 安全与合规': '安全与合规',
        '🌏 中国市场特供': '中国市场特供',
        '🧠 通用能力专家': '通用能力专家',
    }
    
    current_category = None
    
    # 解析每个分类下的专家表格
    for category_emoji, category_name in categories.items():
        # 找到分类标题
        category_match = re.search(
            f'## {category_emoji} {category_name}.*?\n(.*?)(?=\n## |\n---|\Z)',
            content,
            re.DOTALL
        )
        
        if not category_match:
            continue
        
        category_content = category_match.group(1)
        current_category = category_name
        
        # 解析表格中的专家
        # 匹配表格行：| **专家名称** | 核心能力 | 适用场景 |
        table_rows = re.findall(
            r'\|\s*\*\*([^*]+)\*\*\s*\|\s*([^|]+)\|\s*([^|]+)\|',
            category_content
        )
        
        for name, capabilities, scenarios in table_rows:
            # 跳过表头
            if name in ['专家名称', '核心能力', '适用场景']:
                continue
            
            # 清理数据
            name = name.strip()
            capabilities_list = [c.strip() for c in capabilities.split('、') if c.strip()]
            scenarios_list = [s.strip() for s in scenarios.split('、') if s.strip()]
            
            # 生成 display_name（中文名称）
            display_name = scenarios_list[0].split('、')[0] if scenarios_list else name
            
            # 生成 goal 和 backstory
            goal = f"作为{name}，帮助用户在{scenarios_list[0] if scenarios_list else '相关领域'}取得成功"
            backstory = f"你是经验丰富的{name}，擅长{capabilities_list[0] if capabilities_list else '专业技能'}。"
            
            expert: Expert = {
                'name': name,
                'display_name': display_name,
                'category': category_name,
                'description': f"{name} - {capabilities_list[0] if capabilities_list else '专业专家'}",
                'capabilities': capabilities_list,
                'goal': goal,
                'backstory': backstory,
            }
            
            experts.append(expert)
    
    return experts


def generate_prisma_seed(experts: list[Expert]) -> str:
    """生成 Prisma seed 脚本"""
    seed_code = '''/**
 * 专家库 Seed 脚本
 * 导入 120 位专家到数据库
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const experts = '''
    
    # 转换专家数据为 TypeScript 格式
    experts_json = json.dumps(experts, ensure_ascii=False, indent=2)
    
    seed_code += experts_json
    seed_code += '''

async function main() {
  console.log('开始导入专家库...')
  
  // 清空现有专家数据
  await prisma.agent.deleteMany({})
  await prisma.scenario.deleteMany({})
  
  // 导入专家
  for (const expert of experts) {
    await prisma.agent.create({
      data: {
        name: expert.name,
        displayName: expert.display_name,
        description: expert.description,
        category: expert.category,
        capabilities: JSON.stringify(expert.capabilities),
        goal: expert.goal,
        backstory: expert.backstory,
      },
    })
    console.log(`✓ 导入专家：${expert.name}`)
  }
  
  // 创建预定义场景
  const scenarios = [
    {
      name: 'xiaohongshu-marketing',
      displayName: '小红书营销',
      description: '小红书平台品牌推广和内容营销',
      category: '营销',
      estimatedCost: 3000,
      estimatedDays: 5,
      kpi: '1000+ 粉丝，5% 互动率',
      agents: [
        { name: 'xiaohongshu-specialist', priority: 1 },
        { name: 'content-creator', priority: 1 },
        { name: 'image-prompt-engineer', priority: 1 },
        { name: 'analytics-reporter', priority: 2 },
      ],
    },
    {
      name: 'zhihu-marketing',
      displayName: '知乎知识营销',
      description: '知乎平台专业内容营销和权威建立',
      category: '营销',
      estimatedCost: 2500,
      estimatedDays: 4,
      kpi: '10 个专业回答，1000+ 赞同',
      agents: [
        { name: 'zhihu-strategist', priority: 1 },
        { name: 'technical-writer', priority: 1 },
        { name: 'seo-specialist', priority: 2 },
        { name: 'developer-advocate', priority: 2 },
      ],
    },
    {
      name: 'ecommerce-operation',
      displayName: '电商运营',
      description: '全平台电商店铺运营和优化',
      category: '电商',
      estimatedCost: 5000,
      estimatedDays: 7,
      kpi: '店铺转化率提升 20%',
      agents: [
        { name: 'china-e-commerce-operator', priority: 1 },
        { name: 'taobao-optimization-expert', priority: 1 },
        { name: 'data-engineer', priority: 1 },
        { name: 'growth-hacker', priority: 2 },
      ],
    },
    {
      name: 'app-development',
      displayName: 'APP 开发',
      description: '移动应用从设计到开发全流程',
      category: '开发',
      estimatedCost: 15000,
      estimatedDays: 30,
      kpi: '完成 MVP 版本上线',
      agents: [
        { name: 'senior-developer', priority: 1 },
        { name: 'ui-designer', priority: 1 },
        { name: 'ux-researcher', priority: 1 },
        { name: 'devops-automator', priority: 2 },
      ],
    },
    {
      name: 'game-development',
      displayName: '游戏开发',
      description: '游戏从策划到开发全流程',
      category: '游戏',
      estimatedCost: 20000,
      estimatedDays: 60,
      kpi: '完成可玩 Demo',
      agents: [
        { name: 'game-designer', priority: 1 },
        { name: 'unity-architect', priority: 1 },
        { name: 'technical-artist', priority: 1 },
        { name: 'game-audio-engineer', priority: 2 },
      ],
    },
  ]
  
  // 导入场景和场景 - 专家关联
  for (const scenario of scenarios) {
    const createdScenario = await prisma.scenario.create({
      data: {
        name: scenario.name,
        displayName: scenario.displayName,
        description: scenario.description,
        category: scenario.category,
        estimatedCost: scenario.estimatedCost,
        estimatedDays: scenario.estimatedDays,
        kpi: scenario.kpi,
      },
    })
    
    console.log(`✓ 创建场景：${scenario.displayName}`)
    
    // 创建场景 - 专家关联
    for (const agentRel of scenario.agents) {
      const agent = await prisma.agent.findUnique({
        where: { name: agentRel.name },
      })
      
      if (agent) {
        await prisma.scenarioAgent.create({
          data: {
            scenarioId: createdScenario.id,
            agentId: agent.id,
            priority: agentRel.priority,
          },
        })
        console.log(`  └─ 关联专家：${agent.name} (优先级：${agentRel.priority})`)
      }
    }
  }
  
  console.log('\\n专家库导入完成！')
  console.log(`共导入 ${experts.length} 位专家`)
  console.log(`共创建 ${scenarios.length} 个场景`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
'''
    
    return seed_code


def main():
    """主函数"""
    # 解析专家库
    md_path = Path(__file__).parent.parent.parent / 'research' / 'EXPERT_LIBRARY.md'
    print(f'解析专家库：{md_path}')
    
    experts = parse_expert_library(str(md_path))
    print(f'解析到 {len(experts)} 位专家')
    
    # 生成 Prisma seed 脚本
    seed_script = generate_prisma_seed(experts)
    seed_path = Path(__file__).parent.parent / 'prisma' / 'seed_experts.ts'
    seed_path.write_text(seed_script, encoding='utf-8')
    print(f'生成 Prisma seed 脚本：{seed_path}')
    
    # 打印统计
    categories = {}
    for expert in experts:
        cat = expert['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print('\n专家分类统计:')
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f'  {cat}: {count} 位')


if __name__ == '__main__':
    main()
