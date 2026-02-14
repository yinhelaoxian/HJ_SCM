# 全链路 Trace ID 规范 v1.1

**文档版本**: v1.1  
**状态**: Draft  
**生效日期**: 2026-02-14  
**适用范围**: HJ_SCM 平台全部业务单据  

---

## 1. 概述

### 1.1 Trace ID 定义

Trace ID（追溯标识）是 HJ_SCM 平台用于实现全链路业务追溯的唯一标识符。每个业务单据在创建时自动生成，且与上下游单据形成父子关联关系。

### 1.2 核心价值

| 价值点 | 说明 |
|--------|------|
| **全链路追溯** | 从任意单据可追溯上下游所有关联单据 |
| **变更影响分析** | 需求变更时自动识别受影响的全部单据 |
| **审计合规** | 满足医养产品批次追溯法规要求 |
| **问题定位** | 快速定位异常根因与影响范围 |

### 1.3 设计原则

| 原则 | 说明 |
|------|------|
| Single Source of Truth | Trace ID 为唯一追溯源，不依赖业务单据状态 |
| Exception-Driven | 仅在变更时触发影响分析，非全量扫描 |
| Immutable | Trace ID 生成后不可修改，仅新增关联关系 |
| Queryable | 支持多维度快速查询（正向/反向/全链路） |

---

## 2. Trace ID 数据结构

### 2.1 核心字段

```typescript
interface TraceId {
  // === 核心标识 ===
  trace_id: string;              // UUID v4，全局唯一
  root_trace_id: string;         // 根节点 Trace ID（SO 订单）
  
  // === 单据信息 ===
  document_type: DocumentType;   // 单据类型枚举
  document_id: string;           // 单据业务编号
  document_version: number;       // 单据版本号（支持多版本）
  
  // === 关联关系 ===
  parent_trace_id: string | null; // 父单据 Trace ID
  parent_doc_id: string | null;   // 父单据业务编号
  child_trace_ids: string[];      // 子单据 Trace ID 列表
  
  // === 血缘类型 ===
  relation_type: RelationType;   // 关联类型枚举
  relation_detail: string;        // 关联细节（如：需求来源、生效原因）
  
  // === 业务上下文 ===
  plant_code: string;           // 工厂编码
  material_code: string;         // 物料编码（追溯核心）
  batch_no: string | null;       // 批次号（医养追溯关键）
  
  // === 审计字段 ===
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
}
```

### 2.2 枚举定义

```typescript
enum DocumentType {
  // === 计划层 ===
  FP  = 'FP',   // 预测订单 (Forecast)
  SO  = 'SO',   // 销售订单 (Sales Order)
  
  // === 计划层 ===
  MPS = 'MPS',  // 主生产计划
  MRP = 'MRP',  // 物料需求计划
  MO  = 'MO',   // 生产工单 (Manufacturing Order)
  
  // === 采购层 ===
  PR  = 'PR',   // 采购申请
  PO  = 'PO',   // 采购订单
  GR  = 'GR',   // 收货单 (Goods Receipt)
  
  // === 库存层 ===
  ST  = 'ST',   // 库存交易
  TR  = 'TR',   // 调拨单 (Transfer)
  
  // === 销售层 ===
  DN  = 'DN',   // 交货单 (Delivery Note)
  IV  = 'IV',   // 发票 (Invoice)
  
  // === 追溯专用 ===
  BT  = 'BT',   // 批次追溯 (Batch Trace)
  SN  = 'SN',   // 序列号追溯 (Serial Number)
}

enum RelationType {
  ROOT           = 'ROOT',           // 根节点（销售订单）
  DERIVED_FROM   = 'DERIVED_FROM',   // 衍生自（MRP 衍生自 MPS）
  TRIGGERED_BY   = 'TRIGGERED_BY',   // 触发（GR 触发自 PO）
  SPLITTED_FROM  = 'SPLITTED_FROM', // 拆分（子工单拆分自工单）
  CONSUMED_BY    = 'CONSUMED_BY',    // 消耗（物料被 MO 消耗）
  PRODUCED_BY    = 'PRODUCED_BY',   // 生产（成品由 MO 生产）
  REPLACED_BY    = 'REPLACED_BY',   // 替换（旧版本被新版本替换）
}
```

