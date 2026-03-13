import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const EXPERTS_DIR = join(process.env.HOME!, '.openclaw/agency-agents');

export interface ExpertConfig {
  name: string;
  identity: string;
  goal: string;
  backstory: string;
  methods?: string;
  tools?: string[];
}

function extractGoal(agentsContent: string): string {
  // Try to extract from "Core Mission" or first mission statement
  const coreMissionMatch = agentsContent.match(/## Core Mission[\s\S]*?Transform[\s\S]*?through:[\s\S]*?(?=\n\n|\n##)/);
  if (coreMissionMatch) {
    return coreMissionMatch[0].replace('## Core Mission', '').trim();
  }
  
  // Fallback: extract first paragraph after any mission/goal header
  const missionMatch = agentsContent.match(/(?:Mission|Goal|Objective)[\s\S]*?\n([\s\S]*?)(?=\n\n|\n##)/);
  if (missionMatch) {
    return missionMatch[1].trim();
  }
  
  // Last fallback: first meaningful paragraph
  const lines = agentsContent.split('\n').filter(line => line.trim().length > 0);
  return lines.slice(0, 3).join(' ').substring(0, 200);
}

function extractBackstory(soulContent: string): string {
  // Try to extract from "Core Identity" section
  const coreIdentityMatch = soulContent.match(/\*\*Core Identity\*\*:[\s\S]*?(?=\n\n|\n##)/);
  if (coreIdentityMatch) {
    return coreIdentityMatch[0].replace('**Core Identity**:', '').trim();
  }
  
  // Try "Identity & Memory" section
  const identityMatch = soulContent.match(/## Identity & Memory[\s\S]*?(?=\n\n##|\n\n###)/);
  if (identityMatch) {
    return identityMatch[0].replace('## Identity & Memory', '').trim();
  }
  
  // Fallback: first paragraph
  const lines = soulContent.split('\n').filter(line => line.trim().length > 0);
  return lines.slice(0, 3).join(' ').substring(0, 200);
}

function extractMethods(agentsContent: string): string {
  // Extract workflow or methodology section
  const workflowMatch = agentsContent.match(/## Workflow Process[\s\S]*?(?=\n\n##|\n\n###|$)/);
  if (workflowMatch) {
    return workflowMatch[0].replace('## Workflow Process', '').trim();
  }
  
  return '';
}

export function loadExpert(expertName: string): ExpertConfig | null {
  try {
    const expertDir = join(EXPERTS_DIR, expertName);
    
    if (!existsSync(expertDir)) {
      console.error(`Expert directory not found: ${expertDir}`);
      return null;
    }
    
    const identityPath = join(expertDir, 'IDENTITY.md');
    const soulPath = join(expertDir, 'SOUL.md');
    const agentsPath = join(expertDir, 'AGENTS.md');
    
    if (!existsSync(identityPath) || !existsSync(soulPath) || !existsSync(agentsPath)) {
      console.error(`Missing required files for expert: ${expertName}`);
      return null;
    }
    
    const identity = readFileSync(identityPath, 'utf-8');
    const soul = readFileSync(soulPath, 'utf-8');
    const agents = readFileSync(agentsPath, 'utf-8');
    
    // Parse identity (first line after #)
    const identityLines = identity.split('\n').filter(line => line.trim().length > 0);
    const identityText = identityLines[0]?.replace(/^#\s*/, '').trim() || expertName;
    
    return {
      name: expertName,
      identity: identityText,
      goal: extractGoal(agents),
      backstory: extractBackstory(soul),
      methods: extractMethods(agents),
      tools: [], // Could parse from TOOLS.md if needed
    };
  } catch (error) {
    console.error(`Error loading expert ${expertName}:`, error);
    return null;
  }
}

export function listAllExperts(): string[] {
  try {
    return readdirSync(EXPERTS_DIR).filter(name => {
      const expertDir = join(EXPERTS_DIR, name);
      return existsSync(expertDir) && existsSync(join(expertDir, 'IDENTITY.md'));
    });
  } catch (error) {
    console.error('Error listing experts:', error);
    return [];
  }
}

export function getExpertsByCategory(category?: string): ExpertConfig[] {
  const allExperts = listAllExperts();
  
  // Simple categorization based on expert name patterns
  const categoryMap: Record<string, string[]> = {
    'marketing': ['xiaohongshu', 'social-media', 'content-creator', 'seo', 'growth'],
    'design': ['image-prompt', 'visual', 'creative', 'brand'],
    'development': ['ai-engineer', 'backend', 'frontend', 'devops', 'api'],
    'strategy': ['strategist', 'planner', 'analyst'],
    'content': ['content', 'writer', 'copy', 'blog'],
  };
  
  if (!category) {
    return allExperts.slice(0, 20).map(name => loadExpert(name)).filter((e): e is ExpertConfig => e !== null);
  }
  
  const keywords = categoryMap[category] || [category];
  const filtered = allExperts.filter(name => 
    keywords.some(keyword => name.toLowerCase().includes(keyword.toLowerCase()))
  );
  
  return filtered.map(name => loadExpert(name)).filter((e): e is ExpertConfig => e !== null);
}
