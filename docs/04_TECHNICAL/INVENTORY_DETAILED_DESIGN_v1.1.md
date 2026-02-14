# 库存与仓储模块详细设计 v1.1

**文档版本**: v1.1  
**状态**: Draft  
**生效日期**: 2026-02-14  
**适用范围**: HJ_SCM 平台库存管理模块  

---

## 1. 模块概述

### 1.1 功能范围

| 功能点 | 优先级 | 说明 |
|--------|--------|------|
| 多级库存视图 | P0 | 工厂仓/在途/寄售/退回 |
| 安全库存策略 | P0 | 动态安全库存计算 |
| ABC-XYZ 分类 | P0 | 物料分类与管控策略 |
| 呆滞预警 | P0 | 库龄/周转率监控 |
| ATP/CTP 计算 | P0 | 可承诺量/可承诺能力计算 |
| MRP 联动 | P0 | 与 MRP 引擎实时交互 |
| 批次/序列号追溯 | P1 | 全链路追溯支持 |
| 库位策略 | P1 | 智能库位分配 |

### 1.2 业务背景

| 业务场景 | 痛点 | 解决方案 |
|----------|------|----------|
| 圣诞旺季 | HJ-LA23 经常缺料 | 安全库存动态调整 |
| Bühler 断供 | 原材料波动大 | ABC-XYZ 分类管控 |
| 医养追溯 | 批次追溯要求 | 全链路 Trace ID 关联 |
| MTO 订单 | 齐套率低 | ATP 实时计算 + 齐套检查 |

### 1.3 设计原则

| 原则 | 说明 |
|------|------|
| Single Source of Truth | 库存余额表为唯一准确数据源 |
| Exception-Driven | 仅输出异常（缺料/呆滞/超储） |
| Real-time Sync | 库存变更实时同步 MRP/采购 |
| Configurable | 支持多种库存策略配置 |

---

## 2. 数据架构

### 2.1 核心表结构

#### 2.1.1 库存余额表（Snapshot）

```sql
-- 库存余额表（按物料+仓库+日期快照）
CREATE TABLE inventory_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 维度
    material_code VARCHAR(50) NOT NULL,
    plant_code VARCHAR(20) NOT NULL,
    warehouse_code VARCHAR(50) NOT NULL,
    as_of_date DATE NOT NULL,
    
    -- 数量
    on_hand_qty DECIMAL(18,6) DEFAULT 0,      -- 现有量
    reserved_qty DECIMAL(18,6) DEFAULT 0,     -- 预留量
    available_qty DECIMAL(18,6),               -- 可用量
    in_transit_qty DECIMAL(18,6) DEFAULT 0,   -- 在途量
    on_hold_qty DECIMAL(18,6) DEFAULT 0,      -- 冻结量
    consignment_qty DECIMAL(18,6) DEFAULT 0,  -- 寄售量
    
    -- 批次信息
    batch_count INTEGER DEFAULT 0,             -- 批次数
    oldest_batch_date DATE,                    -- 最老批次日期
    
    -- Trace ID
    trace_id UUID,
    
    -- 审计
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(material_code, plant_code, warehouse_code, as_of_date)
);

-- 索引
CREATE INDEX idx_balances_mat_plant 
    ON inventory_balances(material_code, plant_code);
CREATE INDEX idx_balances_date 
    ON inventory_balances(as_of_date);
CREATE INDEX idx_balances_available 
    ON inventory_balances(available_qty) 
    WHERE available_qty > 0;
```

#### 2.1.2 库存批次表

```sql
-- 库存批次表
CREATE TABLE inventory_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 批次标识
    batch_no VARCHAR(100) NOT NULL,
    material_code VARCHAR(50) NOT NULL,
    plant_code VARCHAR(20) NOT NULL,
    warehouse_code VARCHAR(50) NOT NULL,
    location_code VARCHAR(50),                -- 库位
    
    -- 批次属性
    quantity DECIMAL(18,6) NOT NULL,
    unit_code VARCHAR(20) DEFAULT 'PCS',
    manufacture_date DATE,
    expiry_date DATE,                          -- 有效期（医养追溯关键）
    mfg_batch_no VARCHAR(100),                 -- 供应商批次号
    
    -- 批次状态
    status VARCHAR(20) DEFAULT 'AVAILABLE',   -- AVAILABLE/FROZEN/HOLD/CONSUMED
    quality_status VARCHAR(20),                -- 质检状态
    
    -- Trace ID
    trace_id UUID,
    
    -- 审计
    received_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    
    UNIQUE(batch_no, material_code, warehouse_code)
);

-- 索引
CREATE INDEX idx_batches_mat_ware 
    ON inventory_batches(material_code, warehouse_code);
CREATE INDEX idx_batches_batch 
    ON inventory_batches(batch_no);
CREATE INDEX idx_batches_expiry 
    ON inventory_batches(expiry_date) 
    WHERE status = 'AVAILABLE';
CREATE INDEX idx_batches_trace 
    ON inventory_batches(trace_id);
```

