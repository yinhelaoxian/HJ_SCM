import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, TrendingUp, CalendarRange, BarChart3, 
  ShoppingCart, Building2, Package, GitBranch, 
  Truck, Activity, ChevronDown, ChevronRight,
  Factory, Scale, FileText, AlertTriangle, ClipboardList,
  CheckCircle, MapPin, Percent, Zap, Target,
  RefreshCw, Shield, BarChart, DollarSign, Bell,
  Search, Settings, Network, TrendingDown, PieChart
} from 'lucide-react';
import { DEMO_CONFIG } from '../../core/config/demo.config';

/**
 * HJ SCM Sidebar v2.1 - ISC 框架整合版
 * 
 * 菜单顺序：战略层 → 需求 → S&OP → MPS → MRP → 采购 → 库存 → 生产 → 物流 → 风险 → 绩效 → 异常
 * 遵循 V1.1 框架：Process-Centric, Exception-Driven
 * 整合 ISC 体系：分层计划、风险三道防线、SCOR 对齐
 */
const NAV_GROUPS = [
  // === 1. 供应链指挥中心（总览）
  { section: null, items: [
    { path: '/', icon: LayoutDashboard, label: '指挥中心', badge: 3 },
  ]},
  
  // === 2. 战略层 STRATEGIC（ISC 新增）
  { section: '战略层 · STRATEGIC', items: [
    { path: '/strategy', icon: Network, label: '战略规划', children: [
      { path: '/strategy/network', label: '网络规划' },
      { path: '/strategy/capacity', label: '产能投资' },
      { path: '/strategy/portfolio', label: '产品组合' },
      { path: '/strategy/financial', label: '财务约束' },
    ]},
  ]},
  
  // === 3. 需求管理（输入端）
  { section: '需求管理 · DEMAND', items: [
    { path: '/demand', icon: TrendingUp, label: 'AI 需求预测', badge: 0 },
    { path: '/demand-sense', icon: Zap, label: '需求感知', badge: 0 },
    { path: '/promotions', icon: Percent, label: '促销管理', badge: 0 },
  ]},
  
  // === 4. S&OP 产销协同（战术层）★核心
  { section: 'S&OP 产销协同 · SOP', items: [
    { path: '/sop', icon: CalendarRange, label: '产销平衡', children: [
      { path: '/sop', label: '产销概览' },
      { path: '/sop/balance', label: '供需对比' },
      { path: '/sop/whatif', label: 'What-if 模拟' },
      { path: '/sop/review', label: '需求评审' },
      { path: '/sop/rccp', label: 'RCCP 产能' },
    ]},
    { path: '/variance', icon: Scale, label: '差异分析', badge: 0 },
    { path: '/sop-meeting', icon: FileText, label: '会议管理', badge: 0 },
  ]},
  
  // === 5. MPS 主生产计划（战术排程）
  { section: 'MPS 排程 · MPS', items: [
    { path: '/mps', icon: BarChart3, label: '滚动计划', children: [
      { path: '/mps', label: '13周计划' },
      { path: '/mps/gantt', label: '甘特图' },
      { path: '/mps/timefences', label: 'Time Fences' },
      { path: '/mps/atp', label: 'ATP 承诺' },
    ]},
  ]},
  
  // === 6. MRP 物料计划（执行层）
  { section: 'MRP 物料 · MRP', items: [
    { path: '/mrp', icon: RefreshCw, label: 'MRP 运算', children: [
      { path: '/mrp', label: '净需求计算' },
      { path: '/mrp/suggestions', label: '采购建议' },
      { path: '/mrp/production', label: '工单建议' },
    ]},
    { path: '/kitting', icon: CheckCircle, label: '齐套分析', badge: 2 },
  ]},
  
  // === 7. 采购与供应（Source）
  { section: '采购供应 · SOURCE', items: [
    { path: '/procurement', icon: ShoppingCart, label: 'AI 采购建议', badge: 3 },
    { path: '/supplier', icon: Building2, label: '供应商管理', children: [
      { path: '/supplier', label: '风险全景' },
      { path: '/supplier/risk', label: '风险雷达' },
      { path: '/supplier/score', label: '绩效评分' },
      { path: '/supplier/portal', label: '协同门户' },
      { path: '/supplier/contracts', label: '合同管理' },
    ]},
  ]},
  
  // === 8. 库存管理（Stock，MTS/MTO）
  { section: '库存仓储 · STOCK', items: [
    { path: '/inventory', icon: Package, label: '库存总览', badge: 0 },
    { path: '/inventory/mts', icon: Factory, label: 'MTS 策略', badge: 0 },
    { path: '/inventory/mto', icon: GitBranch, label: 'MTO 策略', badge: 0 },
    { path: '/inventory/safety', icon: Shield, label: '安全库存', badge: 0 },
    { path: '/inventory/abc', icon: BarChart, label: 'ABC-XYZ', badge: 0 },
    { path: '/inventory/stagnation', icon: AlertTriangle, label: '呆滞预警', badge: 1 },
  ]},
  
  // === 9. 生产执行（Make）
  { section: '生产执行 · MAKE', items: [
    { path: '/production', icon: Factory, label: '生产排产', children: [
      { path: '/production', label: '工单列表' },
      { path: '/production/schedule', label: '排程视图' },
      { path: '/production/issue', label: '投料管理' },
      { path: '/production/completion', label: '完工汇报' },
    ]},
    { path: '/otc-flow', icon: GitBranch, label: 'OTC 追踪', badge: 0 },
  ]},
  
  // === 10. 物流交付（Deliver）
  { section: '物流交付 · DELIVER', items: [
    { path: '/logistics', icon: Truck, label: '在途可视', badge: 0 },
    { path: '/logistics/shipment', icon: Package, label: '发货管理', badge: 0 },
    { path: '/logistics/freight', icon: DollarSign, label: '运费对账', badge: 0 },
  ]},
  
  // === 11. 风险监控 RISK（ISC 三道防线）
  { section: '风险监控 · RISK', items: [
    { path: '/risk/forecast', icon: TrendingUp, label: '预测风险', badge: 2, desc: '第一道防线' },
    { path: '/risk/inventory', icon: Package, label: '库存风险', badge: 1, desc: '第二道防线' },
    { path: '/risk/execution', icon: Factory, label: '执行风险', badge: 3, desc: '第三道防线' },
    { path: '/risk/dashboard', icon: BarChart3, label: '风险看板', badge: 0 },
  ]},
  
  // === 12. 绩效分析 PERFORMANCE（SCOR）
  { section: '绩效分析 · PERFORMANCE', items: [
    { path: '/kpi', icon: Activity, label: 'SCOR 看板', children: [
      { path: '/kpi', label: 'KPI 总览' },
      { path: '/kpi/trend', label: '趋势分析' },
      { path: '/kpi/benchmark', label: '对标分析' },
    ]},
    { path: '/kpi/pyramid', icon: PieChart, label: '价值金字塔', badge: 0 },
    { path: '/reports', icon: FileText, label: '自助报表', badge: 0 },
    { path: '/decision', icon: ClipboardList, label: '决策支持', badge: 0 },
  ]},
  
  // === 13. 异常工作台（Exception）
  { section: '异常工作台 · EXCEPTION', items: [
    { path: '/exceptions', icon: AlertTriangle, label: '智能异常', badge: 5 },
    { path: '/alert-rules', icon: Settings, label: '预警规则', badge: 0 },
  ]},
];

