# Sprint Backlog - MVP 闭环开发计划

**版本**: v1.0  
**日期**: 2026-02-14  
**目标**: 完成需求预测 → S&OP → MPS → MRP → 采购/库存 + Trace ID 追踪 MVP 闭环

---

## Sprint 概览

| Sprint | 周期 | 目标 |
|--------|------|------|
| Sprint 6 | 2 周 | MRP 引擎核心 + Trace ID 基础 |
| Sprint 7 | 2 周 | 库存模块完整实现 + MRP 联动 |
| Sprint 8 | 2 周 | 前端 API 集成 + 生产执行 |
| Sprint 9 | 2 周 | 集成测试 + 性能优化 + MVP 发布 |

---

## Sprint 6: MRP 引擎核心 + Trace ID

### Sprint Goal
实现 MRP 引擎核心逻辑，完成 Trace ID 全链路打通。

### Backlog

| ID | 任务 | 角色 | 估时 | 优先级 | DoD |
|----|------|------|-------|--------|-----|
| S6-01 | BOM 数据模型与存储 | 后端 | 3d | P0 | BOM 表创建完成，支持多级展开 |
| S6-02 | BOM 展开服务实现 | 后端 | 4d | P0 | 展开算法测试通过 |
| S6-03 | MRP 核心计算引擎 | 后端 | 5d | P0 | 毛/净需求计算正确 |
| S6-04 | 齐套检查服务 | 后端 | 3d | P0 | 齐套率计算准确 |
| S6-05 | Trace ID 生成服务 | 后端 | 2d | P0 | 单据关联正确生成 |
| S6-06 | Trace 追溯查询 API | 后端 | 3d | P0 | 正向/逆向追溯正常 |
| S6-07 | MRP REST API 接口 | 后端 | 2d | P1 | API 文档完整 |
| S6-08 | MRP Service Java 框架 | 后端 | - | - | 见下方代码示例 |

### 代码框架示例：MRP Service

