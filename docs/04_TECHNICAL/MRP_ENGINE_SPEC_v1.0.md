# MRP 引擎设计规范 v1.0

> **版本**: v1.0  
> **状态**: Draft  
> **作者**: HJ SCM Team  
> **日期**: 2026-02-14

---

## 1. 概述

### 1.1 文档目的
本文档定义 MRP（物料需求计划）引擎的架构设计、算法细节、接口规范和验收标准，旨在实现从需求预测到采购建议的完整闭环。

### 1.2 业务背景
- **豪江业务特性**：医养追溯优先、多级 BOM 优化、MTO 订单驱动、原材料波动预测
- **核心痛点**：物料齐套率低（当前 78%）、采购周期长（Bühler 6 周）、原材料价格波动大
- **目标**：齐套率提升至 92%、采购成本降低 8%、交期准确率提升至 95%

### 1.3 设计原则
| 原则 | 说明 |
|------|------|
| Single Source of Truth | 以 MPS 结果为唯一输入源 |
| Exception-Driven | 仅输出异常/需人工决策项 |
| Configurable | 支持多种 MRP 策略配置 |
| Collaborative | 与采购、库存、生产模块双向联动 |

---

## 2. 系统架构

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MRP Engine Architecture                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐            │
│  │   MPS 模块    │───▶│  MRP 引擎    │───▶│  采购模块     │            │
│  │ (13周滚动计划) │    │  核心处理器   │    │  (采购建议)   │            │
│  └──────────────┘    └──────────────┘    └──────────────┘            │
│           │                   │                   │                    │
│           ▼                   ▼                   ▼                    │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐            │
│  │  库存模块     │◀───│  齐套检查     │◀───│  供应商模块   │            │
│  │  (可用量)    │    │  约束优化     │    │  (交期确认)   │            │
│  └──────────────┘    └──────────────┘    └──────────────┘            │
│           │                   │                                      │
│           ▼                   ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐          │
│  │                    Trace ID 服务                         │          │
│  │              (物料追溯 + 变更影响分析)                    │          │
│  └──────────────────────────────────────────────────────────┘          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 数据流

```
需求输入 ──▶ BOM 展开 ──▶ 毛需求计算 ──▶ 净需求计算 ──▶ 齐套检查 ──▶ 采购建议
   │           │           │            │           │            │
   ▼           ▼           ▼            ▼           ▼            ▼
  MPS      多级 BOM     在途+库存    提前期+安全   产能约束     采购订单
 输出      解析器       计算器       库存计算     检查器      生成器
```

---

## 3. 核心算法

### 3.1 MRP 计算公式

#### 3.1.1 毛需求 (Gross Requirement)
```
毛需求 = Σ(独立需求) + Σ(相关需求)
       = Σ(销售订单) + Σ(预测需求) + Σ(下层物料需求)
```

#### 3.1.2 净需求 (Net Requirement)
```
净需求 = max(0, 毛需求 - (现有库存 + 在途量 + 已分配量))
```

#### 3.1.3 计划订单 (Planned Order)
```
计划数量 = 净需求 × (1 + 损耗率%) 
         按包装量/最小订购量向上取整

计划订单下达日期 = 需求日期 - 采购/生产提前期
```

#### 3.1.4 安全库存计算
```
安全库存 = Zα × √(平均提前期) × σ日需求

参数说明：
- Zα: 服务水平系数 (95% → 1.645, 99% → 2.326)
- σ日需求: 日需求标准差
- 平均提前期: Lead Time Mean
```

#### 3.1.5 再订货点 (Reorder Point)
```
再订货点 = (平均日需求 × 平均提前期) + 安全库存
```

### 3.2 BOM 展开算法

