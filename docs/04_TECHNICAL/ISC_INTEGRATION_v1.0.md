# ISC 框架整合规范 v1.0

**版本**: v1.0  
**日期**: 2026-02-15  
**来源**: ISC 管理体系最佳实践  
**目标**: 豪江 SCM 项目架构升级

---

## 1. ISC 框架核心要素

### 1.1 分层计划体系

```
┌─────────────────────────────────────────────────────────┐
│                    战略层 STRATEGIC                      │
│  网络规划 | 产能投资 | 产品组合 | 财务约束               │
│  周期: 3-5 年 | 决策频率: 年度                         │
├─────────────────────────────────────────────────────────┤
│                    战术层 TACTICAL                       │
│  S&OP 产销协同 | MPS 主生产计划 | 需求计划              │
│  周期: 3-18 个月 | 决策频率: 月度/周度                 │
├─────────────────────────────────────────────────────────┤
│                    执行层 EXECUTIVE                       │
│  MRP 物料计划 | 采购执行 | 生产执行 | 物流交付           │
│  周期: 1-12 周 | 决策频率: 日度/周度                   │
└─────────────────────────────────────────────────────────┘
```

### 1.2 S&OP 指挥棒

```
预 S&OP → 数据准备 → 需求评审 → 供应评审 → S&OP 会议 → 计划下达

关键要素：
- 财务约束嵌入（预算、利润目标）
- 供需平衡 What-if 模拟
- 跨部门协同（销售/生产/采购/财务）
- 计划冻结机制（Time Fences）
```

### 1.3 MPS Time Fences

| 区域 | 时间范围 | 变更规则 | 业务含义 |
|------|----------|----------|----------|
| **Frozen** | 当前周 + 2-4 周 | 禁止变更 | 生产已执行 |
| **Slushy** | 第 5-12 周 | 有限变更 | 物料已采购 |
| **Liquid** | 第 13+ 周 | 灵活变更 | 计划可调整 |

### 1.4 MRP 净需求计算目标

| 目标 | 公式 | 说明 |
|------|------|------|
| **No Shortage** | 净需求 = 毛需求 - 在途 - 库存 | 不缺货 |
| **No Excess** | 建议订单 = 净需求 - 已订未交 | 不过剩 |
| **No Idle** | 产能利用率 = 计划产出 / 可用产能 | 不闲置 |

### 1.5 推拉结合模式

| 模式 | 适用场景 | 库存策略 |
|------|----------|----------|
| **MTS** (面向库存) | 标准化产品 | 高安全库存 |
| **MTO** (面向订单) | 定制化产品 | 按单采购 |
| **ETO** (面向工程) | 项目型业务 | 订单驱动 |

### 1.6 OTC Cycle（订单到现金）

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Contract │ → │ Forecast │ → │ Order    │ → │ Delivery │ → │ Cash    │
│ 合同签订  │   │ 需求预测  │   │ 订单录入  │   │ 交付执行  │   │ 收款核销  │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
     ↓              ↓              ↓              ↓              ↓
  商机管理       预测准确率      OTIF 率        准时交付       DSO 天数