```java
// src/main/java/com/hjscm/service/MrpEngineService.java
package com.hjscm.service;

import com.hjscm.dto.*;
import com.hjscm.entity.*;
import com.hjscm.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class MrpEngineService {
    
    private final BomRepository bomRepository;
    private final InventoryRepository inventoryRepository;
    private final MrpRepository mrpRepository;
    private final TraceIdService traceIdService;
    
    /**
     * 执行 MRP 运算
     */
    @Transactional
    public MrpRunResponse runMrp(MrpRunRequest request) {
        long startTime = System.currentTimeMillis();
        String traceId = traceIdService.generateRunTraceId();
        
        log.info("[MRP] Run started. mode={}, from={}, to={}, traceId={}", 
            request.getRunMode(), request.getPlanFromDate(), 
            request.getPlanToDate(), traceId);
        
        try {
            // 1. 获取 MPS 需求
            List<MpsRequirement> mpsRequirements = getMpsRequirements(request);
            
            // 2. BOM 展开
            List<MrpRequirement> explodedRequirements = new ArrayList<>();
            for (MpsRequirement mps : mpsRequirements) {
                explodedRequirements.addAll(
                    explodeBom(mps.getMaterialCode(), mps.getQuantity(), 3)
                );
            }
            
            // 3. 计算净需求
            List<MrpNetRequirement> netRequirements = 
                calculateNetRequirements(explodedRequirements, request.getPlanFromDate());
            
            // 4. 齐套检查
            KitCheckResult kitResult = checkKitAvailability(netRequirements);
            
            // 5. 生成采购建议
            List<ProcurementSuggestion> suggestions = 
                generateSuggestions(kitResult.getShortages());
            
            // 6. 保存结果
            saveMrpResults(netRequirements, kitResult, suggestions);
            
            // 7. 发布事件
            publishMrpCompletedEvent(traceId, netRequirements, kitResult);
            
            long duration = System.currentTimeMillis() - startTime;
            log.info("[MRP] Run completed. traceId={}, duration={}ms, requirements={}", 
                traceId, duration, netRequirements.size());
            
            return MrpRunResponse.builder()
                .runId(traceId)
                .status("COMPLETED")
                .durationMs(duration)
                .requirementCount(netRequirements.size())
                .shortageCount(kitResult.getShortages().size())
                .suggestionCount(suggestions.size())
                .createdAt(LocalDateTime.now())
                .build();
                
        } catch (Exception e) {
            log.error("[MRP] Run failed. traceId={}", traceId, e);
            return MrpRunResponse.builder()
                .runId(traceId)
                .status("FAILED")
                .errorMessage(e.getMessage())
                .build();
        }
    }
    
    /**
     * BOM 展开
     */
    private List<MrpRequirement> explodeBom(String parentCode, 
            BigDecimal qty, int maxLevel) {
        
        List<MrpRequirement> requirements = new ArrayList<>();
        Queue<BomNode> queue = new LinkedList<>();
        
        queue.offer(new BomNode(parentCode, qty, 0));
        
        while (!queue.isEmpty()) {
            BomNode node = queue.poll();
            
            if (node.getLevel() >= maxLevel) {
                requirements.add(buildRequirement(node));
                continue;
            }
            
            List<BomLine> bomLines = bomRepository
                .findByParentItem(node.getItemCode());
            
            if (bomLines.isEmpty()) {
                requirements.add(buildRequirement(node));
                continue;
            }
            
            for (BomLine line : bomLines) {
                BigDecimal childQty = node.getQty()
                    .multiply(line.getUsagePerParent())
                    .multiply(line.getYieldRate());
                
                queue.offer(new BomNode(
                    line.getChildItem(), childQty, node.getLevel() + 1));
            }
        }
        
        return requirements;
    }
    
    /**
     * 计算净需求
     */
    private List<MrpNetRequirement> calculateNetRequirements(
            List<MrpRequirement> requirements, LocalDate fromDate) {
        
        List<MrpNetRequirement> netRequirements = new ArrayList<>();
        
        for (MrpRequirement req : requirements) {
            // 获取现有库存
            BigDecimal onHand = inventoryRepository
                .getOnHand(req.getItemCode(), fromDate);
            
            // 获取在途
            BigDecimal inTransit = inventoryRepository
                .getInTransit(req.getItemCode(), fromDate);
            
            // 获取已分配
            BigDecimal allocated = inventoryRepository
                .getAllocated(req.getItemCode(), fromDate);
            
            // 获取安全库存
            BigDecimal safetyStock = inventoryRepository
                .getSafetyStock(req.getItemCode());
            
            // 计算净需求
            BigDecimal available = onHand.add(inTransit).subtract(allocated);
            BigDecimal netRequirement = req.getRequiredQty()
                .subtract(available)
                .subtract(safetyStock);
            
            if (netRequirement.compareTo(BigDecimal.ZERO) > 0) {
                netRequirements.add(MrpNetRequirement.builder()
                    .itemCode(req.getItemCode())
                    .grossRequirement(req.getRequiredQty())
                    .available(available)
                    .safetyStock(safetyStock)
                    .netRequirement(netRequirement)
                    .requiredDate(fromDate.plusWeeks(
                        req.getLeadTime() != null ? req.getLeadTime() : 2))
                    .traceId(traceIdService.generateRequirementTraceId(req))
                    .build());
            }
        }
        
        return netRequirements;
    }
    
    /**
     * 齐套检查
     */
    private KitCheckResult checkKitAvailability(
            List<MrpNetRequirement> requirements) {
        
        KitCheckResult result = new KitCheckResult();
        
        for (MrpNetRequirement req : requirements) {
            BigDecimal available = inventoryRepository
                .getAvailable(req.getItemCode());
            
            double fillRate = req.getNetRequirement().doubleValue() > 0 
                ? Math.min(1.0, available.doubleValue() / 
                    req.getNetRequirement().doubleValue())
                : 1.0;
            
            if (available.compareTo(req.getNetRequirement()) < 0) {
                result.addShortage(KitShortage.builder()
                    .itemCode(req.getItemCode())
                    .requiredQty(req.getNetRequirement())
                    .availableQty(available)
                    .fillRate(fillRate)
                    .urgencyLevel(fillRate < 0.3 ? "CRITICAL" : 
                        fillRate < 0.6 ? "HIGH" : "MEDIUM")
                    .build());
            }
        }
        
        result.calculateOverallFillRate();
        return result;
    }
    
    /**
     * 生成采购建议
     */
    private List<ProcurementSuggestion> generateSuggestions(
            List<KitShortage> shortages) {
        
        List<ProcurementSuggestion> suggestions = new ArrayList<>();
        
        for (KitShortage shortage : shortages) {
            List<SupplierInfo> suppliers = 
                supplierService.findActiveSuppliers(shortage.getItemCode());
            
            if (!suppliers.isEmpty()) {
                SupplierInfo best = selectBestSupplier(suppliers);
                suggestions.add(ProcurementSuggestion.builder()
                    .itemCode(shortage.getItemCode())
                    .suggestedQty(calculateSuggestedQty(shortage))
                    .suggestedDate(shortage.getRequiredDate()
                        .minusDays(best.getLeadTime()))
                    .supplierCode(best.getSupplierCode())
                    .urgencyLevel(shortage.getUrgencyLevel())
                    .build());
            }
        }
        
        return suggestions;
    }
}
```

### 测试用例

