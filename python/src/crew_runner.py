#!/usr/bin/env python3
"""
CrewAI Runner for Agent2Go
Executes multi-agent scenarios using OpenClaw expert definitions
"""

import json
import sys
import os
from pathlib import Path
from typing import Dict, List, Any
from crewai import Agent, Task, Crew, Process
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Expert library path
EXPERTS_DIR = Path.home() / '.openclaw' / 'agency-agents'


def load_expert_files(expert_name: str) -> Dict[str, str]:
    """Load expert markdown files"""
    expert_dir = EXPERTS_DIR / expert_name
    
    if not expert_dir.exists():
        raise FileNotFoundError(f"Expert directory not found: {expert_dir}")
    
    files = {}
    for filename in ['IDENTITY.md', 'SOUL.md', 'AGENTS.md']:
        filepath = expert_dir / filename
        if filepath.exists():
            files[filename.lower().replace('.md', '')] = filepath.read_text(encoding='utf-8')
        else:
            files[filename.lower().replace('.md', '')] = ""
    
    return files


def parse_expert_config(files: Dict[str, str]) -> Dict[str, str]:
    """Parse expert markdown files into structured config"""
    identity = files.get('identity', '')
    soul = files.get('soul', '')
    agents = files.get('agents', '')
    
    # Extract identity (first line after #)
    identity_lines = [line.strip() for line in identity.split('\n') if line.strip()]
    identity_text = identity_lines[0].lstrip('#').strip() if identity_lines else ''
    
    # Extract goal from AGENTS.md
    goal = ''
    if '## Core Mission' in agents:
        core_mission = agents.split('## Core Mission')[1].split('\n\n')[0]
        goal = core_mission.strip()
    elif 'Mission' in agents:
        mission_section = agents.split('Mission')[1].split('\n\n')[0]
        goal = mission_section.strip()
    
    # Extract backstory from SOUL.md
    backstory = ''
    if '**Core Identity**:' in soul:
        backstory = soul.split('**Core Identity**:')[1].split('\n\n')[0].strip()
    elif '## Identity & Memory' in soul:
        backstory = soul.split('## Identity & Memory')[1].split('\n\n')[0].strip()
    
    return {
        'identity': identity_text,
        'goal': goal,
        'backstory': backstory,
    }


def load_expert(expert_name: str) -> Dict[str, str]:
    """Load and parse expert configuration"""
    try:
        files = load_expert_files(expert_name)
        return parse_expert_config(files)
    except Exception as e:
        print(f"Error loading expert {expert_name}: {e}", file=sys.stderr)
        return {
            'identity': f'Expert: {expert_name}',
            'goal': 'Complete the assigned task',
            'backstory': 'You are a specialized AI expert.',
        }


def create_agent(expert_config: Dict[str, str], verbose: bool = True) -> Agent:
    """Convert expert config to CrewAI Agent"""
    return Agent(
        role=expert_config['identity'],
        goal=expert_config['goal'],
        backstory=expert_config['backstory'],
        verbose=verbose,
        allow_delegation=False,
    )


