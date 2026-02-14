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
