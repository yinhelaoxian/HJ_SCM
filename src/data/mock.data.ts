// Mock数据 - 供应商
export const SUPPLIERS = [
  {
    id: "SUP-DE-001",
    name: "Bühler Motor GmbH",
    country: "DE",
    flag: "🇩🇪",
    category: "DC电机总成",
    riskScore: 29,
    riskLevel: "critical",
    monthlySpend: 286000,
    otd: 0.61,
    otdTrend: [0.91, 0.87, 0.79, 0.72, 0.65, 0.61],
    keyMaterials: ["HJ-M05（DC马达总成）", "HJ-M07（精密齿轮组）"],
    riskFactors: [
      "欧洲能源危机导致工厂开工率降至71%",
      "正式通知HJ-LA23配套马达延期6周（10月6日函）",
      "唯一认证供应商，无备选"
    ],
    radar: { financial: 61, delivery: 21, quality: 78, geopolitical: 54, concentration: 18, compliance: 82 },
    alternativeSuppliers: ["青岛恒达电机", "苏州精驱科技"],
    secondaryRisk: ["青岛恒达电机", "苏州精驱科技"]
  },
  {
    id: "SUP-CN-012",
    name: "青岛海川精密弹簧",
    country: "CN",
    flag: "🇨🇳",
    category: "精密弹簧件",
    riskScore: 74,
    riskLevel: "normal",
    otd: 0.88,
    otdTrend: [0.85, 0.87, 0.88, 0.90, 0.89, 0.88],
    keyMaterials: ["HJ-SP03", "HJ-SP08"],
    riskFactors: ["质量稳定性良好", "交货准时"],
    radar: { financial: 75, delivery: 88, quality: 85, geopolitical: 95, concentration: 72, compliance: 90 }
  },
  {
    id: "SUP-CN-023",
    name: "苏州精驱科技有限公司",
    country: "CN",
    flag: "🇨🇳",
    category: "DC电机总成（待认证）",
    riskScore: 67,
    riskLevel: "warning",
    otd: 0.82,
    otdTrend: [0.88, 0.85, 0.83, 0.82, 0.81, 0.82],
    keyMaterials: ["DC马达总成"],
    riskFactors: ["尚未完成豪江供应商认证（预计4周）", "产能可覆盖80%的Bühler替代量"],
    radar: { financial: 72, delivery: 82, quality: 80, geopolitical: 95, concentration: 68, compliance: 78 }
  },
  {
    id: "SUP-TH-007",
    name: "Thai Precision Parts Co.",
    country: "TH",
    flag: "🇹🇭",
    category: "泰国本地采购·铸件",
    riskScore: 71,
    riskLevel: "normal",
    otd: 0.84,
    keyMaterials: ["壳体铸件（泰国工厂专用）"],
    riskFactors: ["泰铢汇率近期贬值4.1%，采购成本上升"],
    radar: { financial: 68, delivery: 84, quality: 82, geopolitical: 72, concentration: 88, compliance: 85 }
  }
];

