# 产品设计文档 PRD v3.0

**版本**: v3.0  
**日期**: 2026-02-15  
**状态**: 基于评估报告重构  
**目标**: 从"演示原型"升级为"可运营系统"

---

## 一、产品愿景与目标

### 1.1 产品愿景

> 打造支撑豪江智能供应链管理的核心系统，实现从"需求预测"到"订单交付"的全链路数字化，覆盖青岛/苏州/泰国三工厂协同，满足医疗器械（瑞哈）和家具（IKEA）双客户场景的合规要求。

### 1.2 产品目标

| 目标 | 指标 | 时间节点 |
|------|------|----------|
| 端到端流程闭环 | 需求→计划→采购→生产→交付全链路 | 6 个月 |
| 数据准确率 | 主数据准确率 ≥ 99% | 3 个月 |
| 运营效率 | 订单履约周期缩短 20% | 6 个月 |
| 合规达标 | 医疗器械质量追溯 100% | 3 个月 |

### 1.3 目标用户

| 用户角色 | 场景 | 关键需求 |
|----------|------|----------|
| 供应链经理 | S&OP 会议、产能规划 | 决策支持、预测准确 |
| 计划员 | MPS/MRP 运算 | 计划准确、执行追踪 |
| 采购员 | 供应商管理、下单 | 供应商绩效、建议执行 |
| 仓管员 | 收货、上架、发货 | 作业指引、库存准确 |
| 质检员 | IQC/OQC 检验 | 检验流程、合规记录 |
| 生产主管 | 工单执行、完工汇报 | 工序追踪、在制品可见 |

---

## 二、产品范围

### 2.1 包含范围

| 模块 | 功能 | 优先级 |
|------|------|--------|
| 主数据管理 | 物料主数据、BOM管理、工艺路线、供应商/客户档案 | P0 |
| 需求管理 | AI需求预测、需求版本、促销管理、需求感知 | P1 |
| S&OP | 产销平衡、What-if模拟、需求评审、RCCP产能 | P1 |
| MPS | 13周滚动计划、甘特图、ATP承诺、Time Fences | P1 |
| MRP | 净需求计算、采购建议、工单建议、齐套分析 | P0 |
| 采购执行 | 采购订单、收货确认、发票核销、供应商门户 | P1 |
| 质量管理 | IQC来料检验、OQC出货检验、NCR/CAPA | P0 |
| WMS | 收货、上架、库位、拣货、发货、盘点 | P0 |
| 生产执行 | 生产订单、工序管理、投料记录、完工汇报 | P1 |
| 物流交付 | 在途可视、发货管理、运费对账 | P2 |
| 绩效分析 | SCOR看板、价值金字塔、决策支持 | P2 |
| 逆向物流 | RMA退货、退供处理、返修管理 | P2 |
| 系统集成 | ERP接口、EDI集成、条码/RFID | P1 |

### 2.2 不包含范围（v3.0）

- 财务模块（与ERP集成）
- 人力资源模块
- 设备管理模块
- 高级排程（APS）

---

## 三、产品架构

### 3.1 系统架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                          前端层 (React + TypeScript)                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ Web UI  │ │ 移动端  │ │ 大屏   │ │ 小程序  │ │ API网关 │    │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│                          后端层 (Spring Boot)                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ API服务  │ │ MRP引擎 │ │ 状态机  │ │ 事件驱动│ │ 定时任务│    │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│                          数据层                                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │PostgreSQL│ │Redis   │ │ 文件存储│ │消息队列 │ │搜索引擎 │    │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│                          外部集成                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │  ERP    │ │  MES    │ │  EDI    │ │条码/RFID│ │ 地图API │    │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 菜单结构 v3.0

```
1. 指挥中心
   └── 全局KPI、异常聚合、快速穿透

2. 主数据管理（新增）
   ├── 物料主数据
   ├── BOM管理
   ├── 工艺路线
   ├── 供应商档案
   └── 客户档案

3. 需求管理
   ├── AI需求预测
   ├── 需求版本
   ├── 促销管理
   └── 需求感知

4. S&OP产销协同
   ├── 产销平衡
   ├── What-if模拟
   ├── 需求评审
   └── RCCP产能

5. MPS主生产计划
   ├── 13周滚动计划
   ├── 甘特图视图
   ├── Time Fences
   └── ATP承诺检查

6. MRP物料计划
   ├── MRP运算
   ├── 齐套分析
   └── 采购/生产建议

7. 采购执行（强化）
   ├── 采购订单
   ├── 收货确认
   ├── 发票核销
   └── 供应商门户

8. 质量管理（新增）
   ├── IQC来料检验
   ├── OQC出货检验
   ├── NCR处理
   └── CAPA管理

9. WMS仓库（新增）
   ├── 收货作业
   ├── 上架管理
   ├── 库位管理
   ├── 拣货发货
   └── 盘点管理

10. 生产执行（强化）
    ├── 生产订单
    ├── 工序管理
    ├── 投料记录
    └── 完工汇报

11. 物流交付
    ├── 在途可视
    ├── 发货管理
    └── 运费对账

12. 逆向物流（新增）
    ├── RMA退货
    ├── 退供处理
    └── 返修管理

13. 绩效分析
    ├── SCOR看板
    ├── 价值金字塔
    └── 自助报表

14. 系统集成（新增）
    ├── ERP接口
    ├── EDI配置
    ├── 数据同步
    └── 条码管理

15. 异常工作台
    ├── 智能异常
    └── 预警规则
```

