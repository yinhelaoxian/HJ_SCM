# Sprint Backlog - MVP 闭环开发计划 v1.1

**版本**: v1.1  
**日期**: 2026-02-14  
**目标**: 完成需求预测 → S&OP → MPS → MRP → 采购/库存 + Trace ID 追踪 MVP 闭环  

---

## Sprint 概览

| Sprint | 周期 | 目标 | 文档 |
|--------|------|------|------|
| Sprint 6 | 2 周 | MRP 引擎核心 + Trace ID | MRP_ENGINE_SPEC, TRACE_ID_SPEC |
| Sprint 7 | 2 周 | 库存模块 + ATP + MRP 联动 | INVENTORY_DETAILED, ATP_SPEC, INVENTORY_CHANGE_MRP_SPEC |
| Sprint 8 | 2 周 | 生产执行 + 前端 API | PRODUCTION_DETAILED_SPEC |
| Sprint 9 | 2 周 | 集成测试 + 性能优化 + MVP 发布 | CICD_SPEC |

---

## Sprint 6: MRP 引擎核心 + Trace ID ✅ 已完成

### Sprint Goal
实现 MRP 引擎核心逻辑，完成 Trace ID 全链路打通。

### Backlog

| ID | 任务 | 状态 | DoD |
|----|------|------|-----|
| S6-01 | BOM 数据模型与存储 | ✅ | BOM 表创建完成 |
| S6-02 | BOM 展开服务实现 | ✅ | 展开算法测试通过 |
| S6-03 | MRP 核心计算引擎 | ✅ | 毛/净需求计算正确 |
| S6-04 | 齐套检查服务 | ✅ | 齐套率计算准确 |
| S6-05 | Trace ID 生成服务 | ✅ | 单据关联正确生成 |
| S6-06 | Trace 追溯查询 API | ✅ | 正向/逆向追溯正常 |

---

## Sprint 7: 库存模块 + ATP + MRP 联动 ✅ 已完成

### Sprint Goal
实现 ATP 计算、库存变更与 MRP 联动。

### Backlog

| ID | 任务 | 状态 | 文档 | DoD |
|----|------|------|------|-----|
| S7-01 | ATP 计算服务 | ✅ | ATP_SPEC | ATP 计算正确 |
| S7-02 | 安全库存计算 | ✅ | INVENTORY_DETAILED | SS 公式正确 |
| S7-03 | ABC-XYZ 分类 | ✅ | INVENTORY_DETAILED | 分类占比正确 |
| S7-04 | 呆滞检测 | ✅ | INVENTORY_DETAILED | 风险评分准确 |
| S7-05 | 库存变更服务 | ✅ | INVENTORY_CHANGE_MRP_SPEC | 事件发布正确 |
| S7-06 | 库存变更触发 MRP | ✅ | INVENTORY_CHANGE_MRP_SPEC | 联动生效 |

---

## Sprint 8: 生产执行 + 前端 API ✅ 已完成

### Sprint Goal
实现生产工单管理、投料汇报、完工入库，与 MRP 和 Trace ID 联动。

### Backlog

| ID | 任务 | 状态 | 文档 | DoD |
|----|------|------|------|-----|
| S8-01 | 生产工单服务 | ✅ | PRODUCTION_DETAILED_SPEC | 工单全流程正常 |
| S8-02 | 投料管理 | ✅ | PRODUCTION_DETAILED_SPEC | 扫码交互正常 |
| S8-03 | 完工汇报 | ✅ | PRODUCTION_DETAILED_SPEC | 报工提交成功 |
| S8-04 | 批次追溯 | ✅ | PRODUCTION_DETAILED_SPEC | 追溯链路完整 |
| S8-05 | 前端 API Service | ✅ | - | 所有 API 调用走 service |
| S8-06 | 前端 Hooks | ✅ | - | Hooks 封装完成 |

---

## Sprint 9: 集成测试 + 性能优化 + MVP 发布

### Sprint Goal
完成全链路集成测试，性能达标，发布 MVP。

### Backlog

| ID | 任务 | 状态 | DoD |
|----|------|------|-----|
| S9-01 | 单元测试 | 待进行 | 测试覆盖率 > 80% |
| S9-02 | 集成测试 | 待进行 | 所有链路测试通过 |
| S9-03 | 性能测试 | 待进行 | 性能指标达标 |
| S9-04 | API 文档完善 | 待进行 | Swagger 完整 |
| S9-05 | 性能优化 | 待进行 | 指标达标 |
| S9-06 | MVP 发布 | 待进行 | PROD 部署成功 |

---