#### 2.1.3 库存交易表（流水）

```sql
-- 库存交易流水表
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 交易信息
    trans_type VARCHAR(20) NOT NULL,          -- GR/GI/ST/ADJUST
    trans_code VARCHAR(50) NOT NULL,          -- 业务单据号
    material_code VARCHAR(50) NOT NULL,
    plant_code VARCHAR(20) NOT NULL,
    warehouse_code VARCHAR(50) NOT NULL,
    batch_no VARCHAR(100),
    
    -- 数量
    from_qty DECIMAL(18,6),
    to_qty DECIMAL(18,6),
    trans_qty DECIMAL(18,6) NOT NULL,         -- 变动数量（正/负）
    
    -- 前后状态
    before_qty DECIMAL(18,6) NOT NULL,
    after_qty DECIMAL(18,6) NOT NULL,
    
    -- 关联
    source_doc_type VARCHAR(20),              -- 来源单据类型
    source_doc_id VARCHAR(50),                 -- 来源单据号
    trace_id UUID,
    
    -- 审计
    trans_at TIMESTAMP DEFAULT NOW(),
    trans_by UUID,
    remark VARCHAR(500)
);

-- 索引
CREATE INDEX idx_trans_mat_date 
    ON inventory_transactions(material_code, trans_at);
CREATE INDEX idx_trans_batch 
    ON inventory_transactions(batch_no);
CREATE INDEX idx_trans_doc 
    ON inventory_transactions(source_doc_type, source_doc_id);
CREATE INDEX idx_trans_trace 
    ON inventory_transactions(trace_id);
```

#### 2.1.4 安全库存策略表

```sql
-- 安全库存策略配置
CREATE TABLE safety_stock_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    material_code VARCHAR(50) NOT NULL,
    plant_code VARCHAR(20) NOT NULL,
    
    -- 安全库存参数
    safety_stock_qty DECIMAL(18,6),           -- 安全库存量
    min_stock_qty DECIMAL(18,6),              -- 最低库存量
    max_stock_qty DECIMAL(18,6),              -- 最高库存量
    
    -- 计算参数
    service_level DECIMAL(5,4),               -- 服务水平（95%→0.95）
    lead_time_days INTEGER,                   -- 提前期
    demand_std_dev DECIMAL(18,6),             -- 需求标准差
    
    -- ABC-XYZ 分类
    abc_class VARCHAR(1),                      -- A/B/C
    xyz_class VARCHAR(1),                     -- X/Y/Z
    
    -- 策略
    replenishment_type VARCHAR(20),            -- FIXED/VARIABLE
    review_period_days INTEGER,               -- 盘点周期
    
    -- 审计
    effective_from DATE,
    effective_to DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID,
    
    UNIQUE(material_code, plant_code, effective_from)
);
```

---

## 3. 核心算法

### 3.1 安全库存计算

