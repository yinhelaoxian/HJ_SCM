# Sprint 9 测试计划 v1.0

**版本**: v1.0  
**日期**: 2026-02-14  
**目标**: 完成单元测试、集成测试、性能测试  

---

## 1. 测试范围

### 1.1 测试对象

| 模块 | 测试类型 |
|------|----------|
| MRP Engine | 单元测试 + 集成测试 |
| Trace ID | 单元测试 + 集成测试 |
| Safety Stock | 单元测试 |
| ABC-XYZ | 单元测试 |
| ATP Calculator | 单元测试 |
| Production Order | 集成测试 |

---

## 2. 测试用例

### 2.1 MRP Engine 测试

```java
// src/test/java/com/hjscm/service/MRPEngineServiceTest.java

@ExtendWith(MockitoExtension.class)
class MrpEngineServiceTest {

    @Test
    void testBomExplosion_OneLevel() {
        // Given
        BomLine bomLine = BomLine.builder()
            .parentItem("HJ-LA23")
            .childItem("HJ-M05")
            .usagePerParent(BigDecimal.ONE)
            .yieldRate(BigDecimal.ONE)
            .build();
        when(bomRepository.findByParentItemAndActive("HJ-LA23", true))
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
        when(inventoryRepository.getOnHand(eq("HJ-M05"), any()))
            .thenReturn(BigDecimal.valueOf(30));
        when(inventoryRepository.getInTransit(eq("HJ-M05"), any()))
            .thenReturn(BigDecimal.valueOf(20));
        when(inventoryRepository.getSafetyStock("HJ-M05"))
            .thenReturn(BigDecimal.valueOf(10));
        
        // When
        List<MrpNetRequirement> result = mrpEngine.calculateNetRequirements(
            List.of(req), LocalDate.now());
        
        // Then
        assertEquals(0, BigDecimal.valueOf(40).compareTo(
            result.get(0).getNetRequirement()));
    }

    @Test
    void testKitAvailability_AllAvailable() {
        // Given
        MrpNetRequirement req = MrpNetRequirement.builder()
            .itemCode("HJ-LA23")
            .netRequirement(BigDecimal.valueOf(100))
            .traceId("TRACE-001")
            .build();
        
        when(inventoryRepository.findByMaterialCode("HJ-LA23"))
            .thenReturn(Optional.of(InventoryBalance.builder()
                .quantity(BigDecimal.valueOf(200))
                .reservedQty(BigDecimal.ZERO)
                .build()));
        
        // When
        KitCheckResult result = mrpEngine.checkKitAvailability(List.of(req));
        
        // Then
        assertEquals(1, result.getKitItems().size());
        assertTrue(result.getShortages().isEmpty());
    }
}
```

### 2.2 Trace ID 测试

```java
// src/test/java/com/hjscm/service/TraceIdServiceTest.java

@ExtendWith(MockitoExtension.class)
class TraceIdServiceTest {

    @Test
    void testGenerateTrace_Success() {
        // Given
        TraceRequest request = TraceRequest.builder()
            .documentType("SO")
            .documentId("SO-2026-001")
            .build();
        
        // When
        TraceRelation result = traceService.generateTraceId(
            "SO", "SO-2026-001", null);
        
        // Then
        assertNotNull(result.getTraceId());
        assertEquals("SO", result.getDocumentType());
        assertEquals("ROOT", result.getRelationType());
    }

    @Test
    void testTraceForward_Success() {
        // Given
        String traceId = createTraceChain();
        
        // When
        TraceResult result = traceService.traceForward(traceId);
        
        // Then
        assertTrue(result.getTraceChain().size() >= 2);
    }

    @Test
    void testTraceBackward_Success() {
        // Given
        String traceId = createTraceChain();
        
        // When
        TraceResult result = traceService.traceBackward(traceId);
        
        // Then
        assertNotNull(result.getTraceChain());
    }
}
```

### 2.3 ATP Calculator 测试

