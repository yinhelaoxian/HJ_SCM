# 库存与仓储模块详细设计

**文档版本**: v1.0  
**状态**: Draft  
**生效日期**: 2026-02-14  
**适用范围**: HJ_SCM 平台库存管理模块  

---

## 1. 模块概述

### 1.1 功能范围

| 功能点 | 优先级 | 说明 |
|--------|--------|------|
| 多级库存视图 | P0 | 工厂仓/在途/寄售/退回 |
| 批次追踪 | P0 | 批次/LPN/序列号 |
| 呆滞预警 | P1 | 库龄/周转率监控 |
| ATP/CTP计算 | P0 | 可承诺量计算 |
| 库位策略 | P1 | 智能库位分配 |

---

## 2. 核心表结构

### 2.1 库存批次表

```sql
CREATE TABLE inventory_batches (
    id UUID PRIMARY KEY,
    batch_number VARCHAR(100) NOT NULL,    -- 批次号
    material_id UUID NOT NULL,              -- 物料ID
    warehouse_id UUID NOT NULL,             -- 仓库ID
    location_id UUID,                        -- 库位ID
    quantity DECIMAL(18,6) NOT NULL,       -- 数量
    unit_code VARCHAR(20),                  -- 单位
    expiry_date DATE,                       -- 有效期
    manufacture_date DATE,                  -- 生产日期
    trace_id UUID,                          -- Trace ID
    status VARCHAR(20) DEFAULT 'AVAILABLE',-- 状态
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by UUID,
    version INTEGER DEFAULT 1
);

CREATE INDEX idx_batches_material ON inventory_batches(material_id);
CREATE INDEX idx_batches_warehouse ON inventory_batches(warehouse_id);
CREATE INDEX idx_batches_batch ON inventory_batches(batch_number);
CREATE INDEX idx_batches_trace ON inventory_batches(trace_id);
```

### 2.2 库存余额表

```sql
CREATE TABLE inventory_balances (
    id UUID PRIMARY KEY,
    material_id UUID NOT NULL,
    warehouse_id UUID NOT NULL,
    quantity DECIMAL(18,6) NOT NULL,
    reserved_qty DECIMAL(18,6) DEFAULT 0,  -- 预留数量
    available_qty DECIMAL(18,6),           -- 可用数量
    trace_id UUID,
    as_of_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(material_id, warehouse_id, as_of_date)
);
```

---

## 3. 核心算法

### 3.1 ATP 计算逻辑

```typescript
class ATPService {
  async calculateATP(
    materialId: string,
    requestedQty: number,
    requestedDate: Date
  ): Promise<ATPResult> {
    // 1. 查询可用库存
    const available = await this.getAvailableStock(materialId);
    
    // 2. 查询在途库存
    const inTransit = await this.getInTransitStock(materialId, requestedDate);
    
    // 3. 查询预留需求
    const reserved = await this.getReservedDemand(materialId, requestedDate);
    
    // 4. 计算 ATP
    const atp = available + inTransit - reserved - requestedQty;
    
    return {
      material_id: materialId,
      requested_qty: requestedQty,
      requested_date: requestedDate,
      available_stock: available,
      in_transit: inTransit,
      reserved: reserved,
      atp_quantity: Math.max(0, atp),
      can_fulfill: atp >= requestedQty
    };
  }
}
```

### 3.2 呆滞预警算法

```typescript
class StagnationDetector {
  detectStagnation(materialId: string): StagnationResult {
    const config = this.getStagnationConfig();
    
    // 1. 计算库龄
    const daysInStock = this.calculateDaysInStock(materialId);
    
    // 2. 计算周转率
    const turnoverRate = this.calculateTurnoverRate(materialId);
    
    // 3. 计算无移动天数
    const daysNoMovement = this.calculateDaysNoMovement(materialId);
    
    // 4. 综合评估
    const riskScore = 
      (daysInStock > config.maxDaysInStock ? 30 : 0) +
      (turnoverRate < config.minTurnoverRate ? 30 : 0) +
      (daysNoMovement > config.maxDaysNoMovement ? 40 : 0);
    
    return {
      material_id: materialId,
      risk_score: riskScore,
      risk_level: riskScore > 70 ? 'HIGH' : riskScore > 40 ? 'MEDIUM' : 'LOW',
      days_in_stock: daysInStock,
      turnover_rate: turnoverRate,
      days_no_movement: daysNoMovement,
      recommendations: this.generateRecommendations(riskScore)
    };
  }
}
```

---

## 4. 批次追踪实现

### 4.1 正向追溯

```typescript
async traceForward(batchId: string): Promise<TraceNode[]> {
  // 批次 → 入库记录 → 生产工单 → 销售订单
  const trace: TraceNode[] = [];
  
  // 1. 获取批次入库记录
  const gr = await this.getGRByBatch(batchId);
  if (gr) trace.push({ type: 'GR', id: gr.id, date: gr.created_at });
  
  // 2. 获取关联的生产工单
  const mo = await this.getMOByGR(gr.id);
  if (mo) trace.push({ type: 'MO', id: mo.id, date: mo.created_at });
  
  // 3. 获取关联的销售订单
  const so = await this.getSOByMO(mo.id);
  if (so) trace.push({ type: 'SO', id: so.id, date: so.created_at });
  
  return trace;
}
```

---

**文档维护**: 后端工程师  
**当前版本**: v1.0  
**更新日期**: 2026-02-14