```java
/**
 * 安全库存计算服务
 * 
 * 公式：SS = Zα × σ × √L
 * 
 * 其中：
 * - Zα: 服务水平系数 (95% → 1.645, 99% → 2.326)
 * - σ: 需求标准差（日需求波动）
 * - L: 提前期（天）
 */
@Service
public class SafetyStockCalculator {
    
    /**
     * 计算安全库存
     */
    public BigDecimal calculateSafetyStock(
            String materialCode, 
            String plantCode,
            Double serviceLevel) {
        
        // 1. 获取参数
        SafetyStockConfig config = getConfig(materialCode, plantCode);
        
        // 2. 获取历史需求数据
        List<DailyDemand> history = getDailyDemandHistory(
            materialCode, plantCode, 90);  // 90天历史
        
        // 3. 计算日需求标准差
        Double stdDev = calculateStdDev(history);
        
        // 4. 获取提前期
        Integer leadTime = getLeadTime(materialCode, plantCode);
        
        // 5. 计算 Z 值
        Double zValue = getZValue(serviceLevel);
        
        // 6. 计算安全库存
        BigDecimal safetyStock = BigDecimal.valueOf(zValue)
            .multiply(BigDecimal.valueOf(stdDev))
            .multiply(BigDecimal.valueOf(Math.sqrt(leadTime)));
        
        return safetyStock;
    }
    
    /**
     * 动态安全库存（考虑季节性）
     */
    public BigDecimal calculateDynamicSafetyStock(
            String materialCode,
            String plantCode,
            LocalDate targetDate) {
        
        // 1. 获取基础安全库存
        BigDecimal baseSS = calculateSafetyStock(
            materialCode, plantCode, 0.95);
        
        // 2. 计算季节性因子
        Double seasonalFactor = calculateSeasonalFactor(
            materialCode, targetDate.getMonthValue());
        
        // 3. 考虑促销因子
        Double promotionFactor = getPromotionFactor(
            materialCode, targetDate);
        
        // 4. 动态调整
        return baseSS.multiply(BigDecimal.valueOf(seasonalFactor))
            .multiply(BigDecimal.valueOf(promotionFactor));
    }
}
```

### 3.2 ABC-XYZ 分类算法

```java
/**
 * ABC-XYZ 分类服务
 * 
 * ABC 分类：按年度消耗金额占比
 * X/Y/Z 分类：按需求波动系数
 */
@Service
public class ABCXYZClassifier {
    
    /**
     * 执行 ABC-XYZ 分类
     */
    public List<MaterialClassification> classify(List<String> materialCodes) {
        List<MaterialClassification> results = new ArrayList<>();
        
        // 1. 获取年度消耗金额
        Map<String, BigDecimal> annualValue = calculateAnnualConsumption(materialCodes);
        
        // 2. ABC 分类
        Map<String, String> abcMap = calculateABCClassification(annualValue);
        
        // 3. XYZ 分类
        Map<String, String> xyzMap = calculateXYZClassification(materialCodes);
        
        // 4. 合并结果
        for (String code : materialCodes) {
            MaterialClassification mc = new MaterialClassification();
            mc.setMaterialCode(code);
            mc.setAbcClass(abcMap.getOrDefault(code, "C"));
            mc.setXyzClass(xyzMap.getOrDefault(code, "Y"));
            mc.setAnnualValue(annualValue.getOrDefault(code, BigDecimal.ZERO));
            
            // 计算综合分类
            mc.setCombinedClass(calculateCombinedClass(
                mc.getAbcClass(), mc.getXyzClass()));
            
            results.add(mc);
        }
        
        return results;
    }
    
    /**
     * ABC 分类（帕累托法则）
     * A类：累计金额占比 0-80%
     * B类：累计金额占比 80-95%
     * C类：累计金额占比 95-100%
     */
    private Map<String, String> calculateABCClassification(
            Map<String, BigDecimal> annualValue) {
        
        // 1. 按金额排序
        List<Map.Entry<String, BigDecimal>> sorted = annualValue.entrySet()
            .stream()
            .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
            .collect(Collectors.toList());
        
        // 2. 计算累计占比
        BigDecimal total = sorted.stream()
            .map(Map.Entry::getValue)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal cumulative = BigDecimal.ZERO;
        Map<String, String> result = new HashMap<>();
        
        for (Map.Entry<String, BigDecimal> entry : sorted) {
            cumulative = cumulative.add(entry.getValue());
            BigDecimal pct = cumulative.divide(total, 4, RoundingMode.HALF_UP);
            
            if (pct.doubleValue() <= 0.80) {
                result.put(entry.getKey(), "A");
            } else if (pct.doubleValue() <= 0.95) {
                result.put(entry.getKey(), "B");
            } else {
                result.put(entry.getKey(), "C");
            }
        }
        
        return result;
    }
    
    /**
     * XYZ 分类（需求波动系数）
     * X类：CV ≤ 0.5（稳定）
     * Y类：0.5 < CV ≤ 1.0（波动）
     * Z类：CV > 1.0（很不稳定）
     */
    private Map<String, String> calculateXYZClassification(
            List<String> materialCodes) {
        
        Map<String, String> result = new HashMap<>();
        
        for (String code : materialCodes) {
            // 获取月度需求数据
            List<MonthlyDemand> demands = getMonthlyDemand(code, 12);
            
            // 计算变异系数 CV = 标准差 / 平均值
            Double cv = calculateCoefficientOfVariation(demands);
            
            if (cv <= 0.5) {
                result.put(code, "X");
            } else if (cv <= 1.0) {
                result.put(code, "Y");
            } else {
                result.put(code, "Z");
            }
        }
        
        return result;
    }
    
    /**
     * 综合分类策略
     */
    private String calculateCombinedClass(String abc, String xyz) {
        // AX, AY, BX, BY → 高优先级（精细管理）
        // AZ, BZ, CX, CY → 中优先级（常规管理）
        // CZ → 低优先级（简化管理）
        
        if (abc.equals("A") && !xyz.equals("Z")) {
            return "HIGH";
        } else if (abc.equals("B") || xyz.equals("X")) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }
}
```