def create_xiaohongshu_tasks(agents: List[Agent], user_input: str) -> List[Task]:
    """Create tasks for Xiaohongshu marketing scenario"""
    tasks = []
    
    # Task 1: Topic analysis (xiaohongshu-specialist)
    topic_task = Task(
        description=f"""分析用户提供的主题：'{user_input}'
        
请完成以下工作：
1. 识别目标受众和他们的兴趣点
2. 分析当前小红书平台上的相关热门话题
3. 提供 3 个具体的选题方向建议
4. 每个选题方向包含：
   - 标题建议（包含热门关键词）
   - 内容角度
   - 预期受众反应

输出格式：
- 选题 1：[标题] - [角度] - [预期效果]
- 选题 2：[标题] - [角度] - [预期效果]
- 选题 3：[标题] - [角度] - [预期效果]
""",
        expected_output="3 个完整的小红书选题方向，每个包含标题、角度和预期效果",
        agent=agents[0],  # xiaohongshu-specialist
    )
    tasks.append(topic_task)
    
    # Task 2: Content creation (content-creator)
    content_task = Task(
        description=f"""基于选题专家的建议，为'{user_input}'创作一篇完整的小红书文案。

要求：
1. 选择一个最佳选题方向进行创作
2. 文案结构：
   - 吸引人的标题（包含 emoji 和关键词）
   - 开篇钩子（引发共鸣或好奇心）
   - 主体内容（分点说明，易读性强）
   - 行动号召（引导互动、收藏、关注）
3. 添加合适的 emoji 增强视觉效果
4. 包含 5-10 个相关话题标签（#标签格式）
5. 字数控制在 300-500 字之间

注意：文案要符合小红书平台风格，生活化、真实、有共鸣
""",
        expected_output="一篇完整的小红书文案，包含标题、正文、emoji 和话题标签",
        agent=agents[1],  # content-creator
        context=[topic_task],
    )
    tasks.append(content_task)
    
    # Task 3: Image prompt creation (image-prompt-engineer)
    image_task = Task(
        description=f"""为'{user_input}'的小红书内容创建配图提示词。

请提供 3 个不同的配图方案：
1. 主图（封面图）：
   - 描述画面构图、色调、主体元素
   - 符合小红书审美风格
   - 能够吸引点击

2. 内容图 1-2 张：
   - 配合文案内容的插图
   - 展示产品/场景/效果
   - 视觉一致性强

3. 每张图的提示词格式：
   - 场景描述
   - 风格参考（如：minimalist, aesthetic, lifestyle）
   - 色调建议
   - 构图方式

输出格式：
【主图】
提示词：[详细的 AI 绘画提示词，英文]
说明：[中文说明这张图的作用和设计理念]

【内容图 1】
提示词：[详细的 AI 绘画提示词，英文]
说明：[中文说明]

【内容图 2】（可选）
提示词：[详细的 AI 绘画提示词，英文]
说明：[中文说明]
""",
        expected_output="3 个配图方案的详细提示词和说明",
        agent=agents[2],  # image-prompt-engineer
        context=[content_task],
    )
    tasks.append(image_task)
    
    # Task 4: Publishing strategy (social-media-strategist)
    publishing_task = Task(
        description=f"""为'{user_input}'的小红书内容制定发布和运营策略。

请提供完整的发布计划：
1. 最佳发布时间：
   - 具体日期和时间段
   - 理由说明（基于目标受众活跃时间）

2. 发布频率建议：
   - 首发后是否需要跟进内容
   - 系列化内容规划

3. 互动策略：
   - 如何回复评论（提供 3 个回复模板）
   - 如何引导用户互动（提问、投票等）
   - 如何处理负面评论

4. 推广建议：
   - 是否需要投放薯条（小红书广告）
   - 预算建议和预期效果
   - 是否联合其他博主互动

5. 数据监测指标：
   - 核心 KPI（阅读量、互动率、收藏率等）
   - 监测时间点（发布后 1 小时、24 小时、7 天）
   - 优化调整策略

输出格式：结构化的发布运营方案
""",
        expected_output="完整的小红书发布和运营策略方案",
        agent=agents[3],  # social-media-strategist
        context=[content_task],
    )
    tasks.append(publishing_task)
    
    return tasks


def execute_scenario(scenario: str, user_input: str) -> Dict[str, Any]:
    """Execute a scenario with the appropriate expert team"""
    
    # Load experts for the scenario
    expert_mapping = {
        'xiaohongshu-marketing': [
            'xiaohongshu-specialist',
            'content-creator',
            'image-prompt-engineer',
            'social-media-strategist',
        ],
    }
    
    expert_names = expert_mapping.get(scenario, expert_mapping['xiaohongshu-marketing'])
    
    print(f"Loading {len(expert_names)} experts...", file=sys.stderr)
    
    # Create agents
    agents = []
    for expert_name in expert_names:
        expert_config = load_expert(expert_name)
        agent = create_agent(expert_config, verbose=True)
        agents.append(agent)
        print(f"✓ Loaded: {expert_name}", file=sys.stderr)
    
    # Create tasks based on scenario
    if scenario == 'xiaohongshu-marketing':
        tasks = create_xiaohongshu_tasks(agents, user_input)
    else:
        # Default: simple sequential tasks
        tasks = [
            Task(
                description=f"Complete the following task: {user_input}",
                expected_output="A comprehensive response to the user's request",
                agent=agents[0],
            )
        ]
    
    # Create crew
    print(f"Creating crew with {len(agents)} agents and {len(tasks)} tasks...", file=sys.stderr)
    
    crew = Crew(
        agents=agents,
        tasks=tasks,
        process=Process.sequential,
        verbose=True,
    )
    
    # Execute
    print("Starting execution...", file=sys.stderr)
    result = crew.kickoff()
    
    # Collect logs
    logs = []
    for task in tasks:
        logs.append({
            'task_description': task.description,
            'output': task.output.raw if hasattr(task.output, 'raw') else str(task.output),
            'agent': task.agent.role if task.agent else 'Unknown',
        })
    
    return {
        'result': result.raw if hasattr(result, 'raw') else str(result),
        'logs': logs,
        'scenario': scenario,
        'experts_used': expert_names,
    }


def main():
    if len(sys.argv) < 3:
        print(json.dumps({
            'error': 'Usage: python crew_runner.py <scenario> <user_input>',
            'example': 'python crew_runner.py xiaohongshu-marketing "夏季护肤"'
        }))
        sys.exit(1)
    
    scenario = sys.argv[1]
    user_input = sys.argv[2]
    
    try:
        output = execute_scenario(scenario, user_input)
        print(json.dumps(output, ensure_ascii=False, indent=2))
    except Exception as e:
        print(json.dumps({
            'error': str(e),
            'scenario': scenario,
        }), file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