```

### 1.7 风险三道防线

```
┌─────────────────────────────────────────────────────────┐
│ 第一道防线：预测准确率                                    │
│ - 需求感知（短期修正）                                    │
│ - 促销事件管理                                           │
│ - 多渠道数据整合                                         │
├─────────────────────────────────────────────────────────┤
│ 第二道防线：安全库存                                     │
│ - ABC-XYZ 分类                                           │
│ - 动态安全库存计算                                       │
│ - 多级库存优化                                           │
├─────────────────────────────────────────────────────────┤
│ 第三道防线：执行敏捷                                     │
│ - 齐套分析                                               │
│ - 供应商协同                                             │
│ - 异常预警                                               │
└─────────────────────────────────────────────────────────┘
```

### 1.8 价值金字塔（BOM/MD 匹配）

```
┌─────────────────────────────────────────────────────────┐
│                    价值金字塔                             │
├─────────────────────────────────────────────────────────┤
│ L1: 产品家族 (Product Family)                            │
│     - 收入贡献分析                                        │
│     - 战略优先级                                          │
├─────────────────────────────────────────────────────────┤
│ L2: 产品线 (Product Line)                               │
│     - 毛利率分析                                          │
│     - 产能占用                                            │
├─────────────────────────────────────────────────────────┤
│ L3: 产品 (Product)                                      │
│     - 销量排名                                            │
│     - 库存周转                                            │
├─────────────────────────────────────────────────────────┤
│ L4: 物料 (Material/BOM)                                 │
│     - 成本结构                                            │
│     - 供应商依赖                                          │
└─────────────────────────────────────────────────────────┘
```

### 1.9 SCOR 模型映射

| SCOR 流程 | 豪江模块 | 关键指标 |
|-----------|----------|----------|
| **Plan** | S&OP、MPS、MRP | 计划准确率 |
| **Source** | 采购、供应商 | 采购及时率 |
| **Make** | 生产执行 | 生产周期 |
| **Deliver** | 物流、OTC | OTIF 率 |
| **Return** | 退货、逆向 | 退货率 |
| **Enable** | 绩效、决策 | 供应链总成本 |

---

## 2. 当前豪江 SCM 差距分析

### 2.1 差距矩阵

| ISC 要素 | 当前状态 | 差距 | 优先级 |
|----------|----------|------|--------|
| 分层计划 | 有 S&OP/MPS/MRP | 缺少战略层（网络规划） | P1 |
| S&OP 强化 | 有基础流程 | 缺少财务约束、预 S&OP | P1 |
| Time Fences | 无 | 需代码实现冻结机制 | P1 |
| MRP 目标 | 有基础计算 | 需强化三目标算法 | P2 |
| MTS/MTO | 统一策略 | 需差异化库存策略 | P2 |
| OTC Cycle | 有追踪 | 需扩展为全端到端 | P2 |
| 风险三道防线 | 有模块 | 需框架整合 | P2 |
| 价值金字塔 | 无 | 需 BOM/MD 匹配 | P3 |
| SCOR 对齐 | 有看板 | 需严格属性映射 | P3 |

---

## 3. 优化实施方案

### 3.1 优先级 P1（立即实施）

#### 3.1.1 分层计划体系增强

**新增模块**：战略规划菜单

```
新增菜单：
- 战略层 → 网络规划（/strategy/network）
- 战略层 → 产能投资（/strategy/capacity）
- 战略层 → 产品组合（/strategy/portfolio）
```

**SOP/MPS/MRP 垂直整合**：

```typescript
// 计划层级接口
interface PlanningHierarchy {
  strategic: {
    network: NetworkPlan;      // 网络规划
    capacity: CapacityPlan;     // 产能投资
    portfolio: PortfolioPlan;   // 产品组合
  };
  tactical: {
    sop: SOPPlan;              // S&OP
    mps: MPSPlan;              // MPS
  };
  executive: {
    mrp: MRPPlan;              // MRP
    procurement: ProcurementPlan;
    production: ProductionPlan;
  };
}

// 计划数据流转
const planFlow: PlanFlow = {
  strategic → tactical: {
    input: ['网络约束', '产能上限', '产品组合'],
    output: ['S&OP 目标', 'MPS 约束'],
    frequency: '年度',
  },
  tactical → executive: {
    input: ['MPS 计划', 'S&OP 约束'],
    output: ['MRP 输入', '采购建议'],
    frequency: '周度',
  },
};
```

#### 3.1.2 MPS Time Fences 实现

```typescript
// TimeFences 配置
interface TimeFences {
  frozen: {
    weeks: number;        // 冻结周数
    changeRule: 'PROHIBIT';    // 禁止变更
    requireApproval: boolean;  // 需审批
  };
  slushy: {
    weeks: number;        // 半冻结周数
    changeRule: 'LIMITED';    // 有限变更
    maxChangePercent: number;  // 最大变更比例
  };
  liquid: {
    weeks: number;        // 流动周数
    changeRule: 'FLEXIBLE';   // 灵活变更
  };
}

// TimeFences 计算服务
class TimeFencesService {
  calculateFences(mpsDate: Date): TimeFencesResult {
    const frozenEnd = addWeeks(mpsDate, 4);  // 冻结 4 周
    const slushyEnd = addWeeks(mpsDate, 12); // 半冻结到 12 周
    
    return {
      frozen: {
        start: mpsDate,
        end: frozenEnd,
        orders: this.getFrozenOrders(mpsDate, frozenEnd),
      },
      slushy: {
        start: frozenEnd,
        end: slushyEnd,
        orders: this.getSlushyOrders(frozenEnd, slushyEnd),
      },
      liquid: {
        start: slushyEnd,
        orders: this.getLiquidOrders(slushyEnd),
      },
    };
  }
  
