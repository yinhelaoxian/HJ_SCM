import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, GitBranch, CalendarRange, BarChart3, Network, TrendingUp, Scale,
  ShoppingCart, FileText, Building2, Factory, GitMerge, ClipboardList, Truck, RotateCcw,
  Package, Warehouse, AlertTriangle, Activity, ChevronDown, ChevronRight
} from 'lucide-react';
import { DEMO_CONFIG } from '../../core/config/demo.config';

const NAV_GROUPS = [
  { section: null, items: [
    { path: '/', icon: LayoutDashboard, label: '供应链指挥中心', badge: 3 },
    { path: '/otc-flow', icon: GitBranch, label: '订单全链路追踪', badge: 0 },
  ]},
  { section: '计划体系', items: [
    { path: '/sop', icon: CalendarRange, label: 'S&OP 产销协同', badge: 0 },
    { path: '/mps', icon: BarChart3, label: 'MPS 主生产计划', badge: 2 },
    { path: '/demand', icon: TrendingUp, label: 'AI需求预测', badge: 0 },
    { path: '/supply', icon: Scale, label: '供需平衡工作台', badge: 3 },
    { path: '/procurement', icon: ShoppingCart, label: 'AI采购建议', badge: 3 },
  ]},
  { section: '采购与供应商', items: [
    { path: '/supplier', icon: Building2, label: '供应商管理', badge: 0, children: [
      { path: '/supplier', label: '风险全景图' },
    ]},
  ]},
  { section: '风险与绩效', items: [
    { path: '/kpi', icon: Activity, label: 'SCOR绩效看板', badge: 0 },
  ]},
];

const SidebarItem = ({ item, depth = 0 }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(item.children?.some((c: any) => location.pathname.startsWith(c.path)) || false);
  const isActive = location.pathname === item.path;
  const Icon = item.icon;
  
  if (item.children) {
    return (
      <div>
        <button onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors"
          style={{ color: expanded ? '#E8EDF4' : '#7A8BA8', background: expanded ? 'rgba(45,125,210,0.08)' : 'transparent' }}>
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            <span>{item.label}</span>
          </div>
          {expanded ? <ChevronDown className="w-3 h-3" style={{ color: '#445568' }} /> : 
                    <ChevronRight className="w-3 h-3" style={{ color: '#445568' }} />}
        </button>
        {expanded && (
          <div className="ml-4 mt-0.5 space-y-0.5 border-l" style={{ borderColor: '#1E2D45' }}>
            {item.children.map((child: any) => (
              <NavLink key={child.path} to={child.path}
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
  
  return (
    <NavLink to={item.path}
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
        <span className="px-1.5 py-0.5 rounded-full text-xs shrink-0" 
          style={{ background: '#E53935', color: '#fff' }}>
          {item.badge}
        </span>
      )}
    </NavLink>
  );
};

const Sidebar = () => (
  <aside className="flex flex-col overflow-hidden" style={{ width: '220px', minWidth: '220px', background: '#0B0F17', borderRight: '1px solid #1E2D45' }}>
    <div className="px-4 py-4" style={{ borderBottom: '1px solid #1E2D45' }}>
      <div className="flex items-center gap-2 mb-0.5">
        <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold" 
          style={{ background: '#2D7DD2' }}>豪</div>
        <span className="font-display text-base font-semibold" style={{ color: '#E8EDF4' }}>
          {DEMO_CONFIG.company.shortName}
        </span>
      </div>
      <p className="text-xs pl-8" style={{ color: '#445568' }}>SCM智能管理系统</p>
    </div>
    
    <nav className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: 'thin' }}>
      {NAV_GROUPS.map((group, gi) => (
        <div key={gi} className={gi > 0 ? 'mt-1' : ''}>
          {group.section && (
            <div className="px-3 py-1.5 text-xs font-medium tracking-wider uppercase" 
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
