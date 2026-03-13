# CrewAI 多 Agent 架构分析 (CrewAI ARCHITECTURE)

**版本**: v1.0  
**创建日期**: 2026-03-13  
**研究来源**: CrewAI 官方文档 + 源码分析

---

## 📖 概述

**CrewAI** 是一个独立的多 Agent 协作框架，完全独立于 LangChain 等其他框架。它提供了两种核心抽象：
- **Crews**: 基于角色的自主 Agent 团队，通过协作完成复杂任务
- **Flows**: 事件驱动的工作流，提供精确的控制和状态管理

**核心优势**:
- ⚡ 高性能：独立构建，无外部依赖负担
- 🎯 灵活性：高层简洁 + 底层精确控制
- 🏢 企业级：支持 AMP 云平台、追踪、部署
- 👥 社区：100,000+ 认证开发者

---

## 🏗️ 核心架构设计

### 1. 架构层次

```
┌─────────────────────────────────────────────────┐
│              CrewAI AMP Suite                    │
│         (企业级控制平面、追踪、部署)                │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│              CrewAI Flows                        │
│      (事件驱动工作流、状态管理、条件分支)           │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│              CrewAI Crews                        │
│    (多 Agent 团队、角色定义、任务编排)              │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│              Individual Agents                   │
│    (角色、目标、背景故事、工具、LLM)               │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│           LLM Providers (LiteLLM 路由)            │
│   OpenAI / Anthropic / Google / Ollama / ...    │
└─────────────────────────────────────────────────┘
```

### 2. 核心组件

#### Agent (智能体)
**定义**: 具有角色、目标、背景故事的自主单元，配备工具和 LLM

```python
from crewai import Agent

agent = Agent(
    role="高级数据研究员",
    goal="发现{topic}领域的最新突破",
    backstory="你是经验丰富的研究员，擅长发现前沿技术...",
    tools=[SerperDevTool()],
    llm="openai/gpt-4o",
    verbose=True,
    allow_delegation=True,  # 可委托给其他 Agent
    max_iter=20,            # 最大迭代次数
    max_rpm=10,             # 速率限制
)
```

**关键参数**:
| 参数 | 默认值 | 说明 |
|------|--------|------|
| `role` | 必填 | Agent 的角色和职能 |
| `goal` | 必填 | 个人目标，指导决策 |
| `backstory` | 必填 | 背景和个性设定 |
| `llm` | GPT-4 | 语言模型配置 |
| `tools` | [] | 工具列表 |
| `allow_delegation` | False | 是否可委托任务 |
| `max_iter` | 20 | 最大迭代次数 |
| `max_rpm` | None | 每分钟请求限制 |
| `verbose` | False | 详细日志 |
| `memory` | False | 启用记忆系统 |
| `reasoning` | False | 反思后行动模式 |
| `multimodal` | False | 多模态支持 |

#### Task (任务)
**定义**: 具体工作分配，包含描述、预期输出和负责 Agent

```python
from crewai import Task

task = Task(
    description="研究{topic}的最新发展",
    expected_output="包含前 5 大发展的详细报告",
    agent=researcher,
    tools=[SerperDevTool()],
    context=[previous_task],  # 依赖其他任务输出
    output_pydantic=Report,   # 结构化输出
    human_input=True,         # 需要人工审核
)
```

**关键参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| `description` | str | 任务描述 |
| `expected_output` | str | 完成标准 |
| `agent` | Agent | 负责 Agent |
| `tools` | List | 任务专用工具 |
| `context` | List | 依赖的任务输出 |
| `async_execution` | bool | 异步执行 |
| `output_pydantic` | BaseModel | 结构化输出模型 |
| `human_input` | bool | 人工介入 |
| `guardrail` | Callable | 输出验证 |

#### Crew (团队)
**定义**: 编排多个 Agent 执行任务的协调器

```python
from crewai import Crew, Process

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process=Process.sequential,  # 或 Process.hierarchical
    verbose=True,
    memory=True,        # 启用记忆
    cache=True,         # 启用缓存
    max_rpm=100,        # 全局速率限制
)

# 执行
result = crew.kickoff(inputs={"topic": "AI Agents"})
```