  validateChange(orderId: string, newQty: number): ChangeResult {
    const fence = this.calculateFencesForOrder(orderId);
    
    if (fence === 'FROZEN') {
      return {
        allowed: false,
        reason: '订单在冻结期内，禁止变更',
        requiresApproval: true,
      };
    }
    
    if (fence === 'SLUSHY') {
      const maxChange = orderQty * 0.2;  // 最大变更 20%
      if (Math.abs(newQty - orderQty) > maxChange) {
        return {
          allowed: false,
          reason: '超过半冻结期最大变更比例',
          requiresApproval: true,
        };
      }
    }
    
    return { allowed: true };
  }
}
```

#### 3.1.3 S&OP 强化（财务约束）

```typescript
// 财务约束配置
interface FinancialConstraints {
  budget: {
    annual: number;           // 年度预算
    quarterly: number;        // 季度预算
    utilizationCap: number;   // 利用率上限
  };
  profit: {
    targetMargin: number;     // 目标毛利率
    minMargin: number;        // 最低毛利率
  };
  cost: {
    maxInventoryCost: number; // 最大库存成本
    maxStockoutCost: number;  // 最大缺货成本
  };
}

// S&OP 财务约束服务
class SOPFinancialService {
  validateSOPPlan(plan: SOPPlan): ValidationResult {
    const results: ValidationResult = { valid: true, issues: [] };
    
    // 1. 预算约束
    const totalCost = this.calculateTotalCost(plan);
    if (totalCost > plan.financialConstraints.budget.quarterly) {
      results.issues.push({
        type: 'BUDGET_EXCEEDED',
        message: 'SOP 计划超出季度预算',
        severity: 'ERROR',
        suggestion: '调整产量或产品组合',
      });
    }
    
    // 2. 毛利率约束
    const margin = this.calculateMargin(plan);
    if (margin < plan.financialConstraints.profit.minMargin) {
      results.issues.push({
        type: 'MARGIN_TOO_LOW',
        message: 'SOP 计划毛利率低于目标',
        severity: 'WARNING',
        suggestion: '考虑调整产品结构',
      });
    }
    
    // 3. 库存成本约束
    const inventoryCost = this.calculateInventoryCost(plan);
    if (inventoryCost > plan.financialConstraints.cost.maxInventoryCost) {
      results.issues.push({
        type: 'INVENTORY_COST_HIGH',
        message: '库存持有成本过高',
        severity: 'WARNING',
        suggestion: '增加 MTO 产品比例',
      });
    }
    
    results.valid = results.issues.filter(i => i.severity === 'ERROR').length === 0;
    return results;
  }
}
```

### 3.2 优先级 P2（短期实施）

#### 3.2.1 MRP 净需求计算升级

```typescript
// MRP 净需求计算目标
interface MRPTargets {
  noShortage: {
    stockoutRateTarget: number;    // 缺货率目标
    atpFillRateTarget: number;     // ATP 满足率目标
  };
  noExcess: {
    inventoryTurnoverTarget: number; // 库存周转目标
    obsolescenceRateTarget: number; // 呆滞率目标
  };
  noIdle: {
    utilizationTarget: number;      // 产能利用率目标
    overtimeMaxPercent: number;     // 最大加班比例
  };
}

// MRP 净需求计算服务
class MRPNetRequirementService {
  calculateNetRequirement(
    grossRequirement: number,
    currentInventory: number,
    inTransit: number,
    onOrder: number
  ): NetRequirementResult {
    // 核心公式：净需求 = 毛需求 - (库存 + 在途 + 已订未交)
    const available = currentInventory + inTransit + onOrder;
    const netRequirement = Math.max(0, grossRequirement - available);
    
    // 计算建议订单
    const suggestedOrder = this.calculateSuggestedOrder(netRequirement);
    
    // 计算过剩风险
    const excessRisk = this.calculateExcessRisk(netRequirement, grossRequirement);
    
    // 计算缺货风险
    const shortageRisk = this.calculateShortageRisk(netRequirement);
    
    return {
      netRequirement,
      suggestedOrder,
      excessRisk,        // No Excess
      shortageRisk,      // No Shortage
      utilizationImpact: this.calculateUtilizationImpact(suggestedOrder), // No Idle
    };
  }
  
