# 青岛豪江智能 HJ_SCM 项目全面评估报告

**评估日期：** 2026-02-19  
**评估版本：** HJ_SCM-main（截至 2026-02-14 最新提交）  
**评估范围：** 代码质量、架构设计、安全性、性能、可维护性、业务目标实现度、功能满足度、数据合理性

---

## 总体评分概览

| 评估维度 | 评分 | 等级 |
|----------|------|------|
| 代码质量 | 7.0 / 10 | 良好 |
| 架构设计 | 7.5 / 10 | 良好 |
| 安全性 | 4.5 / 10 | 待改善 |
| 性能设计 | 5.5 / 10 | 一般 |
| 可维护性 | 6.5 / 10 | 良好 |
| 业务目标实现度 | 6.5 / 10 | 良好 |
| 功能满足度 | 6.0 / 10 | 一般 |
| 数据合理性 | 7.0 / 10 | 良好 |
| **综合评分** | **6.3 / 10** | **中等偏良** |

---

## 一、代码质量评估（7.0 / 10）

### 1.1 优点

**后端 Java 代码质量较高**

`MRPEngineService`、`ATPCalculator`、`SafetyStockCalculator` 等核心服务展示出良好的工程素养：结构清晰、职责单一、使用 Lombok 减少样板代码、BigDecimal 精确计算、日志记录规范（Slf4j + 结构化日志）、`@Transactional` 注解使用得当。

BOM 展开采用 BFS（广度优先搜索）队列算法，逻辑清晰，避免了递归栈溢出风险。安全库存采用标准公式 `SS = Zα × σ × √L`，并支持季节性动态调整，体现了较强的业务建模能力。

**前端 React/TypeScript 代码组织合理**

按 `features/` 目录组织功能模块，UI 原子组件（Button、Card、Badge 等）独立封装，类型系统（`core/types/index.ts`）定义完整。

### 1.2 问题

**严重：大量 TODO 未完成**

以下关键业务逻辑被标注为 TODO，处于空壳状态：

```java
// MRPEngineService.java
private List<MpsRequirement> getMpsRequirements(MrpRunRequest request) {
    return Collections.emptyList(); // TODO: 从 MPS 模块获取需求
}
private List<SupplierInfo> findActiveSuppliers(String itemCode) {
    return Collections.emptyList(); // TODO: 从供应商模块查询
}
private void saveMrpResults(...) {
    // TODO: 保存到数据库
}
private void publishMrpCompletedEvent(...) {
    // TODO: 发布领域事件
}
```

这意味着 MRP 引擎目前无法真正运行——不能从 MPS 获取需求输入，不能保存计算结果，不能发布事件，也无法匹配供应商。

**严重：JWT 实现不安全**

```java
// SupplierAuthService.java — 严重安全漏洞
private String generateJWT(SupplierEntity supplier) {
    // 使用 Base64 编码代替真正的 JWT 签名
    return Base64.getEncoder().encodeToString(payload.toString().getBytes());
}

public boolean validateToken(String token) {
    try {
        return true; // 永远返回 true！任何 token 都通过验证
    } catch (Exception e) {
        return false;
    }
}

public String getSupplierIdFromToken(String token) {
    return "SUP-001"; // 硬编码！所有请求都被认为是同一个供应商
}
```

**中等：前端依然使用硬编码 Mock 数据**

大量前端模块（MRP、Dashboard、供应商等）直接使用 `mock.data.ts` 中的静态数据，并未对接已定义的 `services/api.ts` 真实接口。

**轻微：前端存在混合命名规范**

`p05_Inventory`、`p10_AlertRules` 等使用带序号下划线风格，与 `demand-forecast`、`supplier-portal` 等 kebab-case 命名不统一，应统一为 kebab-case。

### 1.3 建议