---

## 3. Trace ID 生成规则

### 3.1 生成算法

```java
/**
 * Trace ID 生成服务
 */
@Service
public class TraceIdGenerator {
    
    /**
     * 生成 Trace ID
     * @param request 生成请求
     * @return Trace ID 实体
     */
    public TraceId generate(TraceIdGenerateRequest request) {
        
        // 1. 生成 UUID
        String traceId = UUID.randomUUID().toString();
        
        // 2. 确定根节点
        String rootTraceId = request.getParentTraceId() != null
            ? getRootTraceId(request.getParentTraceId())
            : traceId;
        
        // 3. 确定关联类型
        RelationType relationType = determineRelationType(request);
        
        // 4. 构建实体
        TraceId traceIdEntity = TraceId.builder()
            .traceId(traceId)
            .rootTraceId(rootTraceId)
            .documentType(request.getDocumentType())
            .documentId(request.getDocumentId())
            .documentVersion(1)
            .parentTraceId(request.getParentTraceId())
            .parentDocId(request.getParentDocId())
            .childTraceIds(new ArrayList<>())
            .relationType(relationType)
            .relationDetail(request.getRelationDetail())
            .plantCode(request.getPlantCode())
            .materialCode(request.getMaterialCode())
            .batchNo(request.getBatchNo())
            .createdAt(LocalDateTime.now())
            .createdBy(SecurityContextHolder.getCurrentUser())
            .build();
        
        // 5. 更新父节点（添加子关联）
        if (request.getParentTraceId() != null) {
            updateParentChildRelation(request.getParentTraceId(), traceId);
        }
        
        // 6. 保存
        return traceIdRepository.save(traceIdEntity);
    }
    
    /**
     * 版本更新时生成新 Trace ID
     */
    public TraceId generateVersion(String originalTraceId) {
        TraceId original = traceIdRepository.findById(originalTraceId)
            .orElseThrow(() -> new NotFoundException("Original trace not found"));
        
        // 创建新版本
        TraceId newVersion = TraceId.builder()
            .traceId(UUID.randomUUID().toString())
            .rootTraceId(original.getRootTraceId())
            .documentType(original.getDocumentType())
            .documentId(original.getDocumentId())
            .documentVersion(original.getDocumentVersion() + 1)
            .parentTraceId(original.getParentTraceId())
            .relationType(RelationType.REPLACED_BY)
            .relationDetail("版本更新 v" + original.getDocumentVersion() + " → v" 
                + (original.getDocumentVersion() + 1))
            // ... 其他字段
            .build();
        
        // 标记原版本为被替换
        original.setRelationType(RelationType.REPLACED_BY);
        original.setChildTraceIds(List.of(newVersion.getTraceId()));
        
        traceIdRepository.save(original);
        return traceIdRepository.save(newVersion);
    }
}
```

### 3.2 批量生成（性能优化）

```java
@Service
public class TraceIdBatchGenerator {
    
    /**
     * 批量生成 Trace ID（用于 MRP 展开）
     * @param items 待生成项
     * @return 生成的 Trace ID 列表
     */
    @Transactional
    public List<TraceId> batchGenerate(List<TraceIdGenerateRequest> items) {
        List<TraceId> result = new ArrayList<>();
        
        // 1. 批量查询父节点
        Set<String> parentTraceIds = items.stream()
            .filter(i -> i.getParentTraceId() != null)
            .map(TraceIdGenerateRequest::getParentTraceId)
            .collect(Collectors.toSet());
        
        Map<String, TraceId> parentMap = traceIdRepository
            .findAllById(parentTraceIds)
            .stream()
            .collect(Collectors.toMap(TraceId::getTraceId, t -> t));
        
        // 2. 批量构建
        for (TraceIdGenerateRequest item : items) {
            TraceId traceId = buildTraceId(item, parentMap.get(item.getParentTraceId()));
            result.add(traceId);
        }
        
        // 3. 批量更新父节点子列表
        updateParentChildRelations(result);
        
        // 4. 批量保存
        return traceIdRepository.saveAll(result);
    }
}
```