```java
/**
 * 多级 BOM 展开算法
 * 支持：平行展开/深度优先展开
 * 支持：尾项展开/中间项展开
 */
public class BomExplosionService {
    
    /**
     * 展开 BOM 到指定层级
     * @param parentItem 父项编码
     * @param requiredQty 需求数量
     * @param explodeLevel 展开层级 (-1 表示全部展开)
     * @return 物料需求清单
     */
    public List<MrpRequirement> explodeBom(
            String parentItem, 
            BigDecimal requiredQty, 
            int explodeLevel) {
        
        List<MrpRequirement> requirements = new ArrayList<>();
        Queue<BomNode> queue = new LinkedList<>();
        
        // 根节点入队
        queue.offer(new BomNode(parentItem, requiredQty, 0));
        
        while (!queue.isEmpty()) {
            BomNode node = queue.poll();
            
            if (explodeLevel > 0 && node.getLevel() >= explodeLevel) {
                // 达到指定层级，停止展开
                requirements.add(buildRequirement(node));
                continue;
            }
            
            // 获取子项 BOM
            List<BomLine> bomLines = bomRepository
                .findByParentItem(node.getItemCode());
            
            if (CollectionUtils.isEmpty(bomLines)) {
                // 无子项，尾项
                requirements.add(buildRequirement(node));
                continue;
            }
            
            // 展开子项
            for (BomLine line : bomLines) {
                BigDecimal childQty = node.getQty()
                    .multiply(line.getUsagePerParent())
                    .multiply(line.getYieldRate());
                
                queue.offer(new BomNode(
                    line.getChildItem(), 
                    childQty, 
                    node.getLevel() + 1
                ));
            }
        }
        
        return requirements;
    }
    
    private MrpRequirement buildRequirement(BomNode node) {
        ItemMaster item = itemRepository.findByCode(node.getItemCode());
        
        return MrpRequirement.builder()
            .itemCode(node.getItemCode())
            .itemName(item.getItemName())
            .requiredQty(node.getQty())
            .uom(item.getBaseUom())
            .level(node.getLevel())
            .itemCategory(item.getCategory())  // 原材料/半成品/成品
            .sourceType(item.getSourceType())  // MTO/MTP/STD
            .leadTime(item.getLeadTime())
            .safetyStock(item.getSafetyStock())
            .build();
    }
}
```

### 3.3 齐套检查算法

```java
/**
 * 齐套检查服务
 * 计算每个时段的物料齐套率，识别缺料项
 */
public class KitCheckService {
    
    /**
     * 检查需求齐套率
     * @param requirements 物料需求列表
     * @param checkDate 检查日期
     * @return 齐套检查结果
     */
    public KitCheckResult checkKitAvailability(
            List<MrpRequirement> requirements, 
            LocalDate checkDate) {
        
        KitCheckResult result = new KitCheckResult();
        result.setCheckDate(checkDate);
        
        for (MrpRequirement req : requirements) {
            // 1. 获取可用库存
            BigDecimal availableQty = inventoryService
                .getAvailableQty(req.getItemCode(), checkDate);
            
            // 2. 获取在途量
            BigDecimal inTransitQty = procurementService
                .getInTransitQty(req.getItemCode(), checkDate);
            
            // 3. 计算齐套率
            BigDecimal totalAvailable = availableQty.add(inTransitQty);
            double fillRate = req.getRequiredQty().doubleValue() > 0 
                ? Math.min(1.0, totalAvailable.doubleValue() / 
                    req.getRequiredQty().doubleValue())
                : 1.0;
            
            // 4. 判断缺料
            if (totalAvailable.compareTo(req.getRequiredQty()) < 0) {
                KitShortage shortage = new KitShortage();
                shortage.setItemCode(req.getItemCode());
                shortage.setRequiredQty(req.getRequiredQty());
                shortage.setAvailableQty(totalAvailable);
                shortage.setShortageQty(req.getRequiredQty()
                    .subtract(totalAvailable));
                shortage.setFillRate(fillRate);
                shortage.setUrgent(fillRate < 0.5);  // 低于50%标记紧急
                
                result.addShortage(shortage);
            }
            
            // 5. 添加到齐套项
            KitItem kitItem = new KitItem();
            kitItem.setItemCode(req.getItemCode());
            kitItem.setRequiredQty(req.getRequiredQty());
            kitItem.setAvailableQty(totalAvailable);
            kitItem.setFillRate(fillRate);
            result.addKitItem(kitItem);
        }
        
        // 计算整体齐套率
        result.calculateOverallFillRate();
        
        return result;
    }
}
```

### 3.4 采购建议生成算法