---

## 四、核心功能详细设计

### 4.1 主数据管理（MDM）

#### 4.1.1 物料主数据

```typescript
interface MaterialMaster {
  // 基础信息
  materialId: string;           // 物料编码（自动生成）
  materialName: string;        // 物料名称
  materialNameEn?: string;     // 英文名称
  materialGroup: string;       // 物料组
  materialType: 'ROH' | 'HALB' | 'FERT';  // 原材料/半成品/成品
  baseUnit: string;            // 基本计量单位
  
  // 采购信息
  defaultSupplier: string;      // 默认供应商
  procurementType: 'F' | 'K';  // 采购类型
  mqo: number;               // 最小订单量
  leadTime: number;          // 采购提前期(天)
  priceRange: [number, number]; // 价格区间
  
  // 库存信息
  storageLocation: string;     // 默认存储地点
  abcClass: 'A' | 'B' | 'C'; // ABC分类
  xyzClass: 'X' | 'Y' | 'Z'; // XYZ分类
  safetyStock: number;        // 安全库存
  reorderPoint: number;       // 再订货点
  
  // 生产信息
  bomId?: string;            // 关联BOM
  routingId?: string;         // 关联工艺路线
  productionBatch: number;    // 生产批量
  scrapRate: number;          // 损耗率
  
  // 质量信息
  inspectionType: '01' | '02' | '03';  // 检验类型
  shelfLife: number;         // 保质期(天)
  isSerialNumber: boolean;    // 是否序列号管理
  isBatchManage: boolean;     // 是否批次管理
}
```

#### 4.1.2 BOM管理

```typescript
interface BOM {
  bomId: string;
  bomName: string;
  material: string;           // 父级物料
  bomUsage: number;          // 用量
  bomUnit: string;           // 单位
  bomLevel: number;          // BOM层级
  validityStart: Date;
  validityEnd?: Date;
  alternativeGroup?: string;  // 替代组
  components: BOMComponent[];
}

interface BOMComponent {
  componentMaterial: string;  // 子件物料
  componentQty: number;      // 用量
  operationId: string;       // 工序号
  workCenter?: string;      // 工作中心
  scrapAddRate: number;     // 损耗率
  isPhantom: boolean;        // 虚拟件标识
  isSubcontract: boolean;   // 外协件标识
}
```

### 4.2 质量管理（QM）

#### 4.2.1 IQC来料检验

```typescript
interface IQCInspection {
  inspectionId: string;
  purchaseOrder: string;      // 采购订单
  deliveryNote: string;      // 送货单号
  supplier: string;
  material: string;
  batchNo: string;           // 批次号
  quantity: number;           // 到货数量
  
  // 检验信息
  inspectionDate: Date;
  inspector: string;
  inspectionType: string;    // 抽检/全检
  samplingPlan: string;      // 抽样方案
  
  // 检验项目
  items: InspectionItem[];
  
  // 检验结果
  overallResult: 'PASS' | 'FAIL' | 'HOLD';
  passQty: number;           // 合格数量
  failQty: number;          // 不合格数量
  holdQty: number;          // 待处理数量
  
  // 不合格品处理
  ncrId?: string;          // NCR单号
  
  // 附件
  attachments: Attachment[];
}

interface InspectionItem {
  itemId: string;
  itemName: string;         // 检验项目
  standard: string;         // 检验标准
  ucl?: number;             // 上控制限
  lcl?: number;             // 下控制限
  actualValue?: number;      // 实际值
  result: 'OK' | 'NG';
}
```

#### 4.2.2 NCR处理