```java
// src/test/java/com/hjscm/service/MrpEngineServiceTest.java
@ExtendWith(MockitoExtension.class)
class MrpEngineServiceTest {
    
    @Mock private BomRepository bomRepository;
    @Mock private InventoryRepository inventoryRepository;
    @Mock private MrpRepository mrpRepository;
    @Mock private TraceIdService traceIdService;
    
    @InjectMocks private MrpEngineService mrpEngine;
    
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
    }
    
    @Test
    void testNetRequirementCalculation() {
        // Given
        MrpRequirement req = MrpRequirement.builder()
            .itemCode("HJ-M05")
            .requiredQty(BigDecimal.valueOf(100))
            .leadTime(2)
            .build();
        
        when(inventoryRepository.getOnHand("HJ-M05", any()))
            .thenReturn(BigDecimal.valueOf(30));
        when(inventoryRepository.getInTransit("HJ-M05", any()))
            .thenReturn(BigDecimal.valueOf(20));
        when(inventoryRepository.getAllocated("HJ-M05", any()))
            .thenReturn(BigDecimal.ZERO);
        when(inventoryRepository.getSafetyStock("HJ-M05"))
            .thenReturn(BigDecimal.valueOf(10));
        
        // When
        List<MrpNetRequirement> result = mrpEngine.calculateNetRequirements(
            List.of(req), LocalDate.now());
        
        // Then
        assertEquals(1, result.size());
        assertEquals(0, BigDecimal.valueOf(40).compareTo(
            result.get(0).getNetRequirement()));
    }
}
```

---

## Sprint 7: 库存模块完整实现

### Sprint Goal
实现安全库存、ABC-XYZ 分类、呆滞检测，与 MRP 联动。

### Backlog

| ID | 任务 | 角色 | 估时 | 优先级 | DoD |
|----|------|------|-------|--------|-----|
| S7-01 | 安全库存计算服务 | 后端 | 3d | P0 | SS 计算公式正确 |
| S7-02 | ABC-XYZ 分类服务 | 后端 | 3d | P0 | 分类占比正确 |
| S7-03 | 呆滞检测服务 | 后端 | 2d | P0 | 风险评分准确 |
| S7-04 | ATP 计算服务 | 后端 | 2d | P0 | ATP 计算正确 |
| S7-05 | 库存查询 API | 后端 | 2d | P1 | API 响应 < 100ms |
| S7-06 | 库存变更事件发布 | 后端 | 1d | P1 | MRP 能收到事件 |
| S7-07 | 库存前端组件 | 前端 | 3d | P1 | UI 交互正常 |
| S7-08 | ABC-XYZ 图表 | 前端 | 2d | P1 | 图表展示正确 |

---

## Sprint 8: 前端 API 集成 + 生产执行

### Sprint Goal
前端替换 Mock 为真实 API，实现生产执行模块。

### Backlog

| ID | 任务 | 角色 | 估时 | 优先级 | DoD |
|----|------|------|-------|--------|-----|
| S8-01 | API Service 层封装 | 前端 | 2d | P0 | 所有 API 调用走 service |
| S8-02 | Skeleton 加载组件 | 前端 | 1d | P1 | 加载状态展示 |
| S8-03 | ECharts 大数据渲染优化 | 前端 | 2d | P1 | 渲染 < 1s |
| S8-04 | 生产工单列表 | 前端 | 2d | P1 | 列表展示正常 |
| S8-05 | 投料扫码组件 | 前端 | 2d | P1 | 扫码交互正常 |
| S8-06 | 完工汇报组件 | 前端 | 2d | P1 | 报工提交成功 |
| S8-07 | 批次追溯前端 | 前端 | 3d | P0 | 追溯链路展示 |

---

## Sprint 9: 集成测试 + 性能优化 + MVP 发布

### Sprint Goal
完成全链路集成测试，性能达标，发布 MVP。

### Backlog

| ID | 任务 | 角色 | 估时 | 优先级 | DoD |
|----|------|------|-------|--------|-----|
| S9-01 | 全链路集成测试 | 测试 | 3d | P0 | 所有链路测试通过 |
| S9-02 | 性能测试 | 测试 | 2d | P0 | 性能指标达标 |
| S9-03 | 安全测试 | 测试 | 2d | P0 | 无高危漏洞 |
| S9-04 | API 文档完善 | 后端 | 1d | P1 | Swagger 完整 |
| S9-05 | 性能优化 | 后端/前端 | 2d | P1 | 指标达标 |
| S9-06 | MVP 发布 | DevOps | 1d | P0 | PROD 部署成功 |

---

## 里程碑

```
Sprint 6 (W1-W2)     Sprint 7 (W3-W4)     Sprint 8 (W5-W6)     Sprint 9 (W7-W8)
     │                    │                    │                    │
     ▼                    ▼                    ▼                    ▼
┌─────────┐          ┌─────────┐          ┌─────────┐          ┌─────────┐
│ MRP 引擎│          │ 库存模块│          │ API 集成│          │ MVP     │
│ 核心完成│    →     │ 完整实现│    →     │ + 生产  │    →     │ 发布    │
│         │          │         │          │ 执行     │          │         │
└─────────┘          └─────────┘          └─────────┘          └─────────┘
     │                    │                    │                    │
     ▼                    ▼                    ▼                    ▼
  Trace ID            MRP 联动             前端优化             验收通过
  全链路打通          实时同步             Mock 替换            上线
```

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
- [ ] MRP 与库存实时联动
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

> **文档版本**: v1.0  
> **最后更新**: 2026-02-14