```java
/**
 * 采购建议生成服务
 * 基于齐套检查结果和供应商信息生成采购建议
 */
public class ProcurementSuggestionService {
    
    /**
     * 生成采购建议
     * @param shortages 缺料清单
     * @return 采购建议列表
     */
    public List<ProcurementSuggestion> generateSuggestions(
            List<KitShortage> shortages) {
        
        List<ProcurementSuggestion> suggestions = new ArrayList<>();
        
        for (KitShortage shortage : shortages) {
            ItemMaster item = itemRepository
                .findByCode(shortage.getItemCode());
            
            // 1. 匹配供应商
            List<SupplierInfo> suppliers = supplierService
                .findActiveSuppliers(item.getCategory());
            
            if (CollectionUtils.isEmpty(suppliers)) {
                // 无供应商，生成异常
                generateNoSupplierAlert(shortage);
                continue;
            }
            
            // 2. 选择最优供应商（价格+交期+质量）
            SupplierInfo bestSupplier = selectBestSupplier(
                suppliers, shortage.getRequiredQty());
            
            // 3. 计算建议采购量
            BigDecimal suggestedQty = calculateSuggestedQty(
                shortage, item);
            
            // 4. 计算建议采购日期
            LocalDate suggestedDate = calculateSuggestedDate(
                shortage, bestSupplier, item);
            
            // 5. 生成建议
            ProcurementSuggestion suggestion = 
                ProcurementSuggestion.builder()
                    .itemCode(shortage.getItemCode())
                    .itemName(item.getItemName())
                    .suggestedQty(suggestedQty)
                    .suggestedDate(suggestedDate)
                    .supplierCode(bestSupplier.getSupplierCode())
                    .supplierName(bestSupplier.getSupplierName())
                    .estimatedPrice(bestSupplier.getUnitPrice()
                        .multiply(suggestedQty))
                    .urgencyLevel(calculateUrgency(shortage))
                    .reason(generateReason(shortage))
                    .alternativeSuppliers(
                        suppliers.stream()
                            .filter(s -> !s.equals(bestSupplier))
                            .collect(Collectors.toList()))
                    .build();
            
            suggestions.add(suggestion);
        }
        
        return suggestions;
    }
    
    /**
     * 计算建议采购量（考虑最小订购量和包装量）
     */
    private BigDecimal calculateSuggestedQty(
            KitShortage shortage, ItemMaster item) {
        
        BigDecimal shortageQty = shortage.getShortageQty();
        BigDecimal moq = item.getMinOrderQty();  // 最小订购量
        BigDecimal packQty = item.getPackageQty();  // 包装量
        
        // 考虑损耗率
        BigDecimal withLoss = shortageQty
            .multiply(BigDecimal.ONE.add(item.getLossRate()));
        
        // 取整到包装量
        if (packQty.compareTo(BigDecimal.ONE) > 0) {
            withLoss = withLoss
                .divide(packQty, 0, RoundingMode.CEILING)
                .multiply(packQty);
        }
        
        // 确保不低于最小订购量
        return withLoss.max(moq);
    }
    
    /**
     * 计算建议采购日期（考虑采购提前期）
     */
    private LocalDate calculateSuggestedDate(
            KitShortage shortage, 
            SupplierInfo supplier, 
            ItemMaster item) {
        
        LocalDate requiredDate = shortage.getRequiredDate();
        int leadTime = supplier.getLeadTime() + item.getInboundLeadTime();
        
        return requiredDate.minusDays(leadTime);
    }
    
    /**
     * 计算紧急程度
     */
    private String calculateUrgency(KitShortage shortage) {
        if (shortage.getFillRate() < 0.3) {
            return "CRITICAL";
        } else if (shortage.getFillRate() < 0.6) {
            return "HIGH";
        } else {
            return "MEDIUM";
        }
    }
}
```

---

## 4. 接口定义

### 4.1 REST API

| 方法 | 路径 | 说明 | 请求体 | 响应体 |
|------|------|------|--------|--------|
| POST | /api/mrp/run | 执行 MRP 运算 | MrpRunRequest | MrpRunResponse |
| GET | /api/mrp/requirements | 查询物料需求 | - | List<MrpRequirement> |
| GET | /api/mrp/kit-check | 齐套检查 | - | KitCheckResult |
| GET | /api/mrp/suggestions | 采购建议 | - | List<ProcurementSuggestion> |
| POST | /api/mrp/bom/explode | BOM 展开 | BomExplosionRequest | List<MrpRequirement> |

### 4.2 请求/响应 DTO