  private calculateSuggestedOrder(netRequirement: number): number {
    // 考虑最小订单量、经济批量、安全库存
    const moq = 100;  // 最小订单量
    const eoq = this.calculateEOQ();  // 经济批量
    const safetyStock = this.getSafetyStock();
    
    let order = Math.max(netRequirement, moq);
    order = Math.ceil(order / eoq) * eoq;  // 批量舍入
    
    return order;
  }
  
  private calculateExcessRisk(net: number, gross: number): number {
    // 过剩风险 = (建议订单 - 净需求) / 净需求
    if (net === 0) return 0;
    const excess = Math.max(0, this.calculateSuggestedOrder(net) - net);
    return excess / net;
  }
  
  private calculateShortageRisk(net: number): number {
    // 缺货风险 = 1 - (当前库存 + 在途) / 毛需求
    // 越接近 1，缺货风险越高
    return Math.min(1, net / (gross || 1));
  }
}
```

#### 3.2.2 MTS/MTO 差异化策略

```typescript
// 库存策略配置
interface InventoryStrategy {
  mts: {
    safetyStockDays: number;      // 安全库存天数
    reorderPointDays: number;    // 再订货点天数
    targetServiceLevel: number;  // 目标服务水平
    maxInventoryDays: number;    // 最大库存天数
  };
  mto: {
    safetyStockDays: number;
    orderLeadTimeDays: number;
    customerLeadTimeDays: number;
    targetServiceLevel: number;
  };
}

// 库存策略服务
class InventoryStrategyService {
  getStrategyForProduct(productId: string): InventoryStrategy {
    const product = this.getProduct(productId);
    
    if (product.productionMode === 'MTS') {
      return {
        safetyStockDays: 14,          // MTS: 14 天安全库存
        reorderPointDays: 7,          // 再订货点 7 天
        targetServiceLevel: 0.98,      // 98% 服务水平
        maxInventoryDays: 30,         // 最大 30 天库存
      };
    } else if (product.productionMode === 'MTO') {
      return {
        safetyStockDays: 3,           // MTO: 少量安全库存
        orderLeadTimeDays: product.leadTime,
        customerLeadTimeDays: product.customerLeadTime,
        targetServiceLevel: 0.95,      // 95% 服务水平
      };
    }
  }
  
  calculateSafetyStock(
    demand: number,
    leadTime: number,
    serviceLevel: number,
    demandStdDev: number
  ): number {
    // 安全库存 = Z值 × 需求标准差 × √提前期
    const zScore = this.getZScore(serviceLevel);
    return zScore * demandStdDev * Math.sqrt(leadTime);
  }
}
```

#### 3.2.3 OTC Cycle 扩展

```typescript
// OTC 全流程追踪
interface OTCycle {
  contract: {
    id: string;
    customer: string;
    value: number;
    terms: ContractTerms;
  };
  forecast: {
    demandPlan: number;
    confidence: number;
  };
  order: {
    id: string;
    items: OrderItem[];
    deliveryDate: Date;
  };
  delivery: {
    shipments: Shipment[];
    actualDelivery: Date;
  };
  cash: {
    invoiceId: string;
    paymentDate: Date;
    paymentStatus: 'PENDING' | 'PAID' | 'OVERDUE';
  };
}