```java
// src/test/java/com/hjscm/service/ATPCalculatorTest.java

@ExtendWith(MockitoExtension.class)
class ATPCalculatorTest {

    @Test
    void testCalculateATP_SufficientStock() {
        // Given
        ATPRequest request = ATPRequest.builder()
            .materialCode("HJ-LA23")
            .plantCode("QINGDAO")
            .requestedQty(BigDecimal.valueOf(1000))
            .requestedDate(LocalDate.now().plusDays(7))
            .build();
        
        when(inventoryRepository.findByMaterialCodeAndPlantCode("HJ-LA23", "QINGDAO"))
            .thenReturn(Optional.of(InventoryBalance.builder()
                .quantity(BigDecimal.valueOf(3840))
                .reservedQty(BigDecimal.ZERO)
                .build()));
        
        // When
        ATPResult result = atpCalculator.calculateATP(request);
        
        // Then
        assertTrue(result.isCanFulfill());
        assertEquals(0, BigDecimal.valueOf(2840).compareTo(result.getAtpQty()));
    }

    @Test
    void testCalculateATP_InsufficientStock() {
        // Given
        ATPRequest request = ATPRequest.builder()
            .materialCode("HJ-LA23")
            .plantCode("QINGDAO")
            .requestedQty(BigDecimal.valueOf(5000))
            .requestedDate(LocalDate.now().plusDays(7))
            .build();
        
        when(inventoryRepository.findByMaterialCodeAndPlantCode("HJ-LA23", "QINGDAO"))
            .thenReturn(Optional.of(InventoryBalance.builder()
                .quantity(BigDecimal.valueOf(3840))
                .reservedQty(BigDecimal.ZERO)
                .build()));
        
        // When
        ATPResult result = atpCalculator.calculateATP(request);
        
        // Then
        assertFalse(result.isCanFulfill());
    }
}
```

---

## 3. 测试覆盖率目标

| 模块 | 覆盖率目标 |
|------|------------|
| MRP Engine | > 80% |
| Trace ID | > 80% |
| Safety Stock | > 80% |
| ABC-XYZ | > 80% |
| ATP Calculator | > 80% |
| Production Order | > 70% |
| **整体** | **> 80%** |

---

## 4. 集成测试

### 4.1 全链路集成测试

```java
@SpringBootTest
@DirtiesContext
class MrpInventoryIntegrationTest {

    @Autowired
    private MrpEngineService mrpEngine;
    
    @Autowired
    private InventoryChangeService inventoryService;
    
    @Test
    void testMrpInventoryIntegration() {
        // 1. 创建库存
        inventoryService.processChange(InventoryChange.builder()
            .transType("GR")
            .materialCode("HJ-LA23")
            .quantity(BigDecimal.valueOf(1000))
            .build());
        
        // 2. 运行 MRP
        MrpRunResponse response = mrpEngine.runMrp(MrpRunRequest.builder()
            .runMode("FULL")
            .planFromDate(LocalDate.now())
            .planToDate(LocalDate.now().plusWeeks(13))
            .build());
        
        // 3. 验证
        assertEquals("COMPLETED", response.getStatus());
        assertNotNull(response.getRunId());
    }
}
```

---

## 5. 性能测试

### 5.1 性能指标

| 指标 | 目标值 | 测试方法 |
|------|--------|----------|
| MRP 全量运算 | < 30s | JMeter |
| ATP 计算 | < 200ms | API 响应时间 |
| Trace 追溯 | < 500ms | API 响应时间 |
| 并发查询 | 100 QPS | 压力测试 |

---

## 6. 验收标准

### 6.1 测试验收

| 条件 | 目标 |
|------|------|
| 单元测试覆盖率 | > 80% |
| 集成测试通过率 | 100% |
| 性能测试达标 | 全部达标 |
| 无高危 Bug | 是 |

---

> **文档版本**: v1.0  
> **最后更新**: 2026-02-14  
> **状态**: 待执行
