# 豪江智能SCM演示系统

## 快速启动

```bash
cd scm-hj
npm install
npm run dev
```

## 访问地址

http://localhost:3000

## 项目结构

```
src/
├── config/demo.config.ts     # 可调参数配置
├── data/mock.data.ts       # Mock数据
├── data/ai.suggestions.ts  # AI建议数据
├── components/layout/     # 布局组件
├── pages/
│   ├── p1_Dashboard/    # 供应链指挥中心
│   ├── p2_DemandForecast/ # AI需求预测
│   ├── p3_SupplyBalance/  # 供需平衡
│   ├── p4_SupplierRisk/   # 供应商风险
│   └── p5_ProcurementAI/  # AI采购建议
├── App.tsx
└── index.css
```

## 技术栈

- React 18 + TypeScript
- Tailwind CSS (深色主题)
- ECharts 5.x
- Lucide React

## 核心页面

1. **供应链指挥中心** - 开场页，30秒内传递问题全貌
2. **AI需求预测** - 展示AI预测 vs 人工预测差异
3. **供需平衡工作台** - What-if场景模拟
4. **供应商风险全景** - 风险传导链路
5. **AI采购建议** - 从发现问题到给出答案
