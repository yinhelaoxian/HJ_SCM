# AI-Agent-Collaboration-Process.md

## 项目信息

- **项目名称**: HJ_SCM 供应链管理系统
- **甲方负责人**: 用户（当前会话）
- **甲方项目经理**: OpenCLAW (大龙虾)
- **乙方开发团队**: Claude Code Agent Teams
- **项目阶段**: Sprint 9 (测试发布)

---

## 三方角色定义与边界

### 1. 甲方负责人 (User)
**职责范围**:
- 提出业务需求和产品想法
- 最终决策与验收
- 资源审批与进度监控

**禁止行为**:
- 不参与技术实现细节
- 不写代码、不做架构设计
- 不直接对接开发团队

---

### 2. 甲方项目经理 (OpenCLAW · 大龙虾)
**核心定位**: 需求转化与资源协调

**专属任务**:

#### 【1】项目管理 Dashboard 维护
- 提前建立并持续更新项目 Dashboard (markdown/JSON)
- 内容包含: 项目状态、阶段、完成情况、产出物、Git记录、部署状态
- 每次收到 Claude Code 结果，自动静默更新 Dashboard
- 回答 "展示Dashboard" 时，立即输出最新版

#### 【2】Claude Code 安装、配置、移交
- 负责安装、配置、启动 Claude Code 及 Agent Teams
- 完整移交 Workspace、项目结构、历史代码、规范
- 确保 Claude Code 完全理解项目，无缝接管开发
- 移交后只监督，不插手开发

#### 【3】协同流程文档管理
- 维护这份协同流程文档
- 自动提交并推送到 GitHub 仓库
- 流程更新时自动维护并同步

**工作边界 (严格遵守)**:
✅ **只做**:
- 需求理解与整理
- 向 Claude Code 下达开发指令
- 执行本地/服务器操作: 文件、Git、部署、启动
- 进度监督与 Dashboard 更新
- 环境、工作区、配置维护

❌ **不做**:
- 产品设计
- 架构设计
- 写业务代码
- 开发、测试
- 写技术文档
- 任务拆解

---

### 3. 乙方全栈开发团队 (Claude Code Agent Teams)
**核心定位**: 技术实现专家

**组成架构**:
```
Claude Code Agent Teams
├── Product Manager       # 产品设计、需求分析
├── System Architect      # 架构设计、API设计
├── Senior Engineer       # 代码实现、优化
├── QA Tester             # 测试、质量保证
├── Delivery Officer      # 部署、CI/CD
├── Docker Expert         # 容器化、环境管理
├── OpenCode Officer      # 代码审查、仓库管理
└── Superpowers Officer   # AI集成、自动化

**工作流程**:
1. 接收 OpenCLAW 的正式开发指令
2. 执行完整项目流程: 产品设计 → 架构 → 开发 → 测试 → 文档
3. 输出全部成果物: 代码、文档、配置
4. 自动更新项目 Dashboard
```

---

## 标准全自动执行流程

### 阶段 1: 需求理解与转化

```mermaid
graph TD
    A[User: 提出 Idea] --> B{OpenCLAW: 需求理解}
    B --> C{整理成清晰需求}
    C --> D[制定开发计划]
    D --> E[正式指令发送]
    style B fill:#0077ff,stroke:#000,stroke-width:2px
    style C fill:#0077ff,stroke:#000,stroke-width:2px
    style D fill:#0077ff,stroke:#000,stroke-width:2px
```

### 阶段 2: 开发执行

```mermaid
sequenceDiagram
    participant U as User
    participant P as OpenCLAW
    participant C as Claude Code Team
    
    Note over U,P: 需求阶段
    U->>P: 业务需求
    P->>C: 正式开发指令
    
    Note over C: 开发执行
    C->>C: 产品设计
    C->>C: 架构设计
    C->>C: 代码开发
    C->>C: 测试验证
    C->>C: 技术文档
    
    Note over P: 项目管理
    C->>P: 成果物交付
    P->>U: 进度汇报
```

---

## 协作规则与规范

### 1. 指令下达规范

**OpenCLAW 指令格式**:
```markdown
## 开发任务: [任务名称]

### 需求描述
- [核心需求]
- [业务场景]
- [边界条件]

### 技术要求
- [使用技术栈]
- [代码规范]
- [交付时间]

### 验收标准
- [功能验收]
- [性能验收]
- [文档要求]
```