### 3.3 ATP 计算算法

```java
/**
 * ATP（可承诺量）计算服务
 */
@Service
public class ATPCalculator {
    
    /**
     * 计算 ATP
     * 
     * ATP = 可用库存 + 在途量 - 已分配量 - 预留量
     */
    public ATPResult calculateATP(
            String materialCode,
            String plantCode,
            LocalDate checkDate,
            BigDecimal requestedQty) {
        
        // 1. 查询可用库存
        BigDecimal availableQty = inventoryRepository
            .getAvailableQty(materialCode, plantCode);
        
        // 2. 查询在途量（需求日期之前的采购订单）
        BigDecimal inTransitQty = purchaseOrderRepository
            .getInTransitQty(materialCode, plantCode, checkDate);
        
        // 3. 查询已分配量（已承诺给其他订单）
        BigDecimal allocatedQty = salesOrderRepository
            .getAllocatedQty(materialCode, plantCode, checkDate);
        
        // 4. 查询预留量（MRP 预留）
        BigDecimal reservedQty = mrpRepository
            .getReservedQty(materialCode, plantCode, checkDate);
        
        // 5. 计算 ATP
        BigDecimal atp = availableQty
            .add(inTransitQty)
            .subtract(allocatedQty)
            .subtract(reservedQty);
        
        // 6. 判断是否可满足
        boolean canFulfill = atp.compareTo(requestedQty) >= 0;
        
        // 7. 计算最早可承诺日期
        LocalDate promisedDate = canFulfill 
            ? checkDate 
            : calculateFirstAvailableDate(materialCode, plantCode, requestedQty);
        
        return ATPResult.builder()
            .materialCode(materialCode)
            .plantCode(plantCode)
            .requestedDate(checkDate)
            .requestedQty(requestedQty)
            .availableQty(availableQty)
            .inTransitQty(inTransitQty)
            .allocatedQty(allocatedQty)
            .reservedQty(reservedQty)
            .atpQty(atp)
            .canFulfill(canFulfill)
            .promisedDate(promisedDate)
            .traceId(generateTraceId())
            .build();
    }
    
    /**
     * CTP（可承诺能力）计算
     * 考虑产能约束
     */
    public CTPResult calculateCTP(
            String materialCode,
            String plantCode,
            LocalDate requestedDate,
            BigDecimal requestedQty) {
        
        // 1. 计算产能可用量
        CapacityResult capacity = capacityService
            .getAvailableCapacity(plantCode, requestedDate);
        
        // 2. 计算物料可用量
        ATPResult atp = calculateATP(
            materialCode, plantCode, requestedDate, requestedQty);
        
        // 3. 判断约束类型
        String constraintType;
        if (!atp.isCanFulfill()) {
            constraintType = "MATERIAL";
        } else if (capacity.getAvailableCapacity().compareTo(requestedQty) < 0) {
            constraintType = "CAPACITY";
        } else {
            constraintType = "NONE";
        }
        
        return CTPResult.builder()
            .materialCode(materialCode)
            .requestedDate(requestedDate)
            .requestedQty(requestedQty)
            .atpResult(atp)
            .capacityResult(capacity)
            .constraintType(constraintType)
            .canFulfill("NONE".equals(constraintType))
            .build();
    }
}
```

### 3.4 呆滞检测算法