1. 立即修复 JWT 安全漏洞，引入 JJWT 库实现真正的签名验证。
2. 规划 TODO 清单，按优先级补全核心业务逻辑（MRP 数据获取 → 事件发布 → 供应商匹配）。
3. 逐步将前端 mock 数据替换为真实 API 调用，建议引入 MSW（Mock Service Worker）管理测试期 mock 数据。
4. 统一前端目录命名规范。

---

## 二、架构设计评估（7.5 / 10）

### 2.1 优点

**整体分层架构清晰合理**

前端 React + 后端 Spring Boot + PostgreSQL + Redis 的技术栈选型成熟稳定，符合制造业 SCM 系统的主流选型。前端按 `core/features/ui/services/hooks` 五层结构组织，职责清晰。

**领域驱动设计意识较强**

后端代码体现出 DDD 设计意识：`entity/dto/service/repository/event` 分层明确，存在 `DomainEvent`、`EventPublisher`、`EventHandler` 等事件驱动基础设施，`StateMachineEngine` 管理核心业务状态流转，对于 SCM 复杂业务场景适配性好。

**核心算法模块独立封装**

`ATPCalculator`、`SafetyStockCalculator`、`ABCXYZClassifier`、`StagnationDetector` 等算法独立成 Service，便于单独测试和替换。

**容器化部署方案完善**

提供了 `docker-compose.yml`（开发环境）和 K8s 部署配置（`deployments/k8s/dev/` 和 `prod/`），具备从开发到生产的完整部署链路设计。

### 2.2 问题

**状态机与 MRP 引擎的模块间集成路径不清晰**

MRP 计算完成后通过 `publishMrpCompletedEvent` 发布事件，但事件订阅者和下游处理逻辑尚未实现。MDM 主数据与采购、库存、生产等模块的数据共享接口也缺少统一的服务层。

**前端缺少状态管理方案**

目前前端无 Redux/Zustand/Jotai 等全局状态管理方案，复杂跨模块状态（如当前 MRP 运行结果、全局异常列表）的共享方式不明确。

**`node_modules` 依赖版本存在冲突风险**

`react-is: ^19.2.4` 与 `react: ^18.2.0` 版本不匹配（react-is 19 对应 react 19），可能引发运行时问题。

**数据库缺少核心业务表**

`sql/schema_mdm_v1.0.sql` 只包含 MDM 主数据表，缺少：库存余额表、在途订单表、MRP 运算结果表、生产工单表、采购订单表等核心业务表的 DDL 定义。

### 2.3 建议

1. 补充完整的数据库 Schema，特别是核心业务交易表。
2. 明确模块间集成接口设计（可通过 OpenAPI 文档或内部 Service Interface 定义）。
3. 前端引入轻量状态管理（推荐 Zustand），解决跨模块状态共享问题。
4. 修复 `package.json` 中 `react-is` 版本，改为 `^18.x`。

---

## 三、安全性评估（4.5 / 10）— 重点警示

### 3.1 严重问题

**JWT Token 形同虚设**

如前所述，`validateToken()` 永远返回 `true`，`getSupplierIdFromToken()` 永远返回硬编码 `"SUP-001"`。这意味着供应商门户没有任何身份验证保护，任何人都可以冒充任意供应商访问系统数据。

**JWT 密钥硬编码在源码中**

```java
private static final String JWT_SECRET = "hjscm-supplier-secret-key-2026";
private static final long JWT_EXPIRATION = 30 * 24 * 60 * 60 * 1000L; // 30天
```

密钥应通过环境变量或配置中心注入，不应出现在代码中。Token 有效期 30 天过长，建议改为 8 小时（配合 Refresh Token 机制）。

**数据库密码明文写在 `docker-compose.yml`**

```yaml
POSTGRES_PASSWORD: postgres
DB_PASSWORD: postgres
```

默认密码出现在版本控制仓库中，需通过 `.env` 文件（加入 `.gitignore`）或 Kubernetes Secret 管理敏感配置。

**Mock 认证密码明文可见**

```javascript
// mockAPI.ts
if (code === 'SUP001' && password === '123456') { ... }
```

