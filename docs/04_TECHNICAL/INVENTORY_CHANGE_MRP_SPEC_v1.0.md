# 库存变更服务与 MRP 联动设计 v1.0

**文档版本**: v1.0  
**状态**: Draft  
**生效日期**: 2026-02-14  
**适用范围**: HJ_SCM 库存模块  

---

## 1. 概述

### 1.1 功能范围

| 功能 | 说明 |
|------|------|
| 库存变更处理 | 入库/出库/调整 |
| 交易记录 | 完整流水记录 |
| 事件发布 | 触发下游系统 |
| MRP 联动 | 关键变更触发重算 |

---

## 2. 业务流程

### 2.1 库存变更流程

```
┌─────────────────────────────────────────────────────────────┐
│                  库存变更处理流程                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐                                              │
│  │ 接收变更 │ 业务单据触发                                 │
│  └────┬────┘                                              │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────┐                                              │
│  │ 更新余额 │ 实时更新库存余额                             │
│  └────┬────┘                                              │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────┐                                              │
│  │ 记录流水 │ 完整交易流水                                 │
│  └────┬────┘                                              │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────┐                                              │
│  │ 发布事件 │ 异步通知 MRP                                 │
│  └────┬────┘                                              │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────┐                                              │
│  │ MRP 重算 │ 关键变更触发                                │
│  └──────────┘                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 变更类型

### 3.1 变更类型定义

| 类型 | 代码 | 说明 |
|------|------|------|
| 收货 | GR | 采购订单收货 |
| 发料 | GI | 生产领料 |
| 调整 | ADJUST | 库存调整 |
| 冻结 | FREEZE | 库存冻结 |
| 解冻 | UNFREEZE | 解除冻结 |
| 转移 | TRANSFER | 库位/工厂转移 |

---

## 4. 关键变更检测

### 4.1 触发 MRP 重算的变更

| 条件 | 说明 |
|------|------|
| 库存 < 安全库存 | 低于安全水位 |
| 库存变化 > 20% | 大幅波动 |
| 新增预留 | MRP 预留操作 |
| 批次失效 | 有效期到期 |

---

## 5. 事件设计

### 5.1 库存变更事件

```java
public class InventoryChangeEvent {
    private String materialCode;    // 物料编码
    private String plantCode;       // 工厂编码
    private BigDecimal changeQty;   // 变动数量
    private String changeType;     // 变更类型
    private BigDecimal afterQty;   // 变动后数量
    private String traceId;        // Trace ID
    private LocalDateTime occurredAt; // 发生时间
}
```

---

## 6. 服务接口

### 6.1 处理库存变更

```java
@Transactional
public InventoryBalance processChange(InventoryChange change) {
    // 1. 更新库存余额
    InventoryBalance balance = updateBalance(change);
    
    // 2. 记录交易流水
    recordTransaction(change);
    
    // 3. 发布变更事件
    publishChangeEvent(change, balance);
    
    // 4. 触发 MRP 重算（关键变更）
    if (isCriticalChange(change, balance)) {
        triggerMrpRerun(change.getMaterialCode());
    }
    
    return balance;
}
```

---

## 7. 验收标准

| 场景 | 验收条件 |
|------|----------|
| 余额更新 | 实时更新 |
| 流水记录 | 100% 完整 |
| 事件发布 | 异步通知 |
| MRP 触发 | 关键变更触发 |

---

> **文档版本**: v1.0  
> **最后更新**: 2026-02-14  
> **状态**: 待评审