**执行流程**:
- **Sequential**: 任务按定义顺序执行，输出传递给下一个任务
- **Hierarchical**: 管理 Agent 根据能力动态分配任务

#### Flow (工作流)
**定义**: 事件驱动的工作流，支持复杂逻辑和状态管理

```python
from crewai.flow.flow import Flow, listen, start, router

class ContentFlow(Flow[ContentState]):
    @start()
    def research(self):
        result = ResearchCrew().crew().kickoff(
            inputs={"topic": self.state.topic}
        )
        self.state.research = result.raw

    @listen(research)
    def write(self):
        result = WritingCrew().crew().kickoff(
            inputs={"topic": self.state.topic, "research": self.state.research}
        )
        self.state.article = result.raw

    @router(write)
    def review(self):
        if self.state.quality_score > 0.8:
            return "approved"
        return "needs_revision"

    @listen("approved")
    def publish(self):
        print("发布文章...")

    @listen("needs_revision")
    def revise(self):
        print("修改文章...")
```

**Flow 装饰器**:
| 装饰器 | 作用 |
|--------|------|
| `@start()` | 入口点，Flow 开始时执行 |
| `@listen(method)` | 监听指定方法完成 |
| `@router(method)` | 条件分支，返回标签触发不同监听器 |

---

## 🤝 多 Agent 协作机制

### 1. 协作模式

#### 顺序协作 (Sequential)
```
Agent1 → Task1 → Output1 → Agent2 → Task2 → Output2 → ...
```

**适用场景**: 线性工作流，任务有明确依赖关系

#### 层级协作 (Hierarchical)
```
           Manager Agent
          /      |      \
    Agent1    Agent2    Agent3
      ↓         ↓         ↓
   Task1     Task2     Task3
```

**适用场景**: 需要动态任务分配、复杂决策

#### 自主协作 (Autonomous)
```
Agent1 ←→ Agent2 ←→ Agent3
  ↓       ↓       ↓
相互委托、提问、协作
```

**适用场景**: 探索性任务、需要跨专业协作

### 2. 通信机制

#### 任务委托
```python
# 允许委托
manager = Agent(
    role="项目经理",
    allow_delegation=True,  # 可委托
)

#  Specialist 不允许委托，避免循环
specialist = Agent(
    role="技术专家",
    allow_delegation=False,
)
```

#### 提问机制
Agent 可以向其他 Agent 提问获取信息：
```
Agent A: "我需要关于 X 的数据"
  ↓
委托系统 → Agent B (数据专家)
  ↓
Agent B: "这是 X 的数据..."
  ↓
Agent A: 继续执行任务
```

### 3. 群组聊天机制实现

CrewAI 通过以下方式实现类似群组聊天的协作：

#### (1) 共享上下文
```python
crew = Crew(
    agents=[agent1, agent2, agent3],
    tasks=[task1, task2, task3],
    process=Process.sequential,
    memory=True,  # 启用共享记忆
)
```

#### (2) 任务输出传递
```yaml
# tasks.yaml
task1:
  agent: researcher
  expected_output: "研究报告"

task2:
  agent: writer
  context: [task1]  # 获取 task1 输出
  description: "基于研究报告写文章"
```

#### (3) 人工介入点
```python
from crewai.flow.human_feedback import human_feedback

class ReviewFlow(Flow):
    @start()
    @human_feedback(
        message="审批此内容？",
        emit=["approved", "rejected"],
    )
    def generate_content(self):
        return "待审批内容"

    @listen("approved")
    def on_approval(self):
        feedback = self.last_human_feedback
        print(f"审批通过：{feedback.feedback}")
```

---

## 🔄 任务分配和执行流程

### 1. 任务分配流程

```
用户输入任务
    ↓
Crew 解析任务需求
    ↓
匹配 Agent 能力 (role + goal + tools)
    ↓
分配给最合适的 Agent
    ↓
Agent 执行 (可委托/提问)
    ↓
输出结果 → 验证 (guardrail)
    ↓
传递给下一个任务 (如有依赖)
```

### 2. 执行流程详解

#### Sequential 流程
```python
# 定义
tasks = [research_task, analyze_task, write_task]

# 执行流程
1. research_task → researcher → 研究报告
2. analyze_task → analyst (接收研究报告) → 分析结果
3. write_task → writer (接收分析结果) → 最终文章
```