## 文档清单

| 文档 | 文件 | 状态 |
|------|------|------|
| MRP 引擎规范 | MRP_ENGINE_SPEC_v1.0.md | ✅ |
| Trace ID 规范 | TRACE_ID_SPECIFICATION_v1.1.md | ✅ |
| 库存模块设计 | INVENTORY_DETAILED_DESIGN_v1.1.md | ✅ |
| ATP 计算规范 | ATP_CALCULATOR_SPEC_v1.0.md | ✅ |
| 库存变更-MRP 联动 | INVENTORY_CHANGE_MRP_SPEC_v1.0.md | ✅ |
| 生产执行规范 | PRODUCTION_DETAILED_SPEC_v1.0.md | ✅ |
| 采购门户规范 | SUPPLIER_PORTAL_SPEC_v1.0.md | ✅ |
| 物流可视化规范 | LOGISTICS_VISUALIZATION_SPEC_v1.0.md | ✅ |
| 设计系统 | DESIGN_SYSTEM.md v2.1 | ✅ |
| CI/CD + 非功能需求 | CICD_NONFUNCTIONAL_SPEC_v1.0.md | ✅ |
| Sprint Backlog | SPRINT_BACKLOG_MVP_v1.1.md | ✅ |

---

## 验收检查清单

### 功能验收

- [ ] MRP 运算正确生成物料需求
- [ ] BOM 展开深度支持 3 级
- [ ] 齐套检查准确识别缺料
- [ ] Trace ID 追溯完整链路
- [ ] 安全库存动态计算
- [ ] ABC-XYZ 分类占比正确
- [ ] 呆滞检测无漏检
- [ ] ATP 计算与公式一致
- [ ] 库存变更触发 MRP
- [ ] 生产工单全流程正常
- [ ] 批次追溯完整
- [ ] 前端 API 100% 覆盖

### 性能验收

- [ ] MRP 全量运算 < 30s
- [ ] API P95 响应 < 500ms
- [ ] 页面加载 < 2s
- [ ] 图表渲染 < 1s
- [ ] 追溯查询 < 3s

### 测试验收

- [ ] 单元测试覆盖率 > 80%
- [ ] 集成测试全链路通过
- [ ] 性能测试达标
- [ ] 安全测试无高危

---

> **文档版本**: v1.1  
> **最后更新**: 2026-02-14  
> **状态**: 开发完成，待测试

---

## 📋 菜单结构规范 v2.0

> **最后更新**: 2026-02-15  
> **版本**: v2.0

### 设计原则

| 原则 | 说明 |
|------|------|
| **端到端流程** | 需求 → 计划 → 执行 → 监控 |
| **异常驱动** | 高风险区域可视化（徽章标记） |
| **场景适配** | 医养追溯嵌入生产/库存 |
| **认知负担** | 一级菜单 ≤ 11，子菜单折叠 |

### 菜单结构（11 个一级菜单）

```
需求管理 → S&OP → MPS → MRP → 采购 → 库存 → 生产 → 物流 → 绩效 → 异常
```

### 一级菜单清单

| 序号 | 菜单 | 子菜单 | 核心功能 |
|------|------|--------|----------|
| 1 | 供应链指挥中心 | - | 全局 KPI、异常聚合 |
| 2 | 需求管理 | AI 预测、需求感知、促销管理 | 需求输入端 |
| 3 | S&OP 产销协同 | 产销平衡、What-if、RCCP | 战略协同 |
| 4 | MPS 主生产计划 | 滚动计划、ATP 承诺 | 战术排程 |
| 5 | MRP 物料计划 | MRP 运算、齐套分析 | 执行分解 |
| 6 | 采购与供应商 | AI 采购建议、风险、门户 | 供应源 |
| 7 | 库存与仓储 | 安全库存、ABC-XYZ、呆滞 | 物流中心 |
| 8 | 订单履行与生产执行 | 排产、投料、完工 | 执行层 |
| 9 | 物流与运输管理 | 在途、发货、运费对账 | 交付 |
| 10 | 绩效与分析 | SCOR 看板、自助报表 | 反馈层 |
| 11 | 异常工作台 | 智能异常、预警规则 | 跨模块 |

### 子菜单详细说明

#### 3. S&OP 产销协同
- 产销平衡（时间序列、缺口分析）
- What-if 情景模拟（方案比选）
- 需求评审（版本管理、会议纪要）
- RCCP 产能规划（粗能力核查）

#### 4. MPS 主生产计划
- 13 周滚动计划（甘特图视图）
- ATP 承诺检查（客户订单承诺）