// OTC 可视化服务
class OTCVisualizationService {
  getOTCCycleProgress(orderId: string): OTCProgressResult {
    const stages = [
      { name: '合同签订', status: this.getContractStatus(orderId) },
      { name: '需求预测', status: this.getForecastStatus(orderId) },
      { name: '订单录入', status: this.getOrderStatus(orderId) },
      { name: '生产交付', status: this.getDeliveryStatus(orderId) },
      { name: '收款核销', status: this.getCashStatus(orderId) },
    ];
    
    const progress = stages.filter(s => s.status === 'COMPLETED').length / stages.length;
    
    return {
      orderId,
      stages,
      progress,
      estimatedCompletion: this.getEstimatedCompletion(orderId),
      blockers: this.getBlockers(orderId),
    };
  }
}
```

### 3.3 优先级 P3（中期实施）

#### 3.3.1 风险三道防线框架

```typescript
// 风险三道防线
interface RiskDefenseLine {
  firstLine: {          // 预测准确率
    demandForecastAccuracy: number;
    promotionImpactPrediction: number;
    seasonalityAdjustment: number;
  };
  secondLine: {         // 库存缓冲
    safetyStockCoverage: number;
    bufferInventoryLevel: number;
    multiEchelonOptimization: number;
  };
  thirdLine: {          // 执行敏捷
    supplierResponsiveness: number;
    productionFlexibility: number;
    exceptionAlertSpeed: number;
  };
}

// 风险评估服务
class RiskAssessmentService {
  assessDefenseLines(): DefenseLineAssessment {
    const firstLine = this.assessFirstLine();
    const secondLine = this.assessSecondLine();
    const thirdLine = this.assessThirdLine();
    
    const overallRisk = (
      (1 - firstLine.score) * 0.4 +
      (1 - secondLine.score) * 0.3 +
      (1 - thirdLine.score) * 0.3
    );
    
    return {
      firstLine,
      secondLine,
      thirdLine,
      overallRisk,
      recommendations: this.generateRecommendations(firstLine, secondLine, thirdLine),
    };
  }
  
  private assessFirstLine(): DefenseLineScore {
    const forecastAccuracy = this.calculateForecastAccuracy();
    const promotionAccuracy = this.calculatePromotionImpactAccuracy();
    
    return {
      name: '预测准确率防线',
      score: (forecastAccuracy + promotionAccuracy) / 2,
      metrics: {
        forecastAccuracy,
        promotionAccuracy,
        newProductAccuracy: this.calculateNewProductAccuracy(),
      },
      status: forecastAccuracy > 0.85 ? 'HEALTHY' : 
               forecastAccuracy > 0.70 ? 'WARNING' : 'CRITICAL',
    };
  }
  
  private assessSecondLine(): DefenseLineScore {
    const ssCoverage = this.calculateSafetyStockCoverage();
    const bufferLevel = this.calculateBufferLevel();
    
    return {
      name: '库存缓冲防线',
      score: (ssCoverage + bufferLevel) / 2,
      metrics: {
        safetyStockCoverage: ssCoverage,
        bufferLevel,
        turnoverRate: this.calculateTurnoverRate(),
      },
      status: ssCoverage > 0.90 ? 'HEALTHY' : 
               ssCoverage > 0.75 ? 'WARNING' : 'CRITICAL',
    };
  }
  
  private assessThirdLine(): DefenseLineScore {
    const supplierScore = this.calculateSupplierResponsiveness();
    const productionFlex = this.calculateProductionFlexibility();
    const alertSpeed = this.calculateAlertSpeed();
    
    return {
      name: '执行敏捷防线',
      score: (supplierScore + productionFlex + alertSpeed) / 3,
      metrics: {
        supplierResponsiveness: supplierScore,
        productionFlexibility: productionFlex,
        alertSpeed,
      },
      status: supplierScore > 0.85 ? 'HEALTHY' : 
               supplierScore > 0.70 ? 'WARNING' : 'CRITICAL',
    };
  }
}
```

#### 3.3.2 价值金字塔（BOM/MD 匹配）

```typescript
// 价值金字塔配置
interface ValuePyramid {
  level1: {  // 产品家族
    products: string[];
    revenueContribution: number;
    strategicPriority: number;
  };
  level2: {  // 产品线
    productLine: string;
    margin: number;
    capacityUsage: number;
  };
  level3: {  // 产品
    sku: string;
    salesRank: number;
    inventoryTurnover: number;
  };
  level4: {  // 物料
    material: string;
    costStructure: number;
    supplierDependency: number;
  };
}