即使是 Mock 代码，也不应提交明文密码到代码仓库（可能泄露测试环境真实配置习惯）。

### 3.2 中等问题

- `docs/SECURITY.md` 中 HTTPS 加密传输项标记为"未完成"，生产环境必须启用。
- 前端 `api.ts` 所有 API 调用均无错误处理（无统一的 401/403/500 拦截器），token 过期后没有自动刷新或跳转登录逻辑。
- 供应商数据查询缺少数据行级隔离（Row-Level Security），供应商 A 理论上可查询供应商 B 的数据。

### 3.3 建议（按优先级）

1. **P0**：引入 JJWT 库，重写 `generateJWT`/`validateToken`/`getSupplierIdFromToken`。
2. **P0**：JWT 密钥、数据库密码改用环境变量注入，`.env` 加入 `.gitignore`。
3. **P0**：所有 API 接口增加 Spring Security 权限注解（`@PreAuthorize`）。
4. **P1**：前端增加 axios 拦截器，统一处理 401/403 响应。
5. **P1**：Token 有效期缩短至 8 小时，实现 Refresh Token 机制。
6. **P1**：PostgreSQL 权限隔离，供应商用户只能访问其关联数据。
7. **P2**：生产部署必须启用 HTTPS（Let's Encrypt 或企业 CA 证书）。

---

## 四、性能评估（5.5 / 10）

### 4.1 优点

- MRP 引擎使用 BFS 而非递归，避免深层 BOM 的栈溢出。
- ATP 计算中最早可承诺日期的推算设置了 90 天上限，防止无限循环。
- Redis 缓存已在 `docker-compose.yml` 中配置，但尚未在代码中看到缓存的使用（`@Cacheable` 等注解）。

### 4.2 问题

**MRP 引擎存在 N+1 查询风险**

`calculateNetRequirements` 中对每个物料逐一调用 `getOnHand`、`getInTransit`、`getAllocated`、`getSafetyStock`，实际运行时将产生大量数据库单行查询，在物料数量多时性能极差。

**ATP 最早日期计算存在潜在死循环**

`calculateFirstAvailableDate` 方法中，每次循环调用 `getInTransitQty`（一次数据库查询），逐日计算直到 90 天，最坏情况 90 次查询，且逻辑存在 bug（`neededQty` 只减去 `futureInTransit` 而不加上当日库存）。

**前端无虚拟滚动**

多个列表页面（库存、MRP 建议等）直接渲染全量数据，当物料数量达到数千条时页面会明显卡顿。

**性能测试全部待执行**

`PROJECT_STATUS.md` 中明确标注性能测试进度为 0%，MRP 全量运算 <30s、API P95 <500ms 等指标无任何实测数据支撑。

### 4.3 建议

1. MRP 净需求计算改为批量查询：一次性获取所有物料的库存、在途数据，内存中计算净需求。
2. 为常用主数据（物料、BOM、安全库存配置）添加 Redis 缓存，TTL 设置 1 小时。
3. 前端长列表引入虚拟滚动（`react-virtual` 或 `react-window`）。
4. 尽快执行 `performance/load-test.js`，获取基准性能数据。
5. 数据库关键查询字段补充索引（如 `inventory_balance` 的 `material_code + plant_code` 联合索引）。

---

## 五、可维护性评估（6.5 / 10）

### 5.1 优点

- 文档体系完整，覆盖业务调研、PRD、技术规范、测试计划、发布说明等，文档完成率 100%，在同类 demo 项目中属优秀水平。
- 单元测试已编写（`MRPEngineServiceTest`、`ATPCalculatorTest` 等 5 个测试类），体现了 TDD 意识，但尚未实际运行。
- `SOUL.md`、`IDENTITY.md`、`AGENTS.md` 等 AI 协作文档设计创新，体现了多 Agent 协作开发的探索。

### 5.2 问题

**测试执行率为零**

