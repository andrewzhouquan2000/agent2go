export interface ScenarioConfig {
  id: string;
  name: string;
  description: string;
  experts: string[];
  estimatedTime: string;
  price: number;
  icon?: string;
  color?: string;
}

export const SCENARIO_MAPPING: Record<string, ScenarioConfig> = {
  'xiaohongshu-marketing': {
    id: 'xiaohongshu-marketing',
    name: '小红书营销',
    description: '创建爆款小红书内容，从选题到发布全流程',
    experts: [
      'xiaohongshu-specialist',
      'content-creator',
      'image-prompt-engineer',
      'social-media-strategist',
    ],
    estimatedTime: '30 分钟',
    price: 3000,
    icon: '📱',
    color: '#FF2442',
  },
  'wechat-article': {
    id: 'wechat-article',
    name: '公众号文章',
    description: '撰写高质量微信公众号文章，包含标题优化和排版建议',
    experts: [
      'content-creator',
      'seo-specialist',
      'brand-guardian',
    ],
    estimatedTime: '45 分钟',
    price: 4500,
    icon: '📝',
    color: '#07C160',
  },
  'logo-design': {
    id: 'logo-design',
    name: 'Logo 设计',
    description: '生成专业 Logo 设计方案和视觉识别系统建议',
    experts: [
      'image-prompt-engineer',
      'brand-guardian',
      'visual-designer',
    ],
    estimatedTime: '60 分钟',
    price: 6000,
    icon: '🎨',
    color: '#6366F1',
  },
  'social-media-campaign': {
    id: 'social-media-campaign',
    name: '社交媒体营销',
    description: '跨平台社交媒体营销活动策划与执行',
    experts: [
      'social-media-strategist',
      'content-creator',
      'analytics-reporter',
    ],
    estimatedTime: '90 分钟',
    price: 9000,
    icon: '🚀',
    color: '#3B82F6',
  },
  'product-launch': {
    id: 'product-launch',
    name: '产品发布',
    description: '新产品上市全案策划，包含定位、文案、渠道策略',
    experts: [
      'brand-guardian',
      'content-creator',
      'social-media-strategist',
      'analytics-reporter',
    ],
    estimatedTime: '120 分钟',
    price: 12000,
    icon: '🎯',
    color: '#F59E0B',
  },
};

export function getScenario(scenarioId: string): ScenarioConfig | null {
  return SCENARIO_MAPPING[scenarioId] || null;
}

export function listScenarios(): ScenarioConfig[] {
  return Object.values(SCENARIO_MAPPING);
}

export function getExpertsForScenario(scenarioId: string): string[] {
  const scenario = getScenario(scenarioId);
  return scenario?.experts || [];
}
