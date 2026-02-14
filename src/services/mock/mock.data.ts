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
  { label: "预测准确率", current: 61, target: 85, unit: "%", status: "danger" as const },
  { label: "跨厂响应", current: 3.2, target: 0.5, unit: "天", status: "danger" as const },
  { label: "供应商OTD", current: 76, target: 92, unit: "%", status: "danger" as const },
  { label: "泰国产能", current: 43, target: 75, unit: "%", status: "warning" as const },
  { label: "库存周转", current: 9.1, target: 14, unit: "次", status: "warning" as const },
  { label: "完美订单率", current: 68, target: 95, unit: "%", status: "danger" as const }
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

// ========== S&OP 月度计划数据 ==========
export const SOP_DATA = {
  month: '2026年10月',
  status: 'supply_review_in_progress',
  currentStep: 2,
  steps: [
    { id: 1, label: '数据收集', status: 'completed', date: '10月1日-5日' },
    { id: 2, label: '需求评审', status: 'completed', date: '10月6日-8日' },
    { id: 3, label: '供应评审', status: 'in_progress', date: '10月9日-12日' },
    { id: 4, label: 'Pre-S&OP', status: 'pending', date: '10月15日' },
    { id: 5, label: '执行S&OP', status: 'pending', date: '10月20日' }
  ],
  demandByProduct: [
    { product: 'HJ-LA23', demand: 38000, capacity: 32000, gap: -6000, status: 'critical' },
    { product: 'HJ-LA15', demand: 12000, capacity: 18000, gap: 6000, status: 'surplus' },
    { product: '定制项目', demand: 4200, capacity: 8000, gap: 3800, status: 'ok' }
  ],
  threeBalances: {
    supplyDemand: 'critical',
    financial: 'warning',
    overall: 'warning'
  },
  nextMeetingDate: '2026-10-20',
  pendingApprovals: [
    { type: '需求上调', detail: '销售部申请将10月HJ-LA23预测上调18%（+5,700件）', submittedBy: '销售总监' },
    { type: '泰国扩产', detail: '建议泰国工厂LA23产能从800件/周扩至1600件', submittedBy: '生产总监' }
  ],
  monthlyData: [
    { month: '10月', demand: 46800, capacity: 42000, gap: -4800, inventory: 8400 },
    { month: '11月', demand: 52000, capacity: 48000, gap: -4000, inventory: 4400 },
    { month: '12月', demand: 38000, capacity: 48000, gap: 10000, inventory: 14400 },
    { month: '1月', demand: 28000, capacity: 48000, gap: 20000, inventory: 34400 },
    { month: '2月', demand: 22000, capacity: 48000, gap: 26000, inventory: 60400 }
  ]
};

// ========== MPS 三区数据 ==========
export const MPS_DATA = {
  fenceConfig: { frozen: 2, slushy: 4, liquid: 10 },
  currentWeek: 40,
  weeks: ['W40','W41','W42','W43','W44','W45','W46','W47','W48','W49','W50','W51','W52','W01','W02','W03'],
  schedule: [
    { week: 'W40', product: 'HJ-LA23', plant: '青岛', qty: 3600, zone: 'frozen', status: 'locked' },
    { week: 'W41', product: 'HJ-LA23', plant: '青岛', qty: 3600, zone: 'frozen', status: 'locked' },
    { week: 'W42', product: 'HJ-LA23', plant: '青岛', qty: 3600, zone: 'slushy', status: 'confirmed' },
    { week: 'W43', product: 'HJ-LA23', plant: '青岛', qty: 0, zone: 'slushy', status: 'at_risk', riskReason: 'Bühler断供' },
    { week: 'W44', product: 'HJ-LA23', plant: '青岛', qty: 0, zone: 'slushy', status: 'at_risk', riskReason: 'Bühler断供' },
    { week: 'W45', product: 'HJ-LA23', plant: '青岛', qty: 0, zone: 'slushy', status: 'at_risk', riskReason: 'Bühler断供' },
    { week: 'W46', product: 'HJ-LA23', plant: '青岛', qty: 3600, zone: 'liquid', status: 'planning' },
    { week: 'W47', product: 'HJ-LA23', plant: '青岛', qty: 3600, zone: 'liquid', status: 'planning' },
    { week: 'W48', product: 'HJ-LA23', plant: '青岛', qty: 3600, zone: 'liquid', status: 'planning' },
    { week: 'W49', product: 'HJ-LA23', plant: '青岛', qty: 3600, zone: 'liquid', status: 'planning' },
    { week: 'W43', product: 'HJ-LA23', plant: '泰国', qty: 1600, zone: 'slushy', status: 'ai_suggest', aiNote: 'AI建议转产支援' },
    { week: 'W44', product: 'HJ-LA23', plant: '泰国', qty: 1600, zone: 'slushy', status: 'ai_suggest', aiNote: 'AI建议转产支援' },
    { week: 'W45', product: 'HJ-LA23', plant: '泰国', qty: 1600, zone: 'slushy', status: 'ai_suggest', aiNote: 'AI建议转产支援' },
    { week: 'W46', product: 'HJ-LA23', plant: '泰国', qty: 1600, zone: 'liquid', status: 'planning' }
  ],
  rollingHistory: [
    { date: '2026-10-01', type: '周滚动', changes: 12, approvedBy: '王志远' },
    { date: '2026-09-24', type: '周滚动', changes: 8, approvedBy: '王志远' },
    { date: '2026-09-17', type: '周滚动', changes: 5, approvedBy: '张明' }
  ]
};

