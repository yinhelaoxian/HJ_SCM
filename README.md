# 青岛豪江智能SCM演示系统

> 为制造业供应链管理打造的专业智能系统

## 项目定位

```
面向青岛豪江智能科技有限公司的SCM演示系统

目标用户：
├── 高管 → 战略决策（Dashboard、S&OP、绩效看板）
├── 中层 → 计划协同（MPS、MRP、供应商管理）
└── 基层 → 执行效率（订单追踪、任务管理、异常预警）
```

## 快速启动

```bash
cd scm-hj
npm install
npm run dev
```

## 访问地址

http://localhost:3000

## 项目结构

```
src/
├── core/                    # 核心配置与类型
│   ├── config/demo.config.ts # 可调参数配置
│   ├── types/               # 全局类型定义
│   └── utils/               # 工具函数
│
├── features/                # 功能模块
│   ├── dashboard/           # 供应链指挥中心
│   ├── demand-forecast/     # AI需求预测
│   ├── supply-balance/      # 供需平衡
│   ├── supplier-risk/       # 供应商风险
│   ├── procurement-ai/      # AI采购建议
│   ├── sop/                # S&OP产销协同
│   ├── mps/                # MPS主生产计划
│   ├── otc-flow/           # 订单全链路追踪
│   ├── kpi/                # SCOR绩效看板
│   └── p10_* - p17_*       # 高级功能模块
│
├── ui/                      # UI组件库（原子化）
│   ├── Button/
│   ├── Card/
│   ├── Badge/
│   ├── Toast/
│   ├── Skeleton/
│   └── index.ts
│
├── components/             # 业务组件
│   └── Layout/
│       └── Sidebar.tsx
│
├── services/               # 服务层
│   └── mock/               # Mock数据
│       ├── mock.data.ts
│       └── ai.suggestions.ts
│
├── hooks/                  # React Hooks
│   └── useToast.tsx
│
├── App.tsx
└── index.css
```

## 技术栈

- **前端框架**: React 18 + TypeScript
- **样式系统**: Tailwind CSS v4 + CSS Variables
- **图表库**: ECharts 5.x
- **图标库**: Lucide React
- **路由**: React Router 7

## 核心页面

| 页面 | 目标用户 | 核心价值 |
|------|----------|----------|
| **供应链指挥中心** | 高管 | 全局可视化，5分钟了解全局 |
| **AI需求预测** | 中层 | AI vs 人工，智能预测 |
| **供需平衡工作台** | 中层 | What-if场景模拟 |
| **供应商风险全景** | 中层 | 风险雷达，传导链路 |
| **AI采购建议** | 中层 | 从发现问题到给出答案 |
| **S&OP产销协同** | 高管 | 产销平衡，财务约束 |
| **MPS主生产计划** | 中层 | 三区管理，滚动更新 |
| **订单全链路追踪** | 全员 | 端到端可视化 |
| **SCOR绩效看板** | 高管 | 四维度KPI，对标最佳 |

## 业务研究

项目包含深度业务研究文档：

- `BUSINESS_RESEARCH.md` - 青岛豪江智能业务深度研究
- `BUSINESS_EXPERT.md` - 业务专家角色定义
- `TEAM_INTRO.md` - 团队介绍

### 核心发现

```
企业痛点：
├── 产销信息不对称
├── 供应链可视化低
├── 计划协同困难
├── MRP跑数不准
└── 供应商管理粗放

系统价值：
├── 决策效率提升50%
├── 缺货损失减少¥180万/年
├── 库存成本降低¥120万/年
└── ROI 4.75x，回收期3个月
```

## 团队协作

项目采用多角色协作模式：

| 角色 | 职责 |
|------|------|
| 产品经理 | 需求分析、功能设计 |
| 业务专家 | 行业研究、客户验收 |
| 系统架构师 | 技术架构、API设计 |
| 高级工程师 | 代码实现、性能优化 |
| QA测试员 | 质量保证、缺陷管理 |
| 交付官 | 发布部署、运维监控 |
| Docker专家 | 容器化、环境管理 |
| 超级能力官 | AI集成、自动化增强 |

## 设计系统

项目遵循统一设计系统规范：

- `DESIGN_SYSTEM.md` - 设计系统规范v2.0
- 颜色系统、间距系统、字体系统
- Tailwind CSS v4 @theme集成
- 深色主题优先

## 项目文档

```
docs/
├── 01_TEAM/              # 团队与角色
│   ├── TEAM_INTRO.md     # Agent角色定义 ⭐
│   └── MULTI_AGENT_SETUP.md  # 多Agent协作配置
│
├── 02_PMO/               # 项目管理
│   ├── PMO_PROJECT_MANAGEMENT.md  # 管理制度 ⭐
│   └── QA_COLLABORATION.md       # QA协作规范
│
├── 03_BUSINESS/          # 业务文档
│   ├── BUSINESS_RESEARCH.md      # 业务调研
│   ├── BUSINESS_EXPERT.md        # 专家方案
│   ├── CONSULTING_REPORT.md      # 战略咨询
│   ├── REMEDIATION_PLAN.md       # 整改计划
│   └── ACCEPTANCE/               # 验收报告
│       ├── BUSINESS_ACCEPTANCE.md
│       ├── BUSINESS_ACCEPTANCE_V2.md
│       └── QA_REPORT.md
│
├── 04_TECHNICAL/         # 技术文档
│   └── DESIGN_SYSTEM.md  # 设计系统
│
└── 06_RELEASES/          # 发布与复盘
    └── BUG_RETROSPECTIVE.md   # 问题复盘
```

### 核心文档（必读）

| 优先级 | 文档 | 用途 |
|--------|------|------|
| ⭐⭐⭐ | `docs/01_TEAM/TEAM_INTRO.md` | Agent角色定义 |
| ⭐⭐⭐ | `docs/02_PMO/PMO_PROJECT_MANAGEMENT.md` | 协作流程 |
| ⭐⭐ | `docs/03_BUSINESS/BUSINESS_RESEARCH.md` | 业务背景 |
| ⭐⭐ | `docs/03_BUSINESS/CONSULTING_REPORT.md` | 战略规划 |

### 新项目启动

1. 阅读 `docs/01_TEAM/TEAM_INTRO.md` 了解Agent
2. 阅读 `docs/02_PMO/PMO_PROJECT_MANAGEMENT.md` 熟悉流程
3. 复制 `docs/02_PMO/` 模板到新项目
4. 按Agent分工开始协作

## GitHub

```
git@github.com:yinhelaoxian/HJ_SCM.git
```

## 许可证

MIT License