`PROJECT_STATUS.md` 明确标注：测试执行率 0/5 = 0%。所有单元测试"已编写"但"待运行"，这意味着没有任何自动化测试保障代码质量，回归测试无法依赖机器完成。

**测试代码引用的 Repository 接口不存在**

后端测试中引用了 `MaterialDemandRepository`、`InTransitOrderRepository`、`BomRepository` 等接口，但这些接口在项目代码中找不到实现，测试代码无法编译通过。

**版本管理混乱**

`supplier-portal` 与 `supplier-portal-v2`、`kpi-scor` 与 `kpi-scor-v2` 等同时存在，但路由中 v2 版本未挂载，旧版本未清理，增加了维护负担。

**`spawn-test-success.md` 和 `HEARTBEAT.md` 等无业务价值文件混入仓库**

这些 AI Agent 协作过程中产生的状态文件不应提交到 Git，需加入 `.gitignore`。

### 5.3 建议

1. 立即执行单元测试，修复编译错误（补充缺失的 Repository 接口）。
2. 配置 GitHub Actions CI，在每次 PR 合并前自动运行测试。
3. 清理废弃的 v1/v2 并存模块，统一保留最新版本。
4. `.gitignore` 补充 `HEARTBEAT.md`、`spawn-test-success.md`、`memory/*.md`、`.openclaw/` 等 AI 协作过程文件。

---

## 六、业务目标实现度评估（6.5 / 10）

青岛豪江智能的核心业务目标在项目文档中明确定义为：解决产销信息不对称、提升供应链可视化、改善计划协同、优化 MRP 准确性、精细化供应商管理。

### 6.1 已实现目标

**供应链可视化（较好实现）**

Dashboard 供应链指挥中心展示了三厂（青岛/苏州/泰国）实时状态、核心 KPI（DIFOT、OTD、库存周转、按时交货率）、今日预警、关键订单，高管 5 分钟了解全局的目标基本实现。针对 Bühler 断供危机、圣诞备货等具体业务场景的演示路径设计合理。

**供应商管理可视化（已实现演示层）**

供应商风险雷达（财务/交货/质量/地缘政治/集中度/合规六维度）、供应商评分看板、供应商门户（PO确认、ASN创建、COA上传）功能完整，Mock 数据质量高（Bühler Motor GmbH 断供场景、苏州精驱科技备选供应商认证等）。

**MRP 引擎设计（架构正确，执行未通）**

MRP 引擎的算法设计（BOM 展开→净需求→齐套检查→采购建议）符合标准 MRP II 规范，但由于核心数据获取逻辑为 TODO，实际上无法完成一次完整的 MRP 运算。

### 6.2 未达成目标

**产销信息不对称问题尚未解决**

S&OP 产销协同页面存在，但 What-if 情景模拟（`p12_ScenarioSim`）内容较浅，缺少多方案对比、财务影响量化等核心能力，离"让销售部门和生产部门在同一平台上协商"的目标还有差距。

**MRP 跑数不准的问题没有根本改善**

当前 MRP 前端页面（`src/features/mrp/index.tsx`）展示的仍是硬编码 3 条测试数据（MAT-001/002/003），没有与后端 MRP 引擎联通。企业最痛的"MRP 跑数不准"问题在演示中无法体现改进。

**三厂协同计划能力缺失**

青岛（112% 超负荷）→ 苏州（78%）→ 泰国（43% 爬坡）的产能平衡与跨工厂工单分配功能尚不存在，RCCP 页面也是占位符状态。

### 6.3 建议

1. 优先打通 MRP 数据链路（MPS 需求输入 → MRP 运算 → 结果展示），这是豪江最核心的业务痛点。
2. S&OP What-if 模块需要增加财务约束维度（库存资金占用、采购成本预算），使其真正能支持高管决策。
3. 增加三厂产能可视化与跨厂调度建议功能（可先从甘特图展示开始）。

---

## 七、功能满足度评估（6.0 / 10）

### 7.1 已满足功能（覆盖约 60%）