---

## 4. 全链路追溯示例

### 4.1 完整业务链路图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           完整业务链路示例                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   【销售订单】                                                                │
│   Trace: c0a8f1d2-0001-4abc-9def-0123456789ab                              │
│   SO-2026-001  │  客户：A医院  │ 物料：HJ-LA23  │ 数量：100  │ 批次：BATCH-001│
│        │                                                                    │
│        │ TRIGGERED_BY                                                       │
│        ▼                                                                    │
│   【生产工单】                                                                │
│   Trace: c0a8f1d2-0002-4abc-9def-0123456789ab                              │
│   MO-2026-001  │  工厂：青岛A  │ 物料：HJ-LA23  │ 数量：100  │               │
│        │                                                                    │
│        │ CONSUMED_BY                                                        │
│        ├───┬─────────────────────────────────────────────┐                  │
│        │   │                                                             │
│        ▼   ▼                                                             │
│   ┌───────────────┐  ┌───────────────┐                                    │
│   │ 采购订单 PO   │  │ 领料记录 ST   │                                    │
│   │ PO-2026-001  │  │ ST-2026-001   │                                    │
│   │ 物料：HJ-M05 │  │ 物料：HJ-LA23 │                                    │
│   │ 供应商：Buhler│  │ 批次：BATCH-002│                                    │
│   │ 数量：100    │  │ 数量：100     │                                    │
│   └───────┬───────┘  └───────┬───────┘                                    │
│           │                  │                                             │
│           │ TRIGGERED_BY      │ CONSUMED_BY                                 │
│           ▼                  │                                             │
│   ┌───────────────┐          │                                             │
│   │ 收货单 GR     │          │                                             │
│   │ GR-2026-001  │          │                                             │
│   │ 批次：BATCH-002│ ◀───────┘                                             │
│   │ 数量：100     │                                                         │
│   └───────┬───────┘                                                         │
│           │ PRODUCED_BY                                                      │
│           ▼                                                                 │
│   ┌───────────────┐                                                         │
│   │ 生产入库 ST   │                                                         │
│   │ ST-2026-002  │                                                         │
│   │ 批次：BATCH-001│ ◀──────┐                                              │
│   │ 数量：100     │        │                                               │
│   └───────┬───────┘        │                                               │
│           │ CONSUMED_BY     │ (逆向追溯)                                     │
│           ▼                │                                               │
│   ┌───────────────┐        │                                               │
│   │ 交货单 DN     │        │                                               │
│   │ DN-2026-001  │        │                                               │
│   │ 客户：A医院   │        │                                               │
│   └───────────────┘        │                                               │
│                              │                                               │
└──────────────────────────────┼───────────────────────────────────────────────┘
                               │
                               ▼
                    【批次追溯查询】
                    输入：BATCH-001
                    输出：SO→MO→GR→DN 完整链路
```

### 4.2 医养追溯场景（批次+序列号）

```java
/**
 * 医养追溯查询示例
 */
public class MedicalTraceQueryExample {
    