#### 5. MRP 物料计划
- 净需求计算（毛需求→净需求）
- 齐套分析（物料缺口、预计到货）
- 采购/生产建议（智能建议、历史对比）

#### 6. 采购与供应商
- AI 采购建议（智能建议、比选）
- 供应商风险（雷达图、传播链）
- 绩效评分（质量+交付+成本）
- 协同门户（ASN 确认、发货通知）

#### 7. 库存与仓储
- 库存总览（多维度、批次分布）
- 安全库存（策略配置、覆盖率）
- ABC-XYZ 分类（动态分类、矩阵）
- 呆滞预警（长库龄、减值建议）

#### 8. 生产执行
- 生产排产（工单列表、优先级）
- 投料管理（领料、批次追溯）
- 完工汇报（质检结果、入库确认）
- 订单追踪（生产进度、可视化）

#### 9. 物流运输
- 在途可视化（地图、ETA）
- 发货管理（ASN、装箱单）
- 运费对账（物流成本、差异）

#### 10. 绩效监控
- SCOR 看板（KPI 总览、趋势）
- 自助报表（多维分析、导出）
- 决策支持（AI 建议、方案比选）

### 页面嵌套设计

```
S&OP 产销平衡页面（/sop）
├── Tab1: 产销概览（时间序列、供需对比）
├── Tab2: What-if 模拟（方案比选）
├── Tab3: 需求评审（版本列表、会议记录）
└── Tab4: RCCP 产能（甘特图、瓶颈标识）

库存总览页面（/inventory）
├── Tab1: 库存分布（SKU+批次+库位）
├── Tab2: 安全库存（配置面板、覆盖率）
├── Tab3: ABC-XYZ（分类矩阵）
└── Tab4: 呆滞预警（长库龄、处置建议）
```

### 异常驱动设计

| 徽章 | 颜色 | 含义 |
|------|------|------|
| 🔴 红色 | E53935 | 紧急：逾期、缺口 > 10% |
| 🟡 黄色 | F57C00 | 关注：阈值预警 |
| 🟢 绿色 | 00897B | 正常 |
| 🔵 蓝色 | 2D7DD2 | 信息 |

### 菜单路径映射表

| 菜单路径 | 页面组件 | 核心功能 |
|----------|----------|----------|
| `/` | Dashboard | KPI 聚合、异常列表 |
| `/demand` | DemandForecast | 预测图表、因子分析 |
| `/demand-sense` | DemandSense | 信号识别、短期修正 |
| `/promotions` | Promotions | 促销日历、需求冲击 |
| `/sop` | SOP | 产销对比、缺口分析 |
| `/sop/whatif` | ScenarioSim | 情景模拟、方案比选 |
| `/sop/rccp` | RCCP | 产能利用率 |
| `/mps` | MPS | 13 周计划、甘特图 |
| `/mps/atp` | ATPCheck | ATP 计算、承诺 |
| `/mrp` | MRP | 净需求、建议订单 |
| `/kitting` | Kitting | 齐套分析、缺口 |
| `/procurement` | ProcurementAI | 智能建议、比选 |
| `/supplier/risk` | SupplierRisk | 风险雷达、传播 |
| `/supplier/score` | SupplierScore | 绩效评分、排名 |
| `/inventory` | InventoryWB | 库存分布、多维 |
| `/inventory/safety` | SafetyStock | 策略配置、计算 |
| `/inventory/abc` | ABCXYZ | 分类矩阵、动态 |
| `/inventory/stagnation` | Stagnation | 呆滞预警、处置 |
| `/production` | Production | 工单列表、状态 |
| `/logistics` | Logistics | 在途、ETA |
| `/logistics/freight` | Freight | 运费、对账 |
| `/kpi` | SCOR | KPI 看板、趋势 |
| `/exceptions` | Exceptions | 异常列表、处理 |

### 交互规范

```
快捷操作：
- 指挥中心"一键穿透"：点击 KPI → 跳转对应模块
- S&OP 页面内切换：Tab 切换，无页面刷新
- 批量操作：勾选 → 批量确认/下达

搜索：
- 全局搜索（Ctrl+K）：支持功能、SKU、订单号
- 智能补全：输入 → 推荐相关结果

面包屑：
/ S&OP / 产销平衡 / What-if 模拟
```

### 权限配置示例

```typescript
const MENU_PERMISSIONS = {
  '/demand': ['PLANNER', 'MANAGER'],
  '/procurement': ['BUYER', 'MANAGER'],
  '/supplier/risk': ['MANAGER', 'ADMIN'],
  '/admin': ['ADMIN'],
};
```