```java
/**
 * MRP 运行请求
 */
@Data
public class MrpRunRequest {
    /** 运行模式：FORECAST（预测驱动）/ ORDER（订单驱动）/ FULL（完整运算） */
    private String runMode;
    
    /** 计划时段开始日期 */
    private LocalDate planFromDate;
    
    /** 计划时段结束日期 */
    private LocalDate planToDate;
    
    /** 物料编码（可选，空表示全部） */
    private String itemCode;
    
    /** 工厂编码 */
    private String plantCode;
    
    /** 是否包含齐套检查 */
    private Boolean includeKitCheck;
    
    /** 是否生成采购建议 */
    private Boolean generateSuggestions;
}

/**
 * MRP 运行响应
 */
@Data
public class MrpRunResponse {
    /** 运行ID（用于追踪） */
    private String runId;
    
    /** 运行状态：COMPLETED / FAILED / PARTIAL */
    private String status;
    
    /** 运行耗时（毫秒） */
    private Long durationMs;
    
    /** 生成的物料需求数量 */
    private Integer requirementCount;
    
    /** 缺料项数量 */
    private Integer shortageCount;
    
    /** 生成的采购建议数量 */
    private Integer suggestionCount;
    
    /** 异常消息列表 */
    private List<String> warnings;
    
    /** Trace ID（用于全链路追踪） */
    private String traceId;
    
    /** 生成时间 */
    private LocalDateTime createdAt;
}
```

### 4.3 内部事件

```java
/**
 * MRP 运行完成事件
 */
public class MrpRunCompletedEvent {
    private String runId;
    private String traceId;
    private Integer requirementCount;
    private Integer shortageCount;
    private LocalDateTime completedAt;
}

/**
 * 缺料预警事件
 */
public class ShortageAlertEvent {
    private String itemCode;
    private BigDecimal shortageQty;
    private BigDecimal fillRate;
    private String urgencyLevel;
    private LocalDate requiredDate;
    private String traceId;
}
```

---

## 5. 验收标准

### 5.1 功能验收

| 场景 | 输入 | 预期输出 | 验收条件 |
|------|------|---------|----------|
| BOM 展开 | HJ-LA23, 需求100件, 展开2级 | 子项物料清单（含 HJ-M05 100件、HJ-SP03 200件） | 数量计算误差 < 0.01% |
| 净需求计算 | 毛需求100 + 库存30 + 在途20 | 净需求 50 | 计算正确 |
| 齐套检查 | 3项物料需求 | 齐套率 + 缺料清单 | 缺料识别准确率 100% |
| 采购建议 | 缺料清单（HJ-M05 缺50件） | 建议采购量60件 + 供应商 + 交期 | 建议符合 MOQ 约束 |

### 5.2 性能验收

| 指标 | 目标值 | 测量方法 |
|------|--------|----------|
| BOM 展开（100节点） | < 500ms | 单次调用计时 |
| MRP 全量运算（5000 SKU） | < 30s | 完整运算计时 |
| 齐套检查响应 | < 2s | API 响应时间 |
| 并发处理能力 | 50 QPS | 压力测试 |

### 5.3 数据一致性验收

| 场景 | 验证项 | 验收条件 |
|------|--------|----------|
| 库存扣减 | 需求占用 vs 实际可用 | 误差 < 0.01% |
| Trace ID 追踪 | 需求 → 采购订单关联 | 100% 可追溯 |
| 并发更新 | 库存竞争条件 | 无超卖/负库存 |

### 5.4 异常处理验收

| 异常场景 | 处理方式 | 验证点 |
|----------|----------|--------|
| BOM 循环引用 | 检测并报错 | 正确识别循环 |
| 供应商失效 | 跳过并告警 | 不生成无效建议 |
| 库存数据异常 | 记录告警 | 不阻断主流程 |

---

## 6. 风险与应对

### 6.1 技术风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| BOM 数据不完整 | 中 | 高 | 增加 BOM 完整性检查脚本 |
| 性能瓶颈（大 SKU） | 中 | 中 | 分批处理 + 缓存优化 |
| 并发更新冲突 | 低 | 高 | 乐观锁 + 重试机制 |

### 6.2 数据风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 库存数据延迟 | 中 | 高 | 实时同步 + 对账机制 |
| 供应商交期不准 | 高 | 中 | 动态调整算法 + 缓冲 |
| 需求预测偏差 | 高 | 中 | 敏感性分析 + 安全库存 |

### 6.3 业务风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 齐套率不升反降 | 低 | 高 | 渐进式上线 + 监控告警 |
| 采购建议不合理 | 中 | 中 | 人工审核 + AI 优化 |

---

## 7. 测试用例

### 7.1 单元测试