```typescript
interface NCR {
  ncrId: string;
  source: 'IQC' | 'OQC' | 'IPQC' | 'CUSTOMER';
  material: string;
  batchNo: string;
  quantity: number;
  
  // 问题描述
  problemType: string;       // 问题类型
  problemDesc: string;      // 问题描述
  severity: 'MAJOR' | 'MINOR' | 'CRITICAL';
  
  // 处置决定
  disposition: 'RETURN' | 'REWORK' | 'SCRAP' | 'ACCEPT';
  dispositionDesc: string;
  
  // 根本原因分析
  rootCause: string;
  rootCauseCategory: 'MAN' | 'MACHINE' | 'MATERIAL' | 'METHOD' | 'ENVIRONMENT';
  
  // CAPA关联
  capaId?: string;
  
  // 关闭信息
  closeDate?: Date;
  closedBy?: string;
}
```

### 4.3 WMS仓库作业

#### 4.3.1 收货作业

```typescript
interface GoodsReceipt {
  grId: string;
  poNumber: string;
  supplier: string;
  expectedDate: Date;
  actualDate?: Date;
  
  // 收货状态
  status: 'CREATED' | 'RECEIVING' | 'CHECKED' | 'PUTAWAY' | 'COMPLETED';
  
  // 收货明细
  items: GRItem[];
  
  // 质检关联
  inspectionId?: string;
  
  // 上架关联
  putawayId?: string;
}

interface GRItem {
  material: string;
  expectedQty: number;
  actualQty: number;
  unit: string;
  batchNo: string;
  inspectionStatus: 'PENDING' | 'PASSED' | 'FAILED' | 'WAIVED';
  storageBin?: string;       // 目标库位
}
```

#### 4.3.2 库存管理

```typescript
interface Inventory {
  material: string;
  storageLocation: string;    // 工厂/仓库
  storageBin: string;        // 库位
  batchNo: string;
  quantity: number;
  unit: string;
  
  // 状态
  qualityStatus: 'FREE' | 'BLOCKED' | 'QUARANTINE';
  stockType: 'UNRESTRICTED' | 'IN_TRANSIT' | 'QUALITY';
  
  // 序列号（可选）
  serialNo?: string;
  
  // 日期
  createdDate: Date;
  lastMoveDate: Date;
  expiryDate?: Date;
  
  // 成本
  unitCost: number;
  totalValue: number;
}
```

### 4.4 生产执行

#### 4.4.1 生产订单

```typescript
interface ProductionOrder {
  poId: string;
  orderNo: string;          // 生产订单号
  material: string;          // 产品
  quantity: number;           // 计划数量
  unit: string;
  
  // 关联
  salesOrder?: string;       // 销售订单（面向订单生产）
  bomId: string;            // BOM
  routingId: string;         // 工艺路线
  
  // 状态
  status: 'CREATED' | 'RELEASED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED' | 'CANCELLED';
  
  // 日期
  plannedStart: Date;
  plannedEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  
  // 工序
  operations: POOperation[];
}

interface POOperation {
  operationId: string;
  operationNo: number;       // 工序号
  operationName: string;
  workCenter: string;
  
  // 计划
  plannedStart: Date;
  plannedEnd: Date;
  plannedQty: number;
  
  // 实际
  actualStart?: Date;
  actualEnd?: Date;
  completedQty?: number;
  scrapQty?: number;
  
  // 状态
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}
```

---

## 五、数据模型

### 5.1 核心实体关系

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Material   │───────│     BOM     │───────│  Component  │
│  (物料主数据) │ 1   N│   (BOM)     │ 1   N│  (BOM子件)  │
└─────────────┘       └─────────────┘       └─────────────┘
      │                    │
      │                    │
      ▼                    ▼
┌─────────────┐       ┌─────────────┐
│   Inventory │       │    PO       │
│   (库存)    │       │ (生产订单)  │
└─────────────┘       └─────────────┘
                              │
                              ▼
                       ┌─────────────┐
                       │  Operation  │
                       │   (工序)    │
                       └─────────────┘
