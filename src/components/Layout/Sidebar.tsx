import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, TrendingUp, CalendarRange, BarChart3, 
  ShoppingCart, Building2, Package, GitBranch, 
  Truck, Activity, ChevronDown, ChevronRight,
  Factory, Scale, FileText, AlertTriangle, ClipboardList,
  CheckCircle, Percent, Zap, Target,
  RefreshCw, Shield, BarChart, DollarSign, 
  Settings, Network, PieChart
} from 'lucide-react';
import { DEMO_CONFIG } from '../../core/config/demo.config';
import { t, getLocale, Locale } from '../../core/config/i18n';
import APP_VERSION from '../../core/config/version';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * HJ SCM Sidebar - Internationalized Version
 * 
 * Menu Order: Dashboard → Strategic → Demand → S&OP → MPS → MRP → Source → Stock → Make → Deliver → Risk → Performance → Exception
 */
const NAV_GROUPS = [
  // === 1. Dashboard
  { section: null, items: [
    { path: '/', icon: LayoutDashboard, labelKey: 'menu.dashboard', badge: 3 },
  ]},
  
  // === 2. Strategic Layer
  { section: 'menu.strategic', items: [
    { path: '/strategy', icon: Network, labelKey: 'menu.strategy', children: [
      { path: '/strategy/network', labelKey: 'menu.network' },
      { path: '/strategy/capacity', labelKey: 'menu.capacity' },
      { path: '/strategy/portfolio', labelKey: 'menu.portfolio' },
      { path: '/strategy/financial', labelKey: 'menu.financial' },
    ]},
  ]},
  
  // === 3. Demand Management
  { section: 'menu.demand', items: [
    { path: '/demand', icon: TrendingUp, labelKey: 'menu.demandForecast', badge: 0 },
    { path: '/demand-sense', icon: Zap, labelKey: 'menu.demandSense', badge: 0 },
    { path: '/promotions', icon: Percent, labelKey: 'menu.promotions', badge: 0 },
  ]},
  
  // === 4. S&OP
  { section: 'menu.sop', items: [
    { path: '/sop', icon: CalendarRange, labelKey: 'menu.sopOverview', children: [
      { path: '/sop', labelKey: 'menu.sopOverview' },
      { path: '/sop/balance', labelKey: 'menu.sopComparison' },
      { path: '/sop/whatif', labelKey: 'menu.whatif' },
      { path: '/sop/review', labelKey: 'menu.demandReview' },
      { path: '/sop/rccp', labelKey: 'menu.rccp' },
    ]},
    { path: '/variance', icon: Scale, labelKey: 'menu.variance', badge: 0 },
    { path: '/sop-meeting', icon: FileText, labelKey: 'menu.sopMeeting', badge: 0 },
  ]},
  
  // === 5. MPS
  { section: 'menu.mps', items: [
    { path: '/mps', icon: BarChart3, labelKey: 'menu.mpsOverview', children: [
      { path: '/mps', labelKey: 'menu.mpsOverview' },
      { path: '/mps/gantt', labelKey: 'menu.gantt' },
      { path: '/mps/timefences', labelKey: 'menu.timefences' },
      { path: '/mps/atp', labelKey: 'menu.atp' },
    ]},
  ]},
  
  // === 6. MRP
  { section: 'menu.mrp', items: [
    { path: '/mrp', icon: RefreshCw, labelKey: 'menu.mrpCalc', children: [
      { path: '/mrp', labelKey: 'menu.mrpCalc' },
      { path: '/mrp/suggestions', labelKey: 'menu.purchaseSuggestions' },
      { path: '/mrp/production', labelKey: 'menu.productionOrders' },
    ]},
    { path: '/kitting', icon: CheckCircle, labelKey: 'menu.kitting', badge: 2 },
  ]},
  
  // === 7. Procurement
  { section: 'menu.procurement', items: [
    { path: '/procurement', icon: ShoppingCart, labelKey: 'menu.aiProcurement', badge: 3 },
    { path: '/supplier', icon: Building2, labelKey: 'menu.supplier', children: [
      { path: '/supplier', labelKey: 'menu.supplierRisk' },
      { path: '/supplier/risk', labelKey: 'menu.supplierRisk' },
      { path: '/supplier/score', labelKey: 'menu.supplierScore' },
      { path: '/supplier/portal', labelKey: 'menu.supplierPortal' },
      { path: '/supplier/contracts', labelKey: 'menu.contracts' },
    ]},
  ]},
  
  // === 8. Inventory
  { section: 'menu.inventory', items: [
    { path: '/inventory', icon: Package, labelKey: 'menu.inventoryOverview', badge: 0 },
    { path: '/inventory/mts', icon: Factory, labelKey: 'menu.mts', badge: 0 },
    { path: '/inventory/mto', icon: GitBranch, labelKey: 'menu.mto', badge: 0 },
    { path: '/inventory/safety', icon: Shield, labelKey: 'menu.safetyStock', badge: 0 },
    { path: '/inventory/abc', icon: BarChart, labelKey: 'menu.abc', badge: 0 },
    { path: '/inventory/stagnation', icon: AlertTriangle, labelKey: 'menu.stagnation', badge: 1 },
  ]},
  
  // === 9. Production
  { section: 'menu.production', items: [
    { path: '/production', icon: Factory, labelKey: 'menu.productionScheduling', children: [
      { path: '/production', labelKey: 'menu.workOrders' },
      { path: '/production/schedule', labelKey: 'menu.schedule' },
      { path: '/production/issue', labelKey: 'menu.issue' },
      { path: '/production/completion', labelKey: 'menu.completion' },
    ]},
    { path: '/otc-flow', icon: GitBranch, labelKey: 'menu.otc', badge: 0 },
  ]},
  
  // === 10. Logistics
  { section: 'menu.logistics', items: [
    { path: '/logistics', icon: Truck, labelKey: 'menu.inTransit', badge: 0 },
    { path: '/logistics/shipment', icon: Package, labelKey: 'menu.shipment', badge: 0 },
    { path: '/logistics/freight', icon: DollarSign, labelKey: 'menu.freight', badge: 0 },
  ]},
  
  // === 11. Risk Management
  { section: 'menu.risk', items: [
    { path: '/risk/forecast', icon: TrendingUp, labelKey: 'menu.forecastRisk', badge: 2, desc: 'First Line' },
    { path: '/risk/inventory', icon: Package, labelKey: 'menu.inventoryRisk', badge: 1, desc: 'Second Line' },
    { path: '/risk/execution', icon: Factory, labelKey: 'menu.executionRisk', badge: 3, desc: 'Third Line' },
    { path: '/risk/dashboard', icon: BarChart3, labelKey: 'menu.riskDashboard', badge: 0 },
  ]},
  
  // === 12. Performance
  { section: 'menu.kpi', items: [
    { path: '/kpi', icon: Activity, labelKey: 'menu.kpi', children: [
      { path: '/kpi', labelKey: 'menu.kpiOverview' },
      { path: '/kpi/trend', labelKey: 'menu.trend' },
      { path: '/kpi/benchmark', labelKey: 'menu.benchmark' },
    ]},
    { path: '/kpi/pyramid', icon: PieChart, labelKey: 'menu.pyramid', badge: 0 },
    { path: '/reports', icon: FileText, labelKey: 'menu.reports', badge: 0 },
    { path: '/decision', icon: ClipboardList, labelKey: 'menu.decision', badge: 0 },
  ]},
  
  // === 13. Exception Workbench
  { section: 'menu.exceptions', items: [
    { path: '/exceptions', icon: AlertTriangle, labelKey: 'menu.smartException', badge: 5 },
    { path: '/alert-rules', icon: Settings, labelKey: 'menu.alertRules', badge: 0 },
  ]},
];