/**
 * Sidebar 子菜单项组件
 */
const SidebarItem = ({ item, depth = 0 }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(
    item.children?.some((c: any) => 
      location.pathname.startsWith(c.path) || location.pathname === item.path
    ) || false
  );
  const Icon = item.icon;
  
  // 有子菜单
  if (item.children) {
    return (
      <div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors"
          style={{ 
            color: expanded ? '#E8EDF4' : '#7A8BA8', 
            background: expanded ? 'rgba(45,125,210,0.08)' : 'transparent' 
          }}>
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            <span>{item.label}</span>
            {item.badge > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-xs" 
                style={{ background: '#E53935', color: '#fff' }}>
                {item.badge}
              </span>
            )}
          </div>
          {expanded ? <ChevronDown className="w-3 h-3" style={{ color: '#445568' }} /> : 
                  <ChevronRight className="w-3 h-3" style={{ color: '#445568' }} />}
        </button>
        {expanded && (
          <div className="mt-1 space-y-0.5 border-l ml-4" style={{ borderColor: '#1E2D45' }}>
            {item.children.map((child: any) => (
              <NavLink 
                key={child.path} 
                to={child.path}
                className={({ isActive }) => `block pl-3 pr-2 py-1.5 text-xs rounded-r transition-colors ${
                  isActive ? 'text-accent' : 'text-secondary hover:text-primary'
                }`}
                style={({ isActive }) => ({ 
                  color: isActive ? '#3D9BE9' : '#7A8BA8',
                  background: isActive ? 'rgba(45,125,210,0.08)' : 'transparent'
                })}>
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // 无子菜单
  return (
    <NavLink 
      to={item.path}
      className="flex items-center justify-between px-3 py-2 rounded text-sm transition-colors"
      style={({ isActive }) => ({ 
        color: isActive ? '#3D9BE9' : '#7A8BA8',
        background: isActive ? 'rgba(45,125,210,0.08)' : 'transparent'
      })}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 shrink-0" />}
        <span>{item.label}</span>
      </div>
      {item.badge > 0 && (
        <span className="px-1.5 py-0.5 rounded-full text-xs" 
          style={{ background: '#E53935', color: '#fff' }}>
          {item.badge}
        </span>
      )}
    </NavLink>
  );
};

/**
 * 侧边栏组件 v2.1
 * 
 * ISC 框架整合版：
 * - 新增战略层菜单
 * - 新增风险监控菜单（三道防线）
 * - 新增价值金字塔菜单
 */
const Sidebar = () => (
  <aside className="flex flex-col overflow-hidden" 
    style={{ width: '250px', minWidth: '250px', background: '#0B0F17', borderRight: '1px solid #1E2D45' }}>
    <div className="px-4 py-4" style={{ borderBottom: '1px solid #1E2D45' }}>
      <div className="flex items-center gap-2 mb-0.5">
        <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold" 
          style={{ background: '#2D7DD2' }}>豪</div>
        <span className="font-display text-base font-semibold" 
          style={{ color: '#E8EDF4' }}>
          {DEMO_CONFIG.company.shortName}
        </span>
      </div>
      <p className="text-xs pl-8" style={{ color: '#445568' }}>SCM智能管理系统</p>
    </div>
    
    <nav className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: 'thin' }}>
      {NAV_GROUPS.map((group, gi) => (
        <div key={gi} className={gi > 0 ? 'mt-1' : ''}>
          {group.section && (
            <div className="px-3 py-2 text-xs font-medium tracking-wider uppercase" 
              style={{ color: '#2D5078' }}>
              {group.section}
            </div>
          )}
          <div className="px-2 space-y-0.5">
            {group.items.map(item => (
              <SidebarItem key={item.path} item={item} />
            ))}
          </div>
        </div>
      ))}
    </nav>
    
    <div className="px-4 py-3" style={{ borderTop: '1px solid #1E2D45' }}>
      <div className="flex items-center justify-between text-xs" style={{ color: '#2D5078' }}>
        <span>v3.2 演示版</span>
        <span>{DEMO_CONFIG.company.demoDate}</span>
      </div>
    </div>
  </aside>
);

export default Sidebar;