```java
/**
 * 呆滞检测服务
 */
@Service
public class StagnationDetector {
    
    /**
     * 检测呆滞风险
     */
    public StagnationResult detect(String materialCode, String plantCode) {
        StagnationResult result = new StagnationResult();
        result.setMaterialCode(materialCode);
        result.setPlantCode(plantCode);
        
        // 1. 计算库龄
        Integer daysInStock = calculateDaysInStock(materialCode, plantCode);
        result.setDaysInStock(daysInStock);
        
        // 2. 计算周转率
        Double turnoverRate = calculateTurnoverRate(materialCode, plantCode);
        result.setTurnoverRate(turnoverRate);
        
        // 3. 计算无移动天数
        Integer daysNoMovement = calculateDaysNoMovement(materialCode, plantCode);
        result.setDaysNoMovement(daysNoMovement);
        
        // 4. 计算呆滞风险评分
        Integer riskScore = calculateRiskScore(
            daysInStock, turnoverRate, daysNoMovement);
        result.setRiskScore(riskScore);
        
        // 5. 判断风险等级
        String riskLevel = riskScore >= 70 ? "HIGH" 
            : riskScore >= 40 ? "MEDIUM" : "LOW";
        result.setRiskLevel(riskLevel);
        
        // 6. 生成处置建议
        result.setRecommendations(generateRecommendations(riskLevel));
        
        return result;
    }
    
    /**
     * 呆滞风险评分
     * 评分规则（满分100）：
     * - 库龄 > 180天：30分
     * - 库龄 > 90天：20分
     * - 周转率 < 2：30分
     * - 周转率 < 5：15分
     * - 无移动 > 60天：40分
     * - 无移动 > 30天：20分
     */
    private Integer calculateRiskScore(
            Integer daysInStock, 
            Double turnoverRate, 
            Integer daysNoMovement) {
        
        int score = 0;
        
        // 库龄评分
        if (daysInStock > 180) score += 30;
        else if (daysInStock > 90) score += 20;
        
        // 周转率评分
        if (turnoverRate < 2) score += 30;
        else if (turnoverRate < 5) score += 15;
        
        // 无移动评分
        if (daysNoMovement > 60) score += 40;
        else if (daysNoMovement > 30) score += 20;
        
        return score;
    }
}
```

---

## 4. MRP 联动机制

### 4.1 实时库存同步

```java
/**
 * 库存变更事件发布
 */
@Service
public class InventoryChangePublisher {
    
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    /**
     * 发布库存变更事件
     */
    public void publishChange(InventoryChange change) {
        // 1. 更新库存余额
        updateBalance(change);
        
        // 2. 记录交易流水
        recordTransaction(change);
        
        // 3. 发布事件（供 MRP 订阅）
        InventoryChangeEvent event = InventoryChangeEvent.builder()
            .materialCode(change.getMaterialCode())
            .plantCode(change.getPlantCode())
            .changeQty(change.getTransQty())
            .changeType(change.getTransType())
            .afterQty(change.getAfterQty())
            .traceId(change.getTraceId())
            .occurredAt(LocalDateTime.now())
            .build();
        
        eventPublisher.publishEvent(event);
    }
}

/**
 * MRP 监听库存变更
 */
@Component
public class MrpInventoryListener {
    
    @Autowired
    private MrpEngineService mrpEngine;
    
    /**
     * 监听库存变更，触发 MRP 重算
     */
    @EventListener
    public void onInventoryChange(InventoryChangeEvent event) {
        // 仅关键变更触发 MRP 重算
        if (isCriticalChange(event)) {
            mrpEngine.triggerRerun(event.getMaterialCode());
        }
    }
    
    private boolean isCriticalChange(InventoryChangeEvent event) {
        // 库存低于安全库存
        BigDecimal safetyStock = getSafetyStock(
            event.getMaterialCode(), event.getPlantCode());
        
        return event.getAfterQty().compareTo(safetyStock) < 0;
    }
}
```

### 4.2 MRP 库存查询接口