// Mock数据 - 物料
export const MATERIALS = [
  {
    id: "HJ-LA23",
    name: "线性推杆·HJ-LA23·35mm行程",
    category: "成品",
    application: "IKEA电动床头柜、沙发升降脚",
    currentStock: 3840,
    safetyStock: 8000,
    dailyUsage: 480,
    unit: "件",
    keySuppliers: ["SUP-DE-001"],
    weeklyDemand: [2800, 3100, 3400, 8600, 9200, 11400, 13800, 12100, 9800, 7200, 4300, 2100, 1800, 1400, 1200],
    weeklySupply: [3600, 3600, 3600, 3600, 3600, 0, 0, 0, 3600, 3600, 3600, 3600, 3600, 3600, 3600],
    demandForecastAI: [2850, 3150, 3520, 8800, 9500, 11800, 14200, 12400, 9900, 7100, 4200, 2000],
    demandForecastPlanner: [2800, 3000, 3200, 5800, 6100, 7200, 8900, 8100, 6700, 5200, 3800, 2000],
    gapAnalysis: "第42-44周（圣诞高峰）累计缺口24,000件，影响¥2,180万"
  },
  {
    id: "HJ-LA15",
    name: "线性推杆·HJ-LA15·20mm行程",
    category: "成品",
    application: "国内品牌电动沙发（顾家家居等）",
    currentStock: 18200,
    safetyStock: 4000,
    dailyUsage: 280,
    unit: "件",
    keySuppliers: ["SUP-CN-012"],
    notes: "中国新年备货积压，与HJ-LA23竞争同一条生产线"
  },
  {
    id: "HJ-M05",
    name: "DC马达总成",
    category: "核心零件",
    application: "HJ-LA23关键零件",
    currentStock: 630,
    safetyStock: 2000,
    dailyUsage: 85,
    unit: "套",
    keySuppliers: ["SUP-DE-001"],
    riskFactors: ["Bühler独家供应"]
  }
];

// Mock数据 - 销售订单
export const SALES_ORDERS = [
  {
    id: "SO-2026-3341",
    customer: "IKEA Supply AG",
    customerCountry: "SE",
    flag: "🇸🇪",
    material: "HJ-LA23",
    qty: 38000,
    amount: 21800000,
    originalDeliveryDate: "2026-11-28",
    requestedDeliveryDate: "2026-11-05",
    status: "confirmed",
    priority: "critical",
    notes: "IKEA于10月7日发函要求提前3周，当前系统无法评估影响范围"
  },
  {
    id: "SO-2026-2897",
    customer: "德国瑞哈医疗器械",
    customerCountry: "DE",
    flag: "🇩🇪",
    material: "HJ-LA23",
    qty: 4200,
    amount: 3400000,
    originalDeliveryDate: "2026-11-15",
    status: "at_risk",
    priority: "high"
  },
  {
    id: "SO-2026-3189",
    customer: "顾家家居",
    customerCountry: "CN",
    flag: "🇨🇳",
    material: "HJ-LA15",
    qty: 12000,
    amount: 4200000,
    originalDeliveryDate: "2026-12-20",
    status: "normal",
    priority: "medium",
    notes: "国内春节备货，受HJ-LA15积压影响"
  }
];

// Mock数据 - KPI基准
export const KPI_DATA = [
  { name: "预测准确率(MAPE)", current: 61, target: 85, unit: "%", trend: "↓" },
  { name: "跨厂协同响应", current: 3.2, target: 0.5, unit: "天", trend: "↓" },
  { name: "供应商OTD", current: 76, target: 92, unit: "%", trend: "↓" },
  { name: "泰国产能利用", current: 43, target: 75, unit: "%", trend: "↑" },
  { name: "库存周转率", current: 9.1, target: 14, unit: "次", trend: "→" },
  { name: "完美订单率", current: 68, target: 95, unit: "%", trend: "→" }
];

// Mock数据 - 今日预警
export const ALERTS = [
  {
    id: 1,
    level: "critical",
    title: "Bühler Motor延期6周，HJ-LA23圣诞订单缺口2.4万件",
    amount: "¥2,180万",
    deadline: "还有8天"
  },
  {
    id: 2,
    level: "critical", 
    title: "IKEA要求提前3周发货，影响范围未评估",
    amount: "¥1,340万",
    deadline: "还有3天"
  },
  {
    id: 3,
    level: "warning",
    title: "泰国工厂产能空置43%，青岛超负荷112%",
    amount: "每日损失¥12万",
    deadline: "持续中"
  }
];

// Mock数据 - 三厂状态
export const PLANT_STATUS = [
  { name: "青岛总部", status: "overload", utilization: 112, risk: "🔴超负荷" },
  { name: "苏州华东", status: "normal", utilization: 78, risk: "🟡正常" },
  { name: "泰国曼谷", status: "ramping", utilization: 43, risk: "🟡爬坡中" }
];