| 功能模块 | 满足状态 | 备注 |
|----------|----------|------|
| 供应链指挥中心 Dashboard | ✅ 已实现 | Mock 数据，视觉效果好 |
| AI 需求预测 | ✅ 已实现 | AI vs 人工对比展示完整 |
| 供应商风险全景 | ✅ 已实现 | 六维雷达图，业务价值高 |
| 供应商评分看板 | ✅ 已实现 | OTD/质量/响应维度完整 |
| 供应商门户 | ✅ 已实现 | PO确认/ASN/COA功能完整 |
| MDM 主数据（物料/BOM/供应商） | ✅ 已实现 | 新增模块，Schema 设计好 |
| MPS 主生产计划（展示层） | ⚠️ 部分实现 | 三区管理UI存在，数据未联通 |
| MRP 物料计划（展示层） | ⚠️ 部分实现 | 后端引擎完整，前端Mock |
| 库存管理（ABC-XYZ/安全库存/呆滞） | ⚠️ 部分实现 | 算法完整，数据Mock |
| ATP 可承诺量检查 | ⚠️ 部分实现 | 后端逻辑完整，前端Mock |
| S&OP 产销协同 | ⚠️ 部分实现 | 基础版，缺 What-if 深度 |
| 质量管理（IQC/NCR） | ⚠️ 部分实现 | 实体类存在，UI为占位符 |
| WMS 仓储管理 | ❌ 缺失 | 仅有实体类，无业务逻辑 |
| 生产执行（工单/投料/完工） | ⚠️ 部分实现 | 实体类完整，大量占位符 |
| RCCP 粗产能规划 | ❌ 占位符 | 页面为空 |
| ERP/MES/EDI 集成 | ❌ 缺失 | 规划中 |

### 7.2 关键缺失功能

**采购执行闭环缺失**：供应商门户可以接收订单，但采购员侧的采购申请→审批→下单→收货→入库完整流程尚未实现。

**质量管理实操功能缺失**：IQC 来料检验、NCR 不合格品处理、CAPA 改进是医疗器械客户（德国瑞哈）的硬性合规要求，目前只有实体类定义。

**WMS 仓储实操缺失**：收货、上架、拣货、发货、盘点等基础仓储操作没有 UI 和业务逻辑，而这是日常操作频率最高的模块。

### 7.3 建议（功能补全路线图）

**Phase 1（1-2 个月）**：打通 MRP 数据链路 + 完善采购执行基础流程（申请→审批→下单）

**Phase 2（3-4 个月）**：实现 WMS 基础收发货 + 质量管理 IQC 流程（医疗合规必需）

**Phase 3（5-6 个月）**：三厂 RCCP 产能协同 + ERP 集成接口 + 性能优化

---

## 八、数据合理性评估（7.0 / 10）

### 8.1 优点

**Mock 数据业务贴合度高，具备真实感**

项目 Mock 数据完全基于豪江智能真实业务场景建模，展现出深度的业务研究：

- 供应商 Bühler Motor GmbH（德国）：OTD 从 91% 跌至 61%，具体描述"欧洲能源危机导致工厂开工率降至 71%"，真实还原了企业面临的断供危机。
- HJ-LA23 线性推杆圣诞旺季需求曲线（第 42-44 周峰值 13,800 件）与行业规律吻合，"累计缺口 24,000 件，影响 ¥2,180 万"的量化分析具有说服力。
- 三工厂产能利用率（青岛 112% 超负荷、苏州 78%、泰国 43% 爬坡）逻辑自洽，反映了企业国际化布局的真实阶段。

**数据库 Schema 设计规范**

MDM 主数据 Schema 采用 SAP 标准的物料类型分类（ROH/HALB/FERT）、BOM 层级约束（1-10 级）、双语名称字段、完整审计字段（created_by/created_time/updated_by/updated_time）、Status 枚举约束，设计质量达到企业级标准。

**核心 KPI 数据设置合理**