```

### 5.2 数据库表设计

| 表名 | 说明 | 关键字段 |
|------|------|----------|
| mm_material | 物料主数据 | material_id, material_name, material_group |
| mm_bom | BOM主表 | bom_id, material_id, bom_level |
| mm_bom_item | BOM明细 | bom_id, component_material, quantity |
| mm_routing | 工艺路线 | routing_id, material_id |
| mm_routing_op | 工序 | routing_id, operation_no, work_center |
| mm_supplier | 供应商 | supplier_id, supplier_name, rating |
| mm_customer | 客户 | customer_id, customer_name, type |
| qm_iqc_header | IQC检验 | inspection_id, po_number, supplier |
| qm_iqc_item | IQC明细 | inspection_id, item_name, result |
| qm_ncr | NCR处理 | ncr_id, material, disposition |
| wm_gr_header | 收货单 | gr_id, po_number, status |
| wm_gr_item | 收货明细 | gr_id, material, quantity, batch |
| wm_inventory | 库存 | material, storage_bin, batch, quantity |
| wm_picking | 拣货单 | picking_id, order_no, status |
| wm_physical_inv | 盘点单 | pi_id, storage_loc, status |
| pr_production_order | 生产订单 | po_id, material, quantity, status |
| pr_po_operation | 工序明细 | po_id, operation_no, status |

---

## 六、用户体验设计

### 6.1 设计原则

1. **任务导向**：用户能快速完成工作任务
2. **异常处理**：突出显示异常，引导用户处理
3. **操作确认**：关键操作二次确认，防止误操作
4. **移动适配**：仓库场景支持移动端操作

### 6.2 关键页面流程

#### 6.2.1 收货作业流程

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ 扫描PO   │───→│ 核对物料 │───→│ IQC检验  │───→│ 上架入库 │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     ↓               ↓               ↓               ↓
  选择/扫描       系统校验        检验结果        分配库位
```

#### 6.2.2 IQC检验流程

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ 创建检验 │───→│ 录入数据 │───→│ 判定结果 │───→│ NCR处理  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     ↓               ↓               ↓               ↓
  选择收货单       逐项检验        PASS/FAIL       不合格品
```

---

## 七、集成设计

### 7.1 ERP集成

| 方向 | 实体 | 频率 | 方式 |
|------|------|------|------|
| ERP→SCM | 销售订单 | 实时 | API |
| ERP→SCM | 物料主数据 | 定时 | ETL |
| ERP→SCM | 库存 | 实时 | API |
| SCM→ERP | 收货确认 | 实时 | API |
| SCM→ERP | 完工汇报 | 实时 | API |
| SCM→ERP | 库存移动 | 实时 | API |

### 7.2 EDI集成

| 伙伴 | 报文类型 | 方向 | 描述 |
|------|----------|------|------|
| IKEA | ORDERS | IN | 采购订单 |
| IKEA | DESADV | OUT | 发货通知 |
| IKEA | INVOIC | OUT | 发票 |

---

## 八、实施计划

### 8.1 Sprint规划

| Sprint | 周期 | 目标 | 交付物 |
|--------|------|------|--------|
| Sprint 1 | 2周 | 主数据基础 | 物料/BOM/供应商管理 |
| Sprint 2 | 2周 | 质量管理基础 | IQC/OQC/NCR流程 |
| Sprint 3 | 2周 | WMS收货上架 | 收货/上架作业 |
| Sprint 4 | 2周 | WMS发货盘点 | 拣货/发货/盘点 |
| Sprint 5 | 2周 | 生产执行 | 工单/投料/完工 |
| Sprint 6 | 2周 | ERP集成 | 数据同步接口 |
| Sprint 7 | 2周 | 逆向物流 | RMA/退供处理 |
| Sprint 8 | 2周 | 优化测试 | 性能优化/UAT |

### 8.2 验收标准

| 模块 | 验收标准 |
|------|----------|
| 主数据 | 100+物料，10+供应商，有BOM |
| 质量管理 | IQC/OQC可录入，NCR可处理 |
| WMS | 收货/上架/发货/盘点可用 |
| 生产 | 工单可流转，投料/完工可记录 |
| ERP | 关键数据自动同步 |
| 逆向物流 | RMA流程可用 |

---

## 九、风险与应对

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| ERP接口复杂 | 高 | 高 | 分阶段，先核心数据 |
| 数据质量差 | 高 | 中 | 数据清洗/校验 |
| 用户适应慢 | 中 | 中 | 培训/引导 |
| 性能瓶颈 | 中 | 高 | 预测试/监控 |

---

## 十、度量指标

### 10.1 产品成功指标

| 指标 | 目标 | 测量方式 |
|------|------|----------|
| 主数据准确率 | ≥99% | 抽样核对 |
| IQC及时率 | ≥95% | 检验单统计 |
| 库存准确率 | ≥99% | 盘点差异 |
| 订单履约率 | ≥95% | OTIF统计 |
| 用户满意度 | ≥4.0 | 用户调研 |

### 10.2 运营指标

| 指标 | 目标 | 测量方式 |
|------|------|----------|
| 系统可用率 | ≥99.5% | 监控统计 |
| 响应时间P95 | ≤2s | APM监控 |
| 故障恢复时间 | ≤4h | 运维记录 |

---

**文档版本**: v3.0  
**最后更新**: 2026-02-15  
**负责人**: OpenCLAW  
**状态**: 待评审

**历史版本**:
- v2.0: 2026-02-14 - ISC框架整合
- v1.0: 2026-02-13 - 初始版本