    /**
     * 正向追溯：原材料 → 成品 → 客户
     */
    public List<TraceNode> forwardTrace(String batchNo) {
        // 1. 查找该批次的所有生产入库记录
        List<TraceId> stockIns = traceIdRepository
            .findByMaterialCodeAndBatchNo("HJ-LA23", batchNo)
            .stream()
            .filter(t -> "ST".equals(t.getDocumentType()))
            .filter(t -> "PRODUCED_BY".equals(t.getRelationType()))
            .collect(Collectors.toList());
        
        // 2. 向上追溯到客户
        List<TraceNode> result = new ArrayList<>();
        for (TraceId stockIn : stockIns) {
            result.add(buildNode(stockIn));
            result.addAll(traceUp(stockIn.getTraceId()));
        }
        
        return result;
    }
    
    /**
     * 逆向追溯：客户 → 原材料
     */
    public List<TraceNode> backwardTrace(String deliveryNoteNo) {
        // 1. 查找交货单
        TraceId dn = traceIdRepository
            .findByDocumentIdAndDocumentType(deliveryNoteNo, DocumentType.DN)
            .orElseThrow(() -> new NotFoundException("Delivery not found"));
        
        // 2. 向下追溯到原材料批次
        return traceDown(dn.getTraceId());
    }
    
    /**
     * 变更影响分析：需求变更 → 影响范围识别
     */
    public ChangeImpactAnalysis analyzeChangeImpact(
            String salesOrderNo, BigDecimal newQty) {
        
        // 1. 查找原始订单
        TraceId so = traceIdRepository
            .findByDocumentIdAndDocumentType(salesOrderNo, DocumentType.SO)
            .orElseThrow(() -> new NotFoundException("Sales order not found"));
        
        // 2. 查找所有下游关联
        List<TraceId> downstream = findAllDownstream(so.getRootTraceId());
        
        // 3. 分析影响
        ChangeImpactAnalysis analysis = new ChangeImpactAnalysis();
        analysis.setOriginalOrder(so);
        analysis.setNewQuantity(newQty);
        
        // 3.1 计算数量变化
        BigDecimal qtyChange = newQty.subtract(so.getQuantity());
        analysis.setQuantityChange(qtyChange);
        
        // 3.2 识别受影响的采购订单
        List<TraceId> affectedPOs = downstream.stream()
            .filter(t -> "PO".equals(t.getDocumentType()))
            .filter(t -> qtyChange.compareTo(BigDecimal.ZERO) != 0)
            .collect(Collectors.toList());
        analysis.setAffectedPurchaseOrders(affectedPOs);
        
        // 3.3 识别受影响的工单
        List<TraceId> affectedMOs = downstream.stream()
            .t -> "MO".equals(t.getDocumentType()))
            .filter(t -> qtyChange.compareTo(BigDecimal.ZERO) != 0)
            .collect(Collectors.toList());
        analysis.setAffectedManufacturingOrders(affectedMOs);
        
        // 3.4 识别受影响的库存
        List<TraceId> affectedStock = downstream.stream()
            .filter(t -> "ST".equals(t.getDocumentType()))
            .collect(Collectors.toList());
        analysis.setAffectedStock(affectedStock);
        
        return analysis;
    }
}
```

### 4.3 变更影响分析流程

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        变更影响分析流程图                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐                                                             │
│  │ 需求变更    │                                                             │
│  │ (订单/预测) │                                                             │
│  └──────┬──────┘                                                             │
│         │                                                                     │
│         ▼                                                                     │
│  ┌─────────────┐    ┌───────────────────────────────────────────────┐       │
│  │ 触发影响分析 │───▶│ 1. 查找根订单的完整下游链路                       │       │
│  └──────┬──────┘    │    (MPS → MRP → MO → PO → GR → ST → DN)        │       │
│         │            └───────────────────┬───────────────────────────────┘       │
│         │                                │                                   │
│         ▼                                ▼                                   │
│  ┌─────────────┐            ┌───────────────────────────────────────────┐   │
│  │ 生成影响报告 │◀───────────│ 2. 对比变更前后数量差异                     │   │
│  └─────────────┘            │    - 采购订单调整量                          │   │
│         │                   │    - 工单调整量                              │   │
│         │                   │    - 库存影响                               │   │
│         ▼                   └───────────────────┬───────────────────────────┘   │
│  ┌─────────────┐                           │                               │
│  │ 执行调整操作 │                           ▼                               │
│  └──────┬──────┘            ┌───────────────────────────────────────────┐   │
│         │                   │ 3. 识别需人工确认的变更                       │   │
│         ▼                   │    - 超过阈值的变更（>10%）                   │   │
│  ┌─────────────┐           │    - 已执行的订单不可取消                     │   │
│  │ 发送通知    │           │    - 供应商交期冲突                           │   │
│  └─────────────┘           └───────────────────┬───────────────────────────┘   │
│                                                │                               │
│                                                ▼                               │
│                                    ┌───────────────────────────────────────┐   │
│                                    │ 4. 生成调整建议                        │   │
│                                    │    - 建议取消订单                      │   │
│                                    │    - 建议调整数量                      │   │
│                                    │    - 建议提前/推迟                     │   │
│                                    └───────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.4 追溯查询 API

```java
/**
 * 追溯查询接口
 */
