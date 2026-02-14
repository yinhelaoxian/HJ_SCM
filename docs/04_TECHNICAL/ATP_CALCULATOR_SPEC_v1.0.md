# ATP/CTP 计算服务详细设计 v1.0

**文档版本**: v1.0  
**状态**: Draft  
**生效日期**: 2026-02-14  
**适用范围**: HJ_SCM 库存模块  

---

## 1. 概述

### 1.1 功能范围

| 功能 | 说明 |
|------|------|
| ATP 计算 | 可承诺量计算 |
| CTP 计算 | 可承诺能力计算（考虑产能） |
| 批量 ATP | 批量计算多个物料 |
| 最早可承诺日期 | 计算何时可满足需求 |

### 1.2 业务场景

| 场景 | 输入 | 输出 |
|------|------|------|
| 订单确认 | HJ-LA23, 2000件, 02-20 | ATP=3840, 可满足 |
| 产能约束 | 同上 + 产能限制 | CTP=不可满足, 约束=产能 |
| 提前期计算 | 缺料 | 最早可承诺日期 |

---

## 2. 算法设计

### 2.1 ATP 计算公式

```
ATP = 可用库存 + 在途量 - 已分配量 - 预留量

其中：
- 可用库存 = 现有量 - 预留量
- 在途量 = 需求日期之前的采购订单在途量
- 已分配量 = 已承诺给其他销售订单的量
- 预留量 = MRP 预留的量
```

### 2.2 CTP 计算公式

```
CTP = min(ATP, 产能可用量)

约束类型判断：
- MATERIAL: ATP < 需求数量 → 物料约束
- CAPACITY: 产能 < 需求数量 → 产能约束
- NONE: 无约束
```

---

## 3. API 接口

### 3.1 REST API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/inventory/atp | 计算 ATP |
| POST | /api/inventory/ctp | 计算 CTP |
| POST | /api/inventory/atp/batch | 批量计算 |

### 3.2 请求/响应

```java
// ATP 请求
@Data
@Builder
public class ATPRequest {
    private String materialCode;
    private String plantCode;
    private BigDecimal requestedQty;
    private LocalDate requestedDate;
}

// ATP 响应
@Data
@Builder
public class ATPResult {
    private String materialCode;
    private BigDecimal requestedQty;
    private LocalDate requestedDate;
    private BigDecimal availableQty;    // 可用库存
    private BigDecimal inTransitQty;    // 在途量
    private BigDecimal allocatedQty;    // 已分配
    private BigDecimal reservedQty;     // 预留
    private BigDecimal atpQty;         // ATP
    private boolean canFulfill;        // 是否可满足
    private LocalDate promisedDate;    // 承诺日期
}
```

---

## 4. 服务实现

### 4.1 核心方法

```java
@Service
public class ATPCalculator {

    public ATPResult calculateATP(ATPRequest request) {
        // 1. 查询可用库存
        BigDecimal availableQty = getAvailableQty(request.getMaterialCode(), request.getPlantCode());
        
        // 2. 查询在途量
        BigDecimal inTransitQty = getInTransitQty(request.getMaterialCode(), request.getPlantCode(), request.getRequestedDate());
        
        // 3. 查询已分配量
        BigDecimal allocatedQty = getAllocatedQty(request.getMaterialCode(), request.getPlantCode(), request.getRequestedDate());
        
        // 4. 查询预留量
        BigDecimal reservedQty = getReservedQty(request.getMaterialCode(), request.getPlantCode(), request.getRequestedDate());
        
        // 5. 计算 ATP
        BigDecimal atp = availableQty.add(inTransitQty).subtract(allocatedQty).subtract(reservedQty);
        
        // 6. 判断是否可满足
        boolean canFulfill = atp.compareTo(request.getRequestedQty()) >= 0;
        
        return ATPResult.builder()
            .materialCode(request.getMaterialCode())
            .requestedQty(request.getRequestedQty())
            .availableQty(availableQty)
            .inTransitQty(inTransitQty)
            .allocatedQty(allocatedQty)
            .reservedQty(reservedQty)
            .atpQty(atp)
            .canFulfill(canFulfill)
            .promisedDate(canFulfill ? request.getRequestedDate() : calculateFirstAvailableDate(request))
            .build();
    }

    private LocalDate calculateFirstAvailableDate(ATPRequest request) {
        // 计算何时有足够库存
        LocalDate date = request.getRequestedDate();
        BigDecimal neededQty = request.getRequestedQty();
        
        while (true) {
            BigDecimal futureInTransit = getInTransitQty(request.getMaterialCode(), request.getPlantCode(), date);
            if (futureInTransit.compareTo(neededQty) >= 0) {
                return date;
            }
            neededQty = neededQty.subtract(futureInTransit);
            date = date.plusDays(1);
        }
    }
}
```

---

## 5. 与 MRP 联动

### 5.1 事件驱动

```
库存变更 → 触发 MRP 重算 → 更新 ATP
```

### 5.2 实时同步

| 事件 | 处理 |
|------|------|
| 库存变更 | 更新 ATP 计算数据 |
| MRP 运行 | 更新预留量 |
| 销售订单确认 | 更新已分配量 |

---

## 6. 验收标准

| 场景 | 输入 | 预期输出 | 验收条件 |
|------|------|---------|----------|
| ATP 计算 | HJ-LA23, 2000件 | ATP=3840 | 与公式一致 |
| CTP 计算 | 同上 + 产能约束 | CTP=不可满足 | 约束判断正确 |
| 批量计算 | 10个物料 | 10个 ATP 结果 | 无遗漏 |

---

## 7. 风险与应对

| 风险 | 应对措施 |
|------|----------|
| 库存数据延迟 | 实时同步 + 对账机制 |
| 并发更新冲突 | 乐观锁 |
| 性能瓶颈 | 缓存 + 异步计算 |

---

> **文档版本**: v1.0  
> **最后更新**: 2026-02-14  
> **状态**: 待评审
