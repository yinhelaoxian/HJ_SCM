// SCM演示系统配置文件
// 一处修改，全局生效

export const DEMO_CONFIG = {
  // 企业信息
  company: {
    name: "豪江智能设备制造有限公司",
    shortName: "豪江智能",
    industry: "线性驱动系统制造",
    plants: ["青岛总部", "苏州华东", "泰国曼谷"],
    demoDate: "2026年10月8日",
    daysToChristmasSeason: 47,
  },
  
  // KPI基准值
  kpi: {
    forecastAccuracy: { current: 61, target: 85 },
    crossFactoryResponseDays: { current: 3.2, target: 0.5 },
    supplierOTD: { current: 76, target: 92 },
    thailandCapacityUtil: { current: 43, target: 75 },
    inventoryTurns: { current: 9.1, target: 14 },
    perfectOrderRate: { current: 68, target: 95 },
  },
  
  // 风险金额（万元）
  riskAmount: {
    total: 3180,
    critical: 2180,
    urgent: 1340,
  },
  
  // 主题色
  colors: {
    accent: "#2D7DD2",
    danger: "#E53935",
    warning: "#F57C00",
    success: "#00897B",
  },
};

// 图表配色
export const CHART_COLORS = {
  supply: ['#1E4D8C', '#2D7DD2', '#64B5F6'],
  demand: '#E53935',
  gap: 'rgba(229, 57, 53, 0.15)',
  surplus: 'rgba(45, 125, 210, 0.10)',
};

// ECharts配置
export const ECHARTS_THEME = {
  backgroundColor: 'transparent',
  textStyle: { color: '#7A8BA8', fontFamily: 'IBM Plex Sans' },
  grid: { top: 20, right: 20, bottom: 40, left: 60, containLabel: true },
  xAxis: { 
    axisLine: { lineStyle: { color: '#1E2D45' } },
    axisLabel: { color: '#7A8BA8' },
    splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } },
  },
  yAxis: {
    axisLine: { show: false },
    axisLabel: { color: '#7A8BA8' },
    splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } },
  },
  tooltip: {
    backgroundColor: '#1A2235',
    borderColor: '#2D7DD2',
    textStyle: { color: '#E8EDF4' },
  },
};
