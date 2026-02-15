# features 目录结构调整建议

## 当前结构问题

```
features/
├── dashboard/
├── demand-forecast/
├── sop/
├── mps/
├── supply-balance/
├── procurement-ai/
├── supplier-risk/
├── supplier-portal/
├── p05_Inventory/
├── p10_AlertRules/
├── p11_ATPCheck/
├── p12_ScenarioSim/
├── p13_Variance/
├── p14_Meeting/
├── p15_RCCP/
├── p16_SupplierScore/
└── p17_Decision/
```

**问题**：
- 命名不统一（pXX 风格混用）
- 业务模块分散
- 难以按流程查找

## 建议结构（按端到端流程）

```
features/
├── 01_Demand/                    # 需求管理
│   ├── demand-forecast/            # AI 预测
│   ├── demand-sense/              # 需求感知
│   └── promotions/               # 促销管理
│
├── 02_SOP/                       # S&OP 产销协同
│   ├── sop/                      # 产销平衡
│   ├── supply-balance/             # 供需平衡
│   ├── whatif/                   # 情景模拟
│   └── capacity/                  # 产能规划
│
├── 03_MPS/                       # MPS 排程
│   ├── mps/                      # 滚动计划
│   ├── atp/                      # ATP 承诺
│   └── capacity/                  # RCCP 产能
│
├── 04_MRP/                       # MRP 执行
│   ├── mrp-engine/                # MRP 运算
│   ├── kit-check/                 # 齐套检查
│   ├── suggestions/               # 采购建议
│   └── production-orders/         # 生产工单
│
├── 05_Procurement/              # 采购协同
│   ├── procurement-ai/            # AI 建议
│   ├── supplier-management/       # 供应商管理
│   ├── supplier-portal/          # 协同门户
│   └── contracts/               # 合同管理
│
├── 06_Inventory/                # 库存管理
│   ├── inventory-workbench/       # 库存工作台
│   ├── safety-stock/            # 安全库存
│   ├── abc-xyz/                # ABC-XYZ 分类
│   └── stagnation/              # 呆滞检测
│
├── 07_Fulfillment/              # 订单履行
│   ├── otc-flow/               # 全链路追踪
│   ├── production-orders/       # 生产排产
│   ├── issue-receiving/         # 投料汇报
│   └── completion/              # 完工入库
│
├── 08_Logistics/                # 物流运输
│   ├── logistics/               # 在途可视化
│   ├── route-optim/             # 路径优化
│   └── freight/                 # 运费对账
│
├── 09_Performance/              # 绩效监控
│   ├── kpi/                    # SCOR 看板
│   ├── reports/                 # 自助报表
│   └── decision/                # 决策支持
│
├── 10_Exceptions/               # 异常工作台
│   ├── exceptions/              # 智能异常
│   └── alert-rules/             # 预警规则
│
└── 11_Dashboard/               # 总览入口
    └── dashboard/               # 指挥中心
```

## 迁移脚本

```bash
#!/bin/bash

# 创建目录
mkdir -p features/01_Demand/features
mkdir -p features/02_SOP/features
mkdir -p features/03_MPS/features
# ... 创建其他目录

# 移动文件
mv features/demand-forecast features/01_Demand/
mv features/sop features/02_SOP/
mv features/supply-balance features/02_SOP/
mv features/scenario features/02_SOP/
# ...
```

## 验证清单

| 检查项 | 状态 |
|--------|------|
| 所有菜单路径可访问 | ⏳ |
| 子菜单正确展开/收起 | ⏳ |
| 异常徽章正确显示 | ⏳ |
| 权限控制生效 | ⏳ |
| 移动端响应式菜单 | ⏳ |

EOF
```

**文档版本**: v1.0  
**最后更新**: 2026-02-14  
**状态**: 待执行