#### Hierarchical 流程
```python
crew = Crew(
    agents=[manager, researcher, writer],
    tasks=[task1, task2, task3],
    process=Process.hierarchical,
    manager_llm="gpt-4o",  # 管理 Agent 的 LLM
)

# 执行流程
1. Manager 接收任务
2. Manager 分析任务需求
3. Manager 委托给 researcher: "请研究 X"
4. Manager 委托给 writer: "请写文章"
5. Manager 整合结果 → 最终输出
```

### 3. 异步执行

```python
# 定义异步任务
task1 = Task(..., async_execution=True)
task2 = Task(..., async_execution=True)

# 并行执行
crew.kickoff()  # task1 和 task2 同时执行

# 等待完成后继续
task3 = Task(
    ...,
    context=[task1, task2]  # 依赖两个任务输出
)
```

---

## 🛠️ 技术实现要点

### 1. 项目结构

#### Crew 项目
```
my_crew/
├── src/my_crew/
│   ├── config/
│   │   ├── agents.yaml       # Agent 定义
│   │   └── tasks.yaml        # 任务定义
│   ├── tools/
│   │   └── custom_tool.py    # 自定义工具
│   ├── crew.py               # Crew 编排
│   └── main.py               # 入口
├── knowledge/                 # 知识库
├── .env                       # 环境变量
└── pyproject.toml
```

#### Flow 项目
```
my_flow/
├── src/my_flow/
│   ├── crews/                 # 多个 Crew
│   │   └── research_crew/
│   ├── tools/                 # 工具
│   ├── main.py                # Flow 编排
│   └── ...
└── pyproject.toml
```

### 2. YAML 配置

#### agents.yaml
```yaml
researcher:
  role: >
    {topic} 高级数据研究员
  goal: >
    发现{topic}领域的最新突破
  backstory: >
    你是经验丰富的研究员，擅长发现前沿技术...
  # 可选配置
  llm: openai/gpt-4o
  max_iter: 20
  verbose: true

writer:
  role: >
    {topic} 技术作家
  goal: >
    创作引人入胜的技术内容
  backstory: >
    你是 skilled 作家，擅长将复杂信息转化为清晰内容...
```

#### tasks.yaml
```yaml
research_task:
  description: >
    研究{topic}的最新发展
  expected_output: >
    包含前 5 大发展的详细报告
  agent: researcher
  tools: [serper_dev_tool]
  output_file: output/research.md

writing_task:
  description: >
    基于研究报告写文章
  expected_output: >
    4 段落的 polished 文章
  agent: writer
  context: [research_task]
  output_file: output/article.md
```

### 3. 工具集成

#### 内置工具 (crewai-tools)
```python
from crewai_tools import (
    SerperDevTool,      # 搜索
    ScrapeWebsiteTool,  # 网页抓取
    FileReadTool,       # 文件读取
    PDFSearchTool,      # PDF 搜索
    CodeInterpreterTool, # 代码执行
)
```

#### 自定义工具
```python
from crewai.tools import BaseTool
from pydantic import BaseModel, Field

class SearchInput(BaseModel):
    query: str = Field(..., description="搜索查询")

class CustomSearchTool(BaseTool):
    name: str = "custom_search"
    description: str = "搜索自定义知识库"
    args_schema: type[BaseModel] = SearchInput

    def _run(self, query: str) -> str:
        # 实现搜索逻辑
        return f"搜索结果：{query}"
```

### 4. 记忆系统

```python
crew = Crew(
    agents=[...],
    tasks=[...],
    memory=True,  # 启用记忆
    embedder={
        "provider": "ollama",
        "config": {"model": "mxbai-embed-large"},
    },
)
```

**四种记忆类型**:
- **短期记忆** (ChromaDB + RAG): 当前执行的交互
- **长期记忆** (SQLite): 跨会话持久化
- **实体记忆** (RAG): 追踪人、地点、概念
- **上下文记忆**: 整合所有记忆类型

### 5. 知识系统