/**
 * Sidebar Item Component
 */
const SidebarItem = ({ item, depth = 0, locale }: { item: any, depth?: number, locale: Locale }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(
    item.children?.some((c: any) => 
      location.pathname.startsWith(c.path) || location.pathname === item.path
    ) || false
  );
  const Icon = item.icon;
  const label = t(item.labelKey, locale);
  
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
            <span>{label}</span>
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
                {t(child.labelKey, locale)}
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
        <span>{label}</span>
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
 * Sidebar Component - Internationalized
 */
const Sidebar: React.FC = () => {
  const [locale, setLocaleState] = useState<Locale>(getLocale());
  
  useEffect(() => {
    const handleChange = (e: CustomEvent) => {
      setLocaleState(e.detail.locale);
    };
    window.addEventListener('localeChange', handleChange as EventListener);
    return () => window.removeEventListener('localeChange', handleChange as EventListener);
  }, []);

  return (
    <aside className="flex flex-col overflow-hidden" 
      style={{ width: '250px', minWidth: '250px', background: '#0B0F17', borderRight: '1px solid #1E2D45' }}>
      <div className="px-4 py-4" style={{ borderBottom: '1px solid #1E2D45' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold" 
              style={{ background: '#2D7DD2' }}>
              {t('app.title', locale).charAt(0)}
            </div>
            <span className="font-display text-base font-semibold" 
              style={{ color: '#E8EDF4' }}>
              {DEMO_CONFIG.company.shortName}
            </span>
          </div>
          <LanguageSwitcher />
        </div>
        <p className="text-xs pl-8" style={{ color: '#445568' }}>{t('app.subtitle', locale)}</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: 'thin' }}>
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-1' : ''}>
            {group.section && (
              <div className="px-3 py-2 text-xs font-medium tracking-wider uppercase" 
                style={{ color: '#2D5078' }}>
                {t(group.section, locale)}
              </div>
            )}
            <div className="px-2 space-y-0.5">
              {group.items.map(item => (
                <SidebarItem key={item.path} item={item} locale={locale} />
              ))}
            </div>
          </div>
        ))}
      </nav>
      
      <div className="px-4 py-3" style={{ borderTop: '1px solid #1E2D45' }}>
        <div className="flex items-center justify-between text-xs" style={{ color: '#2D5078' }}>
          <span>{APP_VERSION.display}</span>
          <span>{DEMO_CONFIG.company.demoDate}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
