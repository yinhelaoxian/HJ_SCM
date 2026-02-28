/**
 * HJ SCM 国际化配置
 * 支持中英文切换
 */

export type Locale = 'zh-CN' | 'en-US';

// 当前语言设置
let currentLocale: Locale = 'zh-CN';

// 语言名称映射
export const LOCALE_NAMES: Record<Locale, string> = {
  'zh-CN': '中文',
  'en-US': 'English',
};

// 语言国家/地区映射
export const LOCALE_FLAGS: Record<Locale, string> = {
  'zh-CN': '🇨🇳',
  'en-US': '🇺🇸',
};

// 翻译资源
export const TRANSLATIONS: Record<string, Record<Locale, string>> = {
  // 通用
  'app.title': { 'zh-CN': '豪江智能SCM演示系统', 'en-US': 'Haojiang Intelligent SCM' },
  'app.subtitle': { 'zh-CN': 'SCM智能管理系统', 'en-US': 'Supply Chain Management System' },
  'version.demo': { 'zh-CN': '演示版', 'en-US': 'Demo' },
  
  // 菜单
  'menu.dashboard': { 'zh-CN': '指挥中心', 'en-US': 'Dashboard' },
  'menu.controlTower': { 'zh-CN': '供应链控制塔', 'en-US': 'Control Tower' },
  'menu.strategyCenter': { 'zh-CN': '战略数据中心', 'en-US': 'Strategy Center' },
  'menu.strategic': { 'zh-CN': '战略层 · STRATEGIC', 'en-US': 'Strategic Layer' },
  'menu.strategy': { 'zh-CN': '战略规划', 'en-US': 'Strategic Planning' },
  'menu.network': { 'zh-CN': '网络规划', 'en-US': 'Network Planning' },
  'menu.capacity': { 'zh-CN': '产能投资', 'en-US': 'Capacity Investment' },
  'menu.portfolio': { 'zh-CN': '产品组合', 'en-US': 'Product Portfolio' },
  'menu.financial': { 'zh-CN': '财务约束', 'en-US': 'Financial Constraints' },
  'menu.demand': { 'zh-CN': '需求管理 · DEMAND', 'en-US': 'Demand Management' },
  'menu.demandForecast': { 'zh-CN': 'AI 需求预测', 'en-US': 'AI Demand Forecast' },
  'menu.demandSense': { 'zh-CN': '需求感知', 'en-US': 'Demand Sensing' },
  'menu.promotions': { 'zh-CN': '促销管理', 'en-US': 'Promotion Management' },
  'menu.sop': { 'zh-CN': 'S&OP 产销协同 · SOP', 'en-US': 'S&OP Sales & Operations' },
  'menu.sopOverview': { 'zh-CN': '产销平衡', 'en-US': 'S&OP Balance' },
  'menu.sopComparison': { 'zh-CN': '供需对比', 'en-US': 'Supply-Demand Comparison' },
  'menu.whatif': { 'zh-CN': 'What-if 模拟', 'en-US': 'What-if Simulation' },
  'menu.demandReview': { 'zh-CN': '需求评审', 'en-US': 'Demand Review' },
  'menu.rccp': { 'zh-CN': 'RCCP 产能', 'en-US': 'RCCP Capacity' },
  'menu.variance': { 'zh-CN': '差异分析', 'en-US': 'Variance Analysis' },
  'menu.sopMeeting': { 'zh-CN': '会议管理', 'en-US': 'Meeting Management' },
  'menu.mps': { 'zh-CN': 'MPS 排程 · MPS', 'en-US': 'MPS Scheduling' },
  'menu.mpsOverview': { 'zh-CN': '13周计划', 'en-US': '13-Week Plan' },
  'menu.gantt': { 'zh-CN': '甘特图', 'en-US': 'Gantt Chart' },
  'menu.timefences': { 'zh-CN': 'Time Fences', 'en-US': 'Time Fences' },
  'menu.atp': { 'zh-CN': 'ATP 承诺', 'en-US': 'ATP Commitment' },
  'menu.mrp': { 'zh-CN': 'MRP 物料 · MRP', 'en-US': 'MRP Materials' },
  'menu.mrpCalc': { 'zh-CN': '净需求计算', 'en-US': 'Net Requirements' },
  'menu.purchaseSuggestions': { 'zh-CN': '采购建议', 'en-US': 'Purchase Suggestions' },
  'menu.productionOrders': { 'zh-CN': '工单建议', 'en-US': 'Production Orders' },
  'menu.kitting': { 'zh-CN': '齐套分析', 'en-US': 'Kitting Analysis' },
  'menu.procurement': { 'zh-CN': '采购供应 · SOURCE', 'en-US': 'Procurement' },
  'menu.aiProcurement': { 'zh-CN': 'AI 采购建议', 'en-US': 'AI Procurement' },
  'menu.supplier': { 'zh-CN': '供应商管理', 'en-US': 'Supplier Management' },
  'menu.supplierRisk': { 'zh-CN': '风险雷达', 'en-US': 'Risk Radar' },
  'menu.supplierScore': { 'zh-CN': '绩效评分', 'en-US': 'Performance Score' },
  'menu.supplierPortal': { 'zh-CN': '协同门户', 'en-US': 'Collaboration Portal' },
  'menu.contracts': { 'zh-CN': '合同管理', 'en-US': 'Contract Management' },
  'menu.inventory': { 'zh-CN': '库存仓储 · STOCK', 'en-US': 'Inventory' },
  'menu.inventoryOverview': { 'zh-CN': '库存总览', 'en-US': 'Inventory Overview' },
  'menu.mts': { 'zh-CN': 'MTS 策略', 'en-US': 'MTS Strategy' },
  'menu.mto': { 'zh-CN': 'MTO 策略', 'en-US': 'MTO Strategy' },
  'menu.safetyStock': { 'zh-CN': '安全库存', 'en-US': 'Safety Stock' },
  'menu.abc': { 'zh-CN': 'ABC-XYZ', 'en-US': 'ABC-XYZ Analysis' },
  'menu.stagnation': { 'zh-CN': '呆滞预警', 'en-US': 'Stagnation Alert' },
  'menu.production': { 'zh-CN': '生产执行 · MAKE', 'en-US': 'Production' },
  'menu.productionScheduling': { 'zh-CN': '生产排产', 'en-US': 'Production Scheduling' },
  'menu.workOrders': { 'zh-CN': '工单列表', 'en-US': 'Work Order List' },
  'menu.schedule': { 'zh-CN': '排程视图', 'en-US': 'Schedule View' },
  'menu.issue': { 'zh-CN': '投料管理', 'en-US': 'Material Issue' },
  'menu.completion': { 'zh-CN': '完工汇报', 'en-US': 'Completion Report' },
  'menu.otc': { 'zh-CN': 'OTC 追踪', 'en-US': 'OTC Tracking' },
  'menu.logistics': { 'zh-CN': '物流交付 · DELIVER', 'en-US': 'Logistics' },
  'menu.inTransit': { 'zh-CN': '在途可视', 'en-US': 'In-Transit Visibility' },
  'menu.shipment': { 'zh-CN': '发货管理', 'en-US': 'Shipment Management' },
  'menu.freight': { 'zh-CN': '运费对账', 'en-US': 'Freight Reconciliation' },
  'menu.risk': { 'zh-CN': '风险监控 · RISK', 'en-US': 'Risk Management' },
  'menu.forecastRisk': { 'zh-CN': '预测风险', 'en-US': 'Forecast Risk' },
  'menu.inventoryRisk': { 'zh-CN': '库存风险', 'en-US': 'Inventory Risk' },
  'menu.executionRisk': { 'zh-CN': '执行风险', 'en-US': 'Execution Risk' },
  'menu.riskDashboard': { 'zh-CN': '风险看板', 'en-US': 'Risk Dashboard' },
  'menu.kpi': { 'zh-CN': '绩效分析 · PERFORMANCE', 'en-US': 'Performance' },
  'menu.kpiOverview': { 'zh-CN': 'KPI 总览', 'en-US': 'KPI Overview' },
  'menu.trend': { 'zh-CN': '趋势分析', 'en-US': 'Trend Analysis' },
  'menu.benchmark': { 'zh-CN': '对标分析', 'en-US': 'Benchmarking' },
  'menu.pyramid': { 'zh-CN': '价值金字塔', 'en-US': 'Value Pyramid' },
  'menu.reports': { 'zh-CN': '自助报表', 'en-US': 'Self-Service Reports' },
  'menu.decision': { 'zh-CN': '决策支持', 'en-US': 'Decision Support' },
  'menu.exceptions': { 'zh-CN': '异常工作台 · EXCEPTION', 'en-US': 'Exception Workbench' },
  'menu.smartException': { 'zh-CN': '智能异常', 'en-US': 'Smart Exceptions' },
  'menu.alertRules': { 'zh-CN': '预警规则', 'en-US': 'Alert Rules' },
  
  // 通用按钮
  'btn.save': { 'zh-CN': '保存', 'en-US': 'Save' },
  'btn.cancel': { 'zh-CN': '取消', 'en-US': 'Cancel' },
  'btn.confirm': { 'zh-CN': '确认', 'en-US': 'Confirm' },
  'btn.edit': { 'zh-CN': '编辑', 'en-US': 'Edit' },
  'btn.delete': { 'zh-CN': '删除', 'en-US': 'Delete' },
  'btn.add': { 'zh-CN': '添加', 'en-US': 'Add' },
  'btn.search': { 'zh-CN': '搜索', 'en-US': 'Search' },
  'btn.filter': { 'zh-CN': '筛选', 'en-US': 'Filter' },
  'btn.reset': { 'zh-CN': '重置', 'en-US': 'Reset' },
  'btn.export': { 'zh-CN': '导出', 'en-US': 'Export' },
  'btn.import': { 'zh-CN': '导入', 'en-US': 'Import' },
  'btn.refresh': { 'zh-CN': '刷新', 'en-US': 'Refresh' },
  'btn.settings': { 'zh-CN': '设置', 'en-US': 'Settings' },
  'btn.optimize': { 'zh-CN': '优化', 'en-US': 'Optimize' },
  
  // 筛选
  'filter.all': { 'zh-CN': '全部', 'en-US': 'All' },
  'filter.type': { 'zh-CN': '类型', 'en-US': 'Type' },
  'filter.location': { 'zh-CN': '地域', 'en-US': 'Location' },
  'filter.sort': { 'zh-CN': '排序', 'en-US': 'Sort' },
  'filter.highToLow': { 'zh-CN': '高到低', 'en-US': 'High to Low' },
  'filter.lowToHigh': { 'zh-CN': '低到高', 'en-US': 'Low to High' },
  
  // 状态
  'status.overloaded': { 'zh-CN': '超载', 'en-US': 'Overloaded' },
  'status.normal': { 'zh-CN': '正常', 'en-US': 'Normal' },
  'status.underloaded': { 'zh-CN': '利用率低', 'en-US': 'Underloaded' },
  
  // 错误信息
  'error.loading': { 'zh-CN': '加载中...', 'en-US': 'Loading...' },
  'error.loadFailed': { 'zh-CN': '加载失败', 'en-US': 'Load Failed' },
  'error.network': { 'zh-CN': '网络错误', 'en-US': 'Network Error' },
};

// 翻译函数
export function t(key: string, locale?: Locale): string {
  const current = locale || currentLocale;
  if (TRANSLATIONS[key] && TRANSLATIONS[key][current]) {
    return TRANSLATIONS[key][current];
  }
  // 如果找不到翻译，返回原始 key
  return key;
}

// 设置语言
export function setLocale(locale: Locale): void {
  currentLocale = locale;
  // 触发语言变更事件
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('localeChange', { detail: { locale } }));
  }
}

// 获取当前语言
export function getLocale(): Locale {
  return currentLocale;
}

// 切换语言
export function toggleLocale(): Locale {
  const newLocale = currentLocale === 'zh-CN' ? 'en-US' : 'zh-CN';
  setLocale(newLocale);
  return newLocale;
}

export default {
  t,
  setLocale,
  getLocale,
  toggleLocale,
  currentLocale,
  TRANSLATIONS,
  LOCALE_NAMES,
  LOCALE_FLAGS,
};