public interface TraceQueryService {
    
    /**
     * 正向追溯（来源追踪）
     */
    List<TraceNode> traceUp(String traceId);
    
    /**
     * 反向追溯（影响追踪）
     */
    List<TraceNode> traceDown(String traceId);
    
    /**
     * 全链路追溯
     */
    List<TraceNode> traceFull(String traceId);
    
    /**
     * 批次追溯
     */
    List<TraceNode> traceByBatch(String materialCode, String batchNo);
    
    /**
     * 订单关联查询
     */
    List<TraceNode> traceByOrder(String orderNo);
    
    /**
     * 变更影响分析
     */
    ChangeImpactAnalysis analyzeChangeImpact(
        String documentId, DocumentType docType, BigDecimal newValue);
}

/**
 * 追溯节点响应
 */
@Data
public class TraceNode {
    private String traceId;
    private String documentType;
    private String documentId;
    private Integer version;
    private String materialCode;
    private String batchNo;
    private BigDecimal quantity;
    private LocalDate documentDate;
    private String plantCode;
    private String status;
    private List<TraceNode> children;
}
```

---

## 5. 医养追溯特殊处理

### 5.1 批次追溯要求

| 要求 | 说明 |
|------|------|
| 批次唯一性 | 每个批次必须有唯一标识（BATCH-YYYYMMDD-XXX） |
| 批次状态 | 批次需要跟踪状态（可用/冻结/消耗/报废） |
| 批次关联 | 每个库存交易必须关联批次 |
| 批次有效期 | 医养产品需跟踪有效期 |

### 5.2 序列号追溯（可选）

```java
/**
 * 序列号追溯
 */
public class SerialNumberTrace {
    
    /**
     * 序列号 → 批次 → 原材料
     */
    public List<TraceNode> traceBySerialNumber(String serialNo) {
        // 1. 查找序列号对应的批次
        BatchInfo batch = batchService.findBySerialNo(serialNo);
        
        // 2. 批次追溯
        return traceByBatch(batch.getMaterialCode(), batch.getBatchNo());
    }
    
    /**
     * 批次 → 序列号列表
     */
    public List<String> findSerialNumbersByBatch(String batchNo) {
        return serialNumberRepository
            .findByBatchNo(batchNo)
            .stream()
            .map(SerialNumber::getSerialNo)
            .collect(Collectors.toList());
    }
}
```

---

## 6. 性能优化策略

### 6.1 索引设计

| 索引类型 | 索引字段 | 用途 | 备注 |
|----------|----------|------|------|
| 主键索引 | trace_id | 唯一查询 | PK |
| 单据索引 | document_type + document_id | 单据查询 | UNIQUE |
| 父子索引 | parent_trace_id | 层级遍历 | INDEX |
| 根节点索引 | root_trace_id | 全链路查询 | INDEX |
| 物料批次索引 | material_code + batch_no | 批次追溯 | INDEX |
| 时间索引 | created_at | 范围查询 | INDEX |
| 复合索引 | root_trace_id + document_type | 链路筛选 | INDEX |

### 6.2 查询性能要求

| 查询类型 | 响应时间 | 数据量级 | 优化策略 |
|----------|----------|----------|----------|
| 单 Trace 查询 | < 50ms | 任意 | PK 索引 |
| 链路追溯（10层） | < 500ms | 百万级 | 递归优化 + LIMIT |
| 批次追溯 | < 200ms | 百万级 | 物化视图 |
| 批量查询（1000条） | < 2s | 1000条 | 并行查询 |
| 变更影响分析 | < 3s | 完整链路 | 异步处理 |

### 6.3 缓存策略

```java
/**
 * Trace ID 缓存配置
 */