// BOM/MD 匹配服务
class BOMMDMatchingService {
  analyzeValuePyramid(productId: string): ValuePyramidResult {
    const product = this.getProduct(productId);
    const bom = this.getBOM(productId);
    
    return {
      productHierarchy: {
        l1Family: this.getFamily(product.familyId),
        l2Line: this.getProductLine(product.lineId),
        l3Product: product,
        l4Materials: bom.items,
      },
      valueContribution: {
        revenueByFamily: this.calculateRevenueByFamily(),
        marginByLine: this.calculateMarginByLine(),
        costByMaterial: this.calculateCostByMaterial(bom),
      },
      recommendations: this.generatePyramidRecommendations(product),
    };
  }
}
```

#### 3.3.3 SCOR 模型严格对齐

```typescript
// SCOR 指标映射
interface SCORMetrics {
  plan: {
    planAccuracy: {
      value: number;
      unit: '%';
      target: number;
      formula: '(Actual - Forecast) / Forecast';
    };
    planUtilization: {
      value: number;
      unit: '%';
      target: number;
    };
  };
  source: {
    sourceCompliance: {
      value: number;
      unit: '%';
      target: number;
    };
    supplierQuality: {
      value: number;
      unit: '%';
      target: number;
    };
  };
  make: {
    productionCycleTime: {
      value: number;
      unit: 'days';
      target: number;
    };
    planProductionSchedule: {
      value: number;
      unit: '%';
      target: number;
    };
  };
  deliver: {
    otif: {
      value: number;
      unit: '%';
      target: number;
      formula: 'OnTimeInFull / TotalOrders';
    };
    perfectOrder: {
      value: number;
      unit: '%';
      target: number;
    };
  };
  return: {
    returnRate: {
      value: number;
      unit: '%';
      target: number;
    };
  };
  enable: {
    totalSupplyChainCost: {
      value: number;
      unit: 'currency';
      target: number;
    };
    cashToCashCycleTime: {
      value: number;
      unit: 'days';
      target: number;
    };
  };
}
```

---

## 4. 菜单结构优化

### 4.1 优化后的菜单结构

```
1. 战略层 STRATEGIC（新增）
   ├── 网络规划（/strategy/network）
   ├── 产能投资（/strategy/capacity）
   └── 产品组合（/strategy/portfolio）

2. 需求管理 DEMAND
   ├── AI 需求预测
   ├── 需求感知
   └── 促销管理

3. S&OP 产销协同 SOP（强化）
   ├── 产销平衡（含财务约束）
   ├── What-if 情景模拟
   ├── 需求评审
   └── RCCP 产能

4. MPS 主生产计划 MPS（Time Fences）
   ├── 13周滚动计划
   ├── Time Fences 配置
   └── ATP 承诺检查

5. MRP 物料计划 MRP（净需求升级）
   ├── MRP 运算
   ├── 齐套分析
   └── 采购/生产建议

6. 采购与供应 SOURCE
   ├── AI 采购建议
   ├── 供应商管理
   └── 协同门户

7. 库存与仓储 STOCK（MTS/MTO）
   ├── 库存总览
   ├── MTS 策略
   ├── MTO 策略
   └── 安全库存/ABC-XYZ/呆滞

8. 生产执行 MAKE
   ├── 生产排产
   ├── 投料管理
   ├── 完工汇报
   └── 订单追踪

9. 物流交付 DELIVER（OTC Cycle）
   ├── 在途可视化
   ├── 发货管理
   └── 运费对账

10. 风险监控 RISK（三道防线）
    ├── 预测风险
    ├── 库存风险
    ├── 执行风险
    └── 风险看板

11. 绩效分析 PERFORMANCE（SCOR）
    ├── SCOR 看板
    ├── 价值金字塔
    └── 自助报表

12. 异常工作台 EXCEPTION
    ├── 智能异常
    └── 预警规则
```

### 4.2 新增菜单代码

```typescript
// 战略层菜单
{ section: '战略层 · STRATEGIC', items: [
  { path: '/strategy', icon: TrendingUp, label: '战略规划', children: [
    { path: '/strategy/network', label: '网络规划' },
    { path: '/strategy/capacity', label: '产能投资' },
    { path: '/strategy/portfolio', label: '产品组合' },
  ]},
]},

// 风险三道防线菜单
{ section: '风险监控 · RISK', items: [
  { path: '/risk/forecast', icon: TrendingUp, label: '预测风险', badge: 2 },
  { path: '/risk/inventory', icon: Package, label: '库存风险', badge: 1 },
  { path: '/risk/execution', icon: Factory, label: '执行风险', badge: 3 },
  { path: '/risk/dashboard', icon: BarChart3, label: '风险看板', badge: 0 },
]},