// ========== OTC订单链路数据 ==========
export const OTC_FLOW = {
  soId: 'SO-2026-3341',
  customer: 'IKEA Supply AG',
  qty: 38000,
  amount: '¥2,180万',
  requestedDate: '2026-11-05',
  originalDate: '2026-11-28',
  nodes: [
    { id: 'contract', label: '合同评审', status: 'completed', planDate: '9月28日', actualDate: '9月28日', owner: '李明', delay: 0 },
    { id: 'order', label: '订单录入', status: 'completed', planDate: '9月28日', actualDate: '9月29日', owner: '张丽', delay: 1 },
    { id: 'plan', label: '计划排产', status: 'inProgress', planDate: '9月30日', actualDate: '10月2日', owner: '王计划', delay: 2 },
    { id: 'make', label: '生产制造', status: 'atRisk', planDate: '10月5日-11月3日', actualDate: null, owner: '青岛厂', delay: null, riskNote: '马达断供风险' },
    { id: 'quality', label: 'QA质检', status: 'pending', planDate: '11月4日', actualDate: null, owner: '质检部', delay: null },
    { id: 'deliver', label: '物流发货', status: 'pending', planDate: '11月5日', actualDate: null, owner: '物流部', delay: null },
    { id: 'receipt', label: '客户签收', status: 'pending', planDate: '11月8日', actualDate: null, owner: null, delay: null },
    { id: 'payment', label: '回款', status: 'pending', planDate: '11月28日', actualDate: null, owner: '财务部', delay: null }
  ],
  relatedDocs: {
    mo: ['MO-2026-1847', 'MO-2026-1851'],
    po: ['PO-2026-0089'],
    pr: ['PR-2026-0023'],
    dn: ['DN-待创建']
  }
};

// ========== SCOR绩效数据 ==========
export const SCOR_KPI = {
  reliability: {
    pof: { current: 68, target: 95, unit: '%', trend: [71, 70, 69, 70, 68, 68] },
    otd: { current: 76, target: 92, unit: '%', trend: [82, 80, 79, 78, 77, 76] },
    breakdown: {
      onTime: 72, quality: 94, documentation: 98
    }
  },
  responsiveness: {
    otcCycle: { current: 32, target: 21, unit: '天', trend: [28, 29, 30, 31, 31, 32] },
    breakdown: [
      { stage: '合同评审', days: 1, benchmark: 0.5 },
      { stage: '订单排产', days: 7, benchmark: 3, isBottleneck: true },
      { stage: '生产制造', days: 18, benchmark: 14 },
      { stage: '物流发货', days: 6, benchmark: 3.5 }
    ]
  },
  cost: {
    totalCostPct: { current: 14.2, target: 10, unit: '%' },
    breakdown: [
      { item: '采购成本', pct: 68.3 },
      { item: '仓储成本', pct: 12.1 },
      { item: '物流成本', pct: 14.7 },
      { item: '计划运营', pct: 4.9 }
    ],
    savingOpportunity: 340
  },
  asset: {
    c2c: { current: 67, target: 45, unit: '天' },
    dsi: { current: 41, target: 28, unit: '天' },
    dso: { current: 48, target: 35, unit: '天' },
    dpo: { current: 22, target: 18, unit: '天' },
    invTurns: { current: 9.1, target: 14, unit: '次/年' },
    slowMovingValue: 1240
  },
  improvements: [
    { priority: 'P1', title: '提升预测准确率', impact: 'POF +12%,库存-18%', timeline: '3-6个月', module: '需求管理' },
    { priority: 'P2', title: '压缩排产响应时间', impact: 'OTC周期 -4天', timeline: '2-3个月', module: 'MPS工作台' },
    { priority: 'P3', title: '呆滞库存处置', impact: 'C2C -8天', timeline: '1个月', module: '库存管理' },
    { priority: 'P4', title: '泰国工厂产能优化', impact: 'SCM成本 -2.1%', timeline: '3个月', module: '生产计划' }
  ]
};