```java
/**
 * MRP 库存查询服务
 */
@Service
public class MrpInventoryQueryService {
    
    /**
     * 获取 MRP 所需库存数据
     */
    public MrpInventoryData getDataForMrp(
            String materialCode, 
            String plantCode,
            LocalDate fromDate,
            LocalDate toDate) {
        
        return MrpInventoryData.builder()
            // 现有库存
            .onHand(getOnHand(materialCode, plantCode))
            // 安全库存
            .safetyStock(getSafetyStock(materialCode, plantCode))
            // 在途
            .inTransit(getInTransit(materialCode, plantCode, fromDate, toDate))
            // 预留
            .reserved(getReserved(materialCode, plantCode))
            // 需求预测
            .forecast(getForecast(materialCode, plantCode, fromDate, toDate))
            // 订单需求
            .orders(getOrderDemand(materialCode, plantCode, fromDate, toDate))
            .build();
    }
}
```

---

## 5. UI 视图设计

### 5.1 多级库存概览视图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           库存概览 - HJ-LA23                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  【库存余额卡片】                                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │  工厂仓         │ │  在途           │ │  寄售           │               │
│  │  3,840 件      │ │  1,200 件      │ │  800 件        │               │
│  │  [图表趋势]    │ │  [预计到货 2天] │ │  [供应商代管]  │               │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘               │
│                                                                              │
│  【ATP 检查】                                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  物料：HJ-LA23    请求量：2,000 件    需求日期：2026-02-20         │    │
│  │                                                                     │    │
│  │  可用量：3,840 + 在途：1,200 = 5,040 件    ✅ 可满足                │    │
│  │  最早承诺日期：2026-02-15                                           │    │
│  │  [重新计算]                                                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  【ABC-XYZ 分类】                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  分类：A类（金额占比 65%）  │  X类（需求稳定 CV=0.3）              │    │
│  │  优先级：高  │  策略：精细管控  │  安全库存：500 件                    │    │
│  │                                                                     │    │
│  │  [调整参数]                                                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  【呆滞预警】                                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  🔴 低风险                                                          │    │
│  │  库龄：15天  │  周转率：8.5次/年  │  无移动：0天                      │    │
│  │                                                                     │    │
│  │  建议：库存健康，无需处理                                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  【批次列表】                                                                │
│  ┌──────────┬──────────┬──────────┬──────────┬─────────────────────┐      │
│  │ 批次号   │ 数量     │ 库位     │ 库龄     │ 状态                │      │
│  ├──────────┼──────────┼──────────┼──────────┼─────────────────────┤      │
│  │ BATCH-001│ 1,000    │ A-01-02  │ 5天      │ ✅ 可用              │      │
│  │ BATCH-002│ 1,500    │ A-01-03  │ 12天     │ ✅ 可用              │      │
│  │ BATCH-003│ 1,340    │ A-02-01  │ 3天      │ ✅ 可用              │      │
│  └──────────┴──────────┴──────────┴──────────┴─────────────────────┘      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 库存分析视图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           库存分析                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  【ABC 分布图】                         【XYZ 分布图】                        │
│  ┌──────────────────────────┐          ┌──────────────────────────┐        │
│  │                          │          │                          │        │
│  │      A类 15%            │          │      X类 45%            │        │
│  │      ████████████      │          │      ████████████████   │        │
│  │                          │          │                          │        │
│  │      B类 25%            │          │      Y类 35%            │        │
│  │      ████████████      │          │      ████████████      │        │
│  │                          │          │                          │        │
│  │      C类 60%            │          │      Z类 20%            │        │
│  │      ████████████      │          │      ████████████      │        │
│  │                          │          │                          │        │
│  └──────────────────────────┘          └──────────────────────────┘        │
│                                                                              │
│  【库龄分布】                              【周转趋势】                        │
│  ┌──────────────────────────┐          ┌──────────────────────────┐        │
│  │ 0-30天 ████████████ 60% │          │  10 │  ╱─                 │        │
│  │ 31-60天 ████ 20%       │          │   8 │ ╱                    │        │
│  │ 61-90天 ██ 10%         │          │   6 │╱                     │        │
│  │ >90天  █ 10%           │          │   4 │                      │        │
│  │                          │          │   2 └─────────────────── │        │
│  └──────────────────────────┘          └──────────────────────────┘        │
│                                                                              │
│  【呆滞预警清单】                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  物料        │ 库龄   │ 周转率 │ 风险分 │ 建议措施                    │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │ HJ-M05-OLD  │ 183天 │ 0.3    │ 88     │ [促销] [转移] [报废]       │    │
│  │ HJ-LA15-EX  │ 47天  │ 0.7    │ 52     │ [促销] [转移]              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. 验收标准

### 6.1 功能验收

