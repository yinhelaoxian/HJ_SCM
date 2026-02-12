// Sidebar 导航组件
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, Factory,
  ShoppingCart, AlertTriangle, Package,
  Truck, Settings
} from 'lucide-react';
import { DEMO_CONFIG } from '../../config/demo.config';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: '供应链指挥中心' },
  { path: '/demand', icon: BarChart3, label: '需求管理', children: ['AI预测', '需求计划'] },
  { path: '/supply', icon: Factory, label: '供应计划', children: ['平衡工作台'] },
  { path: '/procurement', icon: ShoppingCart, label: '采购管理', badge: 3 },
  { path: '/risk', icon: AlertTriangle, label: '风险管控', badge: 11 },
  { path: '/inventory', icon: Package, label: '库存管理' },
  { path: '/logistics', icon: Truck, label: '物流追踪' },
];

const Sidebar: React.FC = () => (
  <aside className="w-60 bg-base border-r border-border flex flex-col">
    <div className="p-4 border-b border-border">
      <h1 className="text-lg font-display text-primary">{DEMO_CONFIG.company.shortName}</h1>
      <p className="text-xs text-muted">SCM智能演示系统</p>
    </div>
    
    <nav className="flex-1 p-2 space-y-1">
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2 rounded text-sm transition-colors ${
              isActive 
                ? 'bg-accent/10 text-accent' 
                : 'text-secondary hover:text-primary hover:bg-card'
            }`
          }
        >
          <div className="flex items-center gap-2">
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </div>
          {item.badge && (
            <span className="px-1.5 py-0.5 bg-danger text-white text-xs rounded-full">
              {item.badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
    
    <div className="p-4 border-t border-border">
      <div className="flex items-center gap-2 text-xs text-muted">
        <Settings className="w-4 h-4" />
        <span>系统设置</span>
      </div>
    </div>
  </aside>
);

export default Sidebar;