// 价值金字塔菜单（绩效分析下）
{ path: '/kpi/pyramid', icon: Pyramid, label: '价值金字塔', badge: 0 },
```

---

## 5. 测试计划

### 5.1 Time Fences 测试

| 用例 | 输入 | 预期 | 状态 |
|------|------|------|------|
| 冻结期变更 | 订单在第 2 周，数量 +50% | 禁止变更 | ⏳ |
| 半冻结期变更 | 订单在第 8 周，数量 +15% | 允许，需审批 | ⏳ |
| 流动期变更 | 订单在第 15 周，数量 +50% | 允许 | ⏳ |

### 5.2 MRP 净需求测试

| 用例 | 毛需求 | 库存 | 在途 | 净需求 | 预期 |
|------|--------|------|------|--------|------|
| 不缺货 | 100 | 50 | 60 | 0 | ✅ |
| 部分满足 | 100 | 30 | 20 | 50 | ✅ |
| 全部满足 | 100 | 150 | 0 | 0 | ✅ |

### 5.3 MTS/MTO 策略测试

| 用例 | 产品类型 | 安全库存天数 | 预期策略 |
|------|----------|--------------|----------|
| MTS 产品 | 标准件 A | 14 天 | 高库存 |
| MTO 产品 | 定制件 B | 3 天 | 低库存 |
| 混合产品 | C | 7 天 | 混合策略 |

### 5.4 风险三道防线测试

| 防线 | 测试场景 | 预期风险评分 |
|------|----------|--------------|
| 第一道 | 预测准确率 82% | 中风险 |
| 第二道 | 安全库存覆盖率 95% | 低风险 |
| 第三道 | 供应商响应 4h | 低风险 |
| 综合 | 三道防线全部健康 | < 20% |

### 5.5 SCOR 指标测试

| 指标 | 目标值 | 测试数据 | 预期结果 |
|------|--------|----------|----------|
| OTIF | ≥ 95% | 100 单，5 单延期 | 95% ✅ |
| 库存周转 | ≥ 8 次/年 | 平均库存 100K，年售 900K | 9 次 ✅ |
| 订单周期 | ≤ 5 天 | 订单处理 3 天，物流 2 天 | 5 天 ✅ |

---

## 6. 风险 checklist

### 6.1 算法稳定性

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| Time Fences 规则复杂 | 中 | 高 | 渐进式实施，先覆盖 80% 场景 |
| MRP 负数库存 | 中 | 高 | 增加库存检查，防止负数 |
| 安全库存波动 | 高 | 中 | 使用滚动平均，过滤异常 |
| MTS/MTO 误分类 | 低 | 高 | 增加分类校验，人工确认 |

### 6.2 数据整合

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| BOM 数据不完整 | 高 | 高 | 建立 BOM 完整性检查 |
| 财务数据滞后 | 中 | 中 | 同步财务系统，定期刷新 |
| 预测数据不准 | 高 | 中 | 多源数据融合，置信度评估 |
| 供应商主数据错误 | 低 | 中 | 供应商数据校验流程 |

### 6.3 实施风险

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| 用户接受度 | 中 | 中 | 培训 + 渐进式推广 |
| 性能问题 | 低 | 高 | 预测试 + 性能监控 |
| 变更管理 | 高 | 中 | 版本管理 + 回滚方案 |

---

## 7. 实施路线图

### Phase 1: 基础框架（Week 1-2）

- [ ] Time Fences 代码实现
- [ ] MRP 净需求升级
- [ ] 菜单结构更新

### Phase 2: 业务增强（Week 3-4）

- [ ] MTS/MTO 差异化策略
- [ ] OTC Cycle 扩展
- [ ] 风险三道防线框架

### Phase 3: 高级功能（Week 5-6）

- [ ] 价值金字塔
- [ ] SCOR 严格对齐
- [ ] 战略层菜单

---

## 8. 参考文档

| 文档 | 说明 |
|------|------|
| PRD v2.0 | 产品需求文档 |
| DESIGN_SYSTEM.md | 设计系统规范 |
| SPRINT_BACKLOG_MVP_v1.1.md | Sprint 计划 |

---

**文档版本**: v1.0  
**最后更新**: 2026-02-15  
**负责人**: OpenCLAW