| 场景 | 输入 | 预期输出 | 验收条件 |
|------|------|---------|----------|
| 库存余额查询 | HJ-LA23, 青岛 | 正确余额 | 误差 < 0.01% |
| ATP 计算 | 请求 2000 件 | 可承诺量 | 与公式一致 |
| 安全库存计算 | 95%服务水平 | 正确 SS | 与公式一致 |
| ABC-XYZ 分类 | 全部物料 | 分类结果 | 占比正确 |
| 呆滞检测 | 呆滞物料 | 风险评分 | 无漏检 |
| MRP 联动 | 库存变更 | MRP 触发 | 实时响应 |
| 批次追溯 | 批次号 | 完整链路 | 100% 可追溯 |

### 6.2 性能验收

| 指标 | 目标值 | 测量方法 |
|------|--------|----------|
| 库存查询 | < 100ms | API 响应时间 |
| ATP 计算 | < 200ms | 单次调用 |
| ABC-XYZ 分类 | < 10s | 全量分类 |
| 呆滞检测 | < 5s | 全量检测 |
| 并发查询 | 100 QPS | 压力测试 |

---

## 7. 风险与应对

### 7.1 技术风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 数据不一致 | 中 | 高 | 事务保证 + 对账 |
| 性能瓶颈 | 中 | 中 | 缓存 + 索引优化 |
| 并发超卖 | 低 | 高 | 乐观锁 |

### 7.2 数据风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 批次数据缺失 | 中 | 高 | 入库强校验 |
| 历史数据不完整 | 中 | 中 | 数据迁移脚本 |
| 负库存 | 低 | 高 | 预扣逻辑 |

### 7.3 业务风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 安全库存不准 | 中 | 中 | 定期回顾 |
| 分类不合理 | 低 | 中 | 人工审核 |

---

## 8. 测试用例

### 8.1 单元测试

```java
@ExtendWith(MockitoExtension.class)
class SafetyStockCalculatorTest {
    
    @Mock
    private SafetyStockConfigRepository configRepository;
    
    @InjectMocks
    private SafetyStockCalculator calculator;
    
    @Test
    void testCalculateSafetyStock() {
        // Given
        when(configRepository.findByMaterialCodeAndPlantCode("HJ-LA23", "QINGDAO"))
            .thenReturn(createConfig(30, 0.95));
        
        // When
        BigDecimal result = calculator.calculateSafetyStock(
            "HJ-LA23", "QINGDAO", 0.95);
        
        // Then
        assertNotNull(result);
        assertTrue(result.compareTo(BigDecimal.ZERO) > 0);
    }
}
```

### 8.2 集成测试

```java
@SpringBootTest
@DirtiesContext
class InventoryIntegrationTest {
    
    @Autowired
    private InventoryService inventoryService;
    
    @Test
    void testATPWithMrpIntegration() {
        // 1. 创建库存
        createInventory("HJ-LA23", "QINGDAO", 5000);
        
        // 2. 创建 MRP 预留
        createMrpReservation("HJ-LA23", "QINGDAO", 1000);
        
        // 3. 计算 ATP
        ATPResult atp = inventoryService.calculateATP(
            "HJ-LA23", "QINGDAO", LocalDate.now(), 2000);
        
        // 4. 验证
        assertTrue(atp.getAtpQty().compareTo(BigDecimal.valueOf(4000)) == 0);
        assertTrue(atp.isCanFulfill());
    }
}
```

---

## 附录

### A. 术语表

| 术语 | 说明 |
|------|------|
| ATP | 可承诺量 (Available to Promise) |
| CTP | 可承诺能力 (Capable to Promise) |
| SS | 安全库存 (Safety Stock) |
| MOQ | 最小订购量 (Minimum Order Quantity) |
| Lead Time | 提前期 |
| CV | 变异系数 (Coefficient of Variation) |

### B. 相关文档

| 文档 | 路径 |
|------|------|
| MRP 引擎规范 | `docs/04_TECHNICAL/MRP_ENGINE_SPEC_v1.0.md` |
| Trace ID 规范 | `docs/04_TECHNICAL/TRACE_ID_SPECIFICATION_v1.1.md` |
| 状态机设计 | `docs/04_TECHNICAL/CORE_STATE_MACHINE_v1.0.md` |

---

> **文档版本**: v1.1  
> **最后更新**: 2026-02-14  
> **状态**: 待评审