### 2. Git 规范

**分支管理**:
- main: 主分支
- develop: 开发分支
- feature/xxx: 功能分支

**提交规范**:
```
类型: 描述 (#issue-number)
feat: 新增功能
fix: 修复Bug
refactor: 重构
docs: 文档
style: 代码格式
test: 测试
```

### 3. 沟通规则

**响应要求**:
- 收到指令后立即反馈 "接收成功"
- 遇到问题及时报告，不隐瞒
- 每日同步进度报告

---

## 项目配置信息

### Workspace 结构
```
/home/ubuntu/.openclaw/workspace/
├── HJ_SCM/                    # 项目根目录
│   ├── src/                   # 源代码
│   ├── docs/                  # 文档
│   ├── memory/                # 项目记忆
│   ├── sql/                   # 数据库脚本
│   ├── deployments/          # 部署配置
│   └── PROJECT_STATUS.md     # 项目状态 (Dashboard)
└── AI-Agent-Collaboration-Process.md  # 协同流程文档
```

### 环境配置
```
Node.js: 24.13.1
OpenCLAW: 2026.2.15
Claude Code: 2.1.45
Docker: 27.2.2
```

### 部署信息
- **本地开发**: http://localhost:3000
- **Docker开发**: docker compose up -d
- **服务器状态**: 运行中

---

## 历史记录

### 版本更新记录

| 日期 | 版本 | 变更说明 | 负责人 |
|------|------|----------|--------|
| 2026-02-18 | v1.0 | 初始版本，定义三方协作流程 | OpenCLAW |

---

## 工具调用规范（2026-02-18 更新）

### 1. 推荐调用方式：sessions_spawn

**从 2026-02-18 起，所有 Claude Code 开发任务优先使用 sessions_spawn 模式**

**使用方式**:
```javascript
// 在 OpenClaw 会话中使用 sessions_spawn 工具
sessions_spawn({
  agentId: "claude-code",
  task: "在 src/features/strategy 下创建 todo-next.md，内容为 '下一步：对接真实 API'",
  cleanup: "keep"  // 可选：keep（默认）或 delete
})
```

**优势**:
- ✅ 文件系统共享（与主工作区同一目录）
- ✅ 认证自动继承（无需手动配置 token）
- ✅ 进程可监控（子代理会话独立记录）
- ✅ 支持并行子代理（可同时启动多个任务）

### 2. CLI 模式（备选）

当 sessions_spawn 不可用时，可使用 CLI 模式：

```bash
cd /home/ubuntu/.openclaw/workspace/HJ_SCM
claude --dangerously-skip-permissions \
  --settings '{"env":{"ANTHROPIC_AUTH_TOKEN":"xxx","ANTHROPIC_BASE_URL":"https://ark.cn-beijing.volces.com/api/coding","ANTHROPIC_MODEL":"ark-code-latest"}}' \
  --print "任务指令"
```

**注意**: CLI 模式需要 `--dangerously-skip-permissions` 参数才能写入文件。

### 3. Spawn 模式配置步骤

**步骤 1: 创建 claude-code agent**
```bash
openclaw agents add claude-code \
  --model ark-code-latest \
  --workspace /home/ubuntu/.openclaw/workspace/HJ_SCM
```

**步骤 2: 配置权限**
在 `~/.openclaw/openclaw.json` 中添加：
```json
{
  "agents": {
    "list": [{
      "id": "main",
      "subagents": {
        "allowAgents": ["claude-code"]
      }
    }]
  }
}
```

**步骤 3: 验证可用性**
```bash
openclaw agents list
# 应显示 claude-code agent
```

### 4. 测试验证

**Spawn 模式测试结果**:
- ✅ 文件创建成功：`spawn-test-success.md`
- ✅ 内容正确：`"Spawn 模式测试成功，时间：2026-02-18 22:46"`
- ✅ Git 提交：`95b75bb`

---

## 文件信息

- **文件名**: AI-Agent-Collaboration-Process.md
- **创建时间**: 2026-02-18
- **最后修改**: 2026-02-18
- **Git 地址**: [https://github.com/yinhelaoxian/HJ_SCM]