仪表盘 KPI 目标值（DIFOT 95%、OTD 92%、库存周转 8 次/年、按时交货 94%）与制造业行业基准值吻合，不是随意填写的数字。

### 8.2 问题

**数据一致性问题**

Mock 数据存在两套来源：`mock.data.ts`（面向演示）和 `mockAPI.ts`（面向开发），两套数据的供应商、物料命名不一致（mock.data.ts 用 SUP-DE-001/Bühler，mockAPI.ts 用 SUP-001/青岛电机），在演示时可能造成混乱。

**缺少真实历史数据的时间维度**

安全库存计算需要 90 天历史需求数据，但 Mock 数据中没有 `daily_demand` 历史记录表和数据，导致 `SafetyStockCalculator.calculateDemandStdDev()` 实际上会返回 0（历史为空），安全库存计算值将为 0，逻辑上不合理。

**财务数据维度缺失**

库存余额表中缺少成本字段（单位成本、移动加权平均价）、采购订单缺少付款条款字段。对于需要管控库存资金占用的供应链场景，这些是必要字段。

### 8.3 建议

1. 合并两套 Mock 数据为统一数据源，消除命名不一致。
2. 补充 `daily_demand_history` Mock 数据（至少 90 天），使安全库存和 ABC-XYZ 算法能运行出有意义的结果。
3. MDM 物料主数据表补充成本字段（`standard_cost`、`moving_avg_price`）。
4. 在 Demo 展示前，对全部 Mock 数据做一致性检查（供需匹配、时间逻辑、金额合理性）。

---

## 九、综合建议与优先级矩阵

### 紧急且重要（立即处理）

| 问题 | 原因 | 处理方式 |
|------|------|----------|
| JWT 安全漏洞 | 供应商门户无身份验证保护 | 引入 JJWT 库重写认证逻辑 |
| 数据库密码明文提交 | 仓库已公开，密钥可被任意获取 | 清理 Git 历史，改用环境变量 |
| 测试无法编译 | 缺少 Repository 接口定义 | 补充接口并实际运行测试 |

### 重要不紧急（1个月内处理）

| 问题 | 原因 |
|------|------|
| MRP 数据链路打通 | 核心业务价值无法体现 |
| 前端 Mock 数据对接真实 API | 演示到试用的关键跨越 |
| 补充核心业务数据库 Schema | 系统无法真正运行 |
| 统一 Mock 数据来源 | 演示一致性 |

### 重要长期项（3-6个月）

| 问题 | 原因 |
|------|------|
| WMS 仓储基础功能 | 高频日常操作模块 |
| 质量管理 IQC 合规流程 | 医疗器械客户硬性要求 |
| 三厂 RCCP 产能协同 | 企业核心多工厂管理诉求 |
| ERP 集成接口 | 系统孤岛问题的长远解决方案 |
| 性能测试与优化 | 生产环境上线前必须完成 |

---

## 十、总结

HJ_SCM 项目展示出相当扎实的工程基础和深入的业务研究，特别是在供应链指挥中心的可视化表现、供应商管理的业务建模深度、MRP 引擎的算法设计、以及完整的文档体系方面，达到了同阶段项目的较高水准。

然而，项目当前最突出的问题是**"表里不一"**：前端演示效果出色，但大量核心逻辑处于 TODO/Mock/占位符状态，安全基础设施存在严重漏洞，后端测试无法运行。系统目前更接近一个高质量的产品原型（Prototype），而非一个可以交付试运营的软件产品。

**建议下一阶段的核心目标：从"演示系统"升级为"可试运营系统"**，具体体现在：修复安全漏洞 → 打通 MRP 数据链路 → 补全数据库 Schema → 运行并通过所有单元测试 → 完成一次端到端的业务场景真实演练（从需求预测到 MRP 采购建议下达）。

---

*本报告基于 HJ_SCM-main 仓库代码及文档综合分析生成，评估时间 2026-02-19。*