@Configuration
public class TraceCacheConfig {
    
    @Bean
    public CacheManager traceCacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        
        // 单条 Trace 缓存（热点数据）
        Cache traceCache = new ConcurrentMapCache(
            "trace", true, true);
        
        // 链路缓存（高频访问）
        Cache chainCache = new ConcurrentMapCache(
            "traceChain", true, true);
        
        // 批次索引缓存
        Cache batchCache = new ConcurrentMapCache(
            "batchIndex", true, true);
        
        cacheManager.setCaches(List.of(
            traceCache, chainCache, batchCache));
        
        return cacheManager;
    }
}
```

---

## 7. 验收标准

### 7.1 功能验收

| 场景 | 输入 | 预期输出 | 验收条件 |
|------|------|---------|----------|
| Trace ID 生成 | SO-2026-001 | 生成唯一 UUID | 100% 唯一 |
| 父子关联 | 订单+工单 | 自动关联 | 关联准确率 100% |
| 正向追溯 | SO Trace ID | 完整上游链路 | 链路完整 |
| 逆向追溯 | DN Trace ID | 完整下游链路 | 链路完整 |
| 批次追溯 | BATCH-001 | 所有关联单据 | 100% 覆盖 |
| 变更影响分析 | 订单数量变更 | 影响清单 | 无遗漏 |

### 7.2 性能验收

| 指标 | 目标值 | 测量方法 |
|------|--------|----------|
| 单条查询 | < 50ms | API 响应计时 |
| 链路追溯（10层） | < 500ms | 完整调用计时 |
| 并发查询 | 100 QPS | 压力测试 |
| 数据一致性 | 0 丢失 | 对账脚本验证 |

---

## 8. 风险与应对

### 8.1 技术风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 递归深度过大 | 中 | 中 | 最大层级限制 + 分页 |
| 循环引用 | 低 | 高 | DAG 检测算法 |
| 性能瓶颈 | 中 | 中 | 缓存 + 异步处理 |
| 数据不一致 | 低 | 高 | 事务保证 + 对账机制 |

### 8.2 数据风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 历史数据缺失 | 中 | 中 | 数据迁移脚本 |
| 批次数据不完整 | 中 | 高 | 入库强校验 |
| 并发写入冲突 | 低 | 中 | 乐观锁 |

### 8.3 业务风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 追溯失败 | 低 | 高 | 多重校验 + 告警 |
| 合规问题 | 低 | 高 | 定期审计 |

---

## 9. 测试用例

### 9.1 单元测试

```java
@ExtendWith(MockitoExtension.class)
class TraceIdGeneratorTest {
    
    @Mock
    private TraceIdRepository traceIdRepository;
    
    @InjectMocks
    private TraceIdGeneratorService traceIdGenerator;
    