```python
from crewai.knowledge.source.string_knowledge_source import StringKnowledgeSource
from crewai.knowledge.source.pdf_knowledge_source import PDFKnowledgeSource

# Agent 级知识
agent = Agent(
    ...,
    knowledge_sources=[
        StringKnowledgeSource(content="领域知识..."),
        PDFKnowledgeSource(file_paths=["docs/manual.pdf"]),
    ]
)

# Crew 级知识 (共享)
crew = Crew(
    ...,
    knowledge_sources=[PDFKnowledgeSource(...)]
)
```

### 6. 结构化输出

```python
from pydantic import BaseModel

class Report(BaseModel):
    title: str
    summary: str
    findings: list[str]
    recommendations: list[str]

task = Task(
    ...,
    output_pydantic=Report,  # 强制结构化输出
)

# 执行后
result = crew.kickoff()
print(result.pydantic.title)       # 访问结构化字段
print(result.pydantic.findings)    # list[str]
```

### 7. Guardrails (护栏)

```python
# 函数验证
def validate(result):
    if len(result.raw.split()) < 100:
        return (False, "内容太短，请扩展")
    return (True, result.raw)

task = Task(..., guardrail=validate)

# LLM 验证
task = Task(
    ...,
    guardrail="必须少于 200 字且专业语气"
)

# 多重护栏
task = Task(
    ...,
    guardrails=[validate_length, validate_tone, "必须真实"]
)
```

---

## 🚀 部署与扩展

### 1. CrewAI AMP 云平台

**功能**:
- 统一控制平面
- 实时追踪和监控
- 一键部署
- REST API 调用
- 指标和日志

**部署流程**:
```bash
# 认证
crewai login

# 创建部署
crewai deploy create

# 推送更新
crewai deploy push

# 查看状态
crewai deploy status
crewai deploy logs
```

### 2. REST API

部署后自动获得 REST API:
```
POST /kickoff
{
  "inputs": {"topic": "AI Agents"}
}

GET /status/{kickoff_id}
GET /inputs
```

### 3. 性能优化

- **速率限制**: `max_rpm` 避免 API 限流
- **缓存**: `cache=True` 缓存工具结果
- **异步执行**: `async_execution=True` 并行任务
- **上下文窗口**: `respect_context_window=True` 自动总结

---

## 📊 与 Agent2Go 的集成建议

### 1. Agent 角色映射

| Agent2Go 场景 | CrewAI Agent 配置 |
|--------------|------------------|
| 小红书营销专家 | role="小红书营销专家", tools=[xiaohongshu_tool] |
| 技术研究员 | role="高级研究员", tools=[search_tool, scrape_tool] |
| 全栈开发者 | role="全栈工程师", tools=[code_tool, github_tool] |

### 2. 群组协作流程

```python
class XiaohongshuMarketingFlow(Flow):
    @start()
    def trend_analysis(self):
        # 选题专家分析趋势
        result = TrendAnalysisCrew().crew().kickoff()
        self.state.trends = result.raw

    @listen(trend_analysis)
    def content_creation(self):
        # 文案专家写文案
        result = ContentCreationCrew().crew().kickoff(
            inputs={"trends": self.state.trends}
        )
        self.state.content = result.raw

    @listen(content_creation)
    def image_generation(self):
        # 配图专家生成图片
        result = ImageGenerationCrew().crew().kickoff(
            inputs={"content": self.state.content}
        )
        self.state.images = result.raw

    @listen(image_generation)
    def publish(self):
        # 发布专家组织内容
        result = PublishCrew().crew().kickoff(
            inputs={"content": self.state.content, "images": self.state.images}
        )
        return result
```

### 3. 用户交互流程

```
用户选择场景 (Web UI)
    ↓
系统推荐 Agent 梦之队
    ↓
Flow 启动 → 创建 Crew
    ↓
Agent 群组协作 (Flow 编排)
    ↓
人工介入点 (审批/修改)
    ↓
任务完成 → 结果交付
```

---

## 📚 学习资源

- **官方文档**: https://docs.crewai.com
- **GitHub**: https://github.com/crewAIInc/crewAI
- **社区课程**: https://learn.crewai.com (100,000+ 认证开发者)
- **示例库**: https://github.com/crewAIInc/crewAI/tree/main/examples

---

**文档维护**: Researcher Agent  
**最后更新**: 2026-03-13  
**CrewAI 版本**: v1.x (最新)