```java
@ExtendWith(MockitoExtension.class)
class MrpEngineTest {
    
    @Mock
    private BomRepository bomRepository;
    
    @Mock
    private InventoryService inventoryService;
    
    @InjectMocks
    private MrpEngineService mrpEngine;
    
    @Test
    void testBomExplosion_OneLevel() {
        // Given
        BomLine bomLine = BomLine.builder()
            .parentItem("HJ-LA23")
            .childItem("HJ-M05")
            .usagePerParent(BigDecimal.ONE)
            .yieldRate(BigDecimal.ONE)
            .build();
        when(bomRepository.findByParentItem("HJ-LA23"))
            .thenReturn(List.of(bomLine));
        
        // When
        List<MrpRequirement> result = mrpEngine.explodeBom(
            "HJ-LA23", BigDecimal.valueOf(100), 1);
        
        // Then
        assertEquals(1, result.size());
        assertEquals("HJ-M05", result.get(0).getItemCode());
        assertEquals(0, BigDecimal.valueOf(100)
            .compareTo(result.get(0).getRequiredQty()));
    }
    
    @Test
    void testNetRequirementCalculation() {
        // Given
        BigDecimal grossReq = BigDecimal.valueOf(100);
        BigDecimal onHand = BigDecimal.valueOf(30);
        BigDecimal inTransit = BigDecimal.valueOf(20);
        BigDecimal allocated = BigDecimal.valueOf(5);
        
        // When
        BigDecimal netReq = mrpEngine.calculateNetRequirement(
            grossReq, onHand, inTransit, allocated);
        
        // Then
        assertEquals(0, BigDecimal.valueOf(45).compareTo(netReq));
    }
}
```

### 7.2 集成测试

```java
@SpringBootTest
@DirtiesContext
class MrpIntegrationTest {
    
    @Autowired
    private MrpEngineService mrpEngine;
    
    @Test
    void testFullMrpRun() {
        // Given
        MrpRunRequest request = MrpRunRequest.builder()
            .runMode("FULL")
            .planFromDate(LocalDate.now())
            .planToDate(LocalDate.now().plusWeeks(13))
            .plantCode("QINGDAO")
            .includeKitCheck(true)
            .generateSuggestions(true)
            .build();
        
        // When
        MrpRunResponse response = mrpEngine.runMrp(request);
        
        // Then
        assertEquals("COMPLETED", response.getStatus());
        assertNotNull(response.getRunId());
        assertTrue(response.getDurationMs() < 30000);
    }
}
```

---

## 8. 监控与告警

### 8.1 关键指标

| 指标 | 阈值 | 告警级别 |
|------|------|----------|
| MRP 运行耗时 | > 30s | WARNING |
| 齐套率 | < 80% | WARNING |
| 缺料项数量 | > 50 | INFO |
| 采购建议采纳率 | < 60% | WARNING |

### 8.2 日志规范

```java
// MRP 运行日志
log.info("[MRP] Run started. mode={}, from={}, to={}, traceId={}", 
    request.getRunMode(), request.getPlanFromDate(), 
    request.getPlanToDate(), traceId);

// 缺料告警
log.warn("[MRP] Shortage detected. item={}, shortage={}, fillRate={}, traceId={}",
    shortage.getItemCode(), shortage.getShortageQty(), 
    shortage.getFillRate(), traceId);

// 性能日志
log.info("[MRP] Run completed. runId={}, durationMs={}, requirements={}",
    response.getRunId(), response.getDurationMs(), 
    response.getRequirementCount());
```

---

## 9. 附录

### 9.1 术语表

| 术语 | 说明 |
|------|------|
| MPS | 主生产计划 (Master Production Schedule) |
| BOM | 物料清单 (Bill of Materials) |
| MRP | 物料需求计划 (Material Requirements Planning) |
| ATP | 可承诺量 (Available to Promise) |
| MOQ | 最小订购量 (Minimum Order Quantity) |
| Lead Time | 提前期 |

### 9.2 参考文档

| 文档 | 路径 |
|------|------|
| Trace ID 规范 | `docs/04_TECHNICAL/TRACE_ID_SPECIFICATION_v1.0.md` |
| 库存模块设计 | `docs/04_TECHNICAL/INVENTORY_DETAILED_DESIGN_v1.0.md` |
| 状态机设计 | `docs/04_TECHNICAL/CORE_STATE_MACHINE_v1.0.md` |

---

> **文档版本**: v1.0  
> **最后更新**: 2026-02-14  
> **状态**: 待评审