    @Test
    void testGenerate_NewTrace() {
        // Given
        TraceIdGenerateRequest request = TraceIdGenerateRequest.builder()
            .documentType(DocumentType.SO)
            .documentId("SO-2026-001")
            .plantCode("QINGDAO")
            .materialCode("HJ-LA23")
            .build();
        
        // When
        TraceId result = traceIdGenerator.generate(request);
        
        // Then
        assertNotNull(result.getTraceId());
        assertEquals(DocumentType.SO, result.getDocumentType());
        assertEquals("SO-2026-001", result.getDocumentId());
        assertNull(result.getParentTraceId());
        assertEquals(RelationType.ROOT, result.getRelationType());
    }
    
    @Test
    void testGenerate_WithParent() {
        // Given
        String parentTraceId = "parent-uuid";
        TraceIdGenerateRequest request = TraceIdGenerateRequest.builder()
            .documentType(DocumentType.MO)
            .documentId("MO-2026-001")
            .parentTraceId(parentTraceId)
            .build();
        
        // When
        TraceId result = traceIdGenerator.generate(request);
        
        // Then
        assertEquals(parentTraceId, result.getParentTraceId());
        assertEquals(RelationType.DERIVED_FROM, result.getRelationType());
    }
}
```

### 9.2 集成测试

```java
@SpringBootTest
@DirtiesContext
class TraceIntegrationTest {
    
    @Autowired
    private TraceQueryService traceQueryService;
    
    @Test
    void testFullChainTrace() {
        // 1. 创建完整链路
        TraceId so = createSalesOrder();
        TraceId mo = createManufacturingOrder(so.getTraceId());
        TraceId po = createPurchaseOrder(mo.getTraceId());
        TraceId gr = createGoodsReceipt(po.getTraceId());
        TraceId dn = createDeliveryNote(mo.getTraceId());
        
        // 2. 全链路追溯
        List<TraceNode> fullChain = traceQueryService.traceFull(so.getTraceId());
        
        // 3. 验证
        assertEquals(5, fullChain.size());
        assertEquals("SO-2026-001", fullChain.get(0).getDocumentId());
        assertEquals("DN-2026-001", fullChain.get(4).getDocumentId());
    }
}
```

---

## 10. 监控与告警

### 10.1 关键指标

| 指标 | 阈值 | 告警级别 | 通知方式 |
|------|------|----------|----------|
| Trace 生成耗时 | > 100ms | WARNING | Slack |
| 链路追溯耗时 | > 1s | WARNING | Slack |
| 查询 QPS | > 1000 | INFO | Dashboard |
| 异常数量 | > 10/min | CRITICAL | SMS |

### 10.2 日志规范

```java
// Trace 生成日志
log.info("[TRACE] Generated. traceId={}, docType={}, docId={}, parent={}", 
    traceId, request.getDocumentType(), request.getDocumentId(), 
    request.getParentTraceId());

// 链路追溯日志
log.info("[TRACE] Trace chain queried. rootTraceId={}, depth={}, nodeCount={}", 
    rootTraceId, depth, nodeCount);

// 变更影响分析日志
log.info("[TRACE] Change impact analyzed. docId={}, affectedPOs={}, affectedMOs={}", 
    docId, affectedPOs.size(), affectedMOs.size());

// 异常日志
log.error("[TRACE] Error occurred. traceId={}, error={}", 
    traceId, error.getMessage(), error);
```

---

## 附录

### A. 术语表

| 术语 | 说明 |
|------|------|
| Trace ID | 追溯标识符 |
| Root Trace | 根追溯节点 |
| Chain | 追溯链路 |
| Impact Analysis | 变更影响分析 |
| Batch Trace | 批次追溯 |

### B. 相关文档

| 文档 | 路径 |
|------|------|
| MRP 引擎规范 | `docs/04_TECHNICAL/MRP_ENGINE_SPEC_v1.0.md` |
| 库存模块设计 | `docs/04_TECHNICAL/INVENTORY_DETAILED_DESIGN_v1.0.md` |
| 状态机设计 | `docs/04_TECHNICAL/CORE_STATE_MACHINE_v1.0.md` |

---

> **文档版本**: v1.1  
> **最后更新**: 2026-02-14  
> **状态**: 待评审
