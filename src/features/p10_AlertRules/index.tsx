import React, { useState } from 'react';
import { Plus, Bell, Settings, Play, Edit, Trash2, CheckCircle, AlertTriangle, XCircle, Filter, Truck, Package } from 'lucide-react';

type RuleStatus = 'enabled' | 'disabled' | 'draft';
type AlertPriority = 'P0' | 'P1' | 'P2' | 'P3';

interface RuleCondition {
  id: string;
  field: string;
  operator: string;
  value: any;
}

interface RuleAction {
  id: string;
  type: 'notification' | 'email' | 'webhook';
  template: string;
}

interface AlertRule {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: AlertPriority;
  status: RuleStatus;
  conditions: RuleCondition[];
  actions: RuleAction[];
  triggeredToday: number;
  createdAt: string;
}

const mockRules: AlertRule[] = [
  {
    id: 'R001',
    name: '供应商OTD低于90%',
    description: '当供应商OTD低于90%时触发预警',
    category: 'supply',
    priority: 'P1',
    status: 'enabled',
    conditions: [{ id: 'c1', field: 'supplier.otd', operator: '<', value: '90%' }],
    actions: [{ id: 'a1', type: 'notification', template: '供应商OTD低于90%，请关注' }],
    triggeredToday: 3,
    createdAt: '2026-02-01'
  },
  {
    id: 'R002',
    name: '库存低于安全库存',
    description: '在手库存低于安全库存时触发',
    category: 'inventory',
    priority: 'P1',
    status: 'enabled',
    conditions: [{ id: 'c1', field: 'inventory.onHand', operator: '<', value: '${safetyStock}' }],
    actions: [{ id: 'a1', type: 'notification', template: '库存不足，请及时补货' }],
    triggeredToday: 5,
    createdAt: '2026-02-02'
  },
  {
    id: 'R003',
    name: '需求预测偏差>20%',
    description: '实际需求与预测偏差超过20%时触发',
    category: 'demand',
    priority: 'P2',
    status: 'draft',
    conditions: [{ id: 'c1', field: 'demand.variance', operator: '>', value: '20%' }],
    actions: [{ id: 'a1', type: 'email', template: '需求偏差大，请分析' }],
    triggeredToday: 0,
    createdAt: '2026-02-03'
  },
  {
    id: 'R004',
    name: '成本超预算',
    description: '实际成本超过预算时触发',
    category: 'cost',
    priority: 'P1',
    status: 'enabled',
    conditions: [{ id: 'c1', field: 'cost.actual', operator: '>', value: '${budget}' }],
    actions: [{ id: 'a1', type: 'webhook', template: '成本超预算' }],
    triggeredToday: 2,
    createdAt: '2026-02-04'
  }
];

const AlertRules: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<AlertRule | null>(null);
  
  const filtered = filter === 'all' 
    ? mockRules 
    : mockRules.filter(r => r.category === filter);
  
  const getPriorityColor = (p: AlertPriority) => {
    const colors: Record<AlertPriority, string> = {
      'P0': '#E53935',
      'P1': '#F57C00', 
      'P2': '#FCD34D',
      'P3': '#00897B'
    };
    return colors[p];
  };
  
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'supply': return <Truck className="w-5 h-5" style={{ color: '#E53935' }} />;
      case 'inventory': return <Package className="w-5 h-5" style={{ color: '#00897B' }} />;
      case 'demand': return <Bell className="w-5 h-5" style={{ color: '#F57C00' }} />;
      case 'cost': return <Settings className="w-5 h-5" style={{ color: '#2D7DD2' }} />;
      default: return <Bell className="w-5 h-5" />;
    }
  };
  
  const getStatusBadge = (status: RuleStatus) => {
    const badges: Record<RuleStatus, { bg: string; color: string; label: string }> = {
      enabled: { bg: 'rgba(0,137,123,0.1)', color: '#00897B', label: '已启用' },
      disabled: { bg: 'rgba(68,85,104,0.1)', color: '#445568', label: '已禁用' },
      draft: { bg: 'rgba(245,124,0,0.1)', color: '#F57C00', label: '草稿' }
    };
    const b = badges[status];
    return (
      <span className="px-2 py-0.5 rounded text-xs" style={{ background: b.bg, color: b.color }}>
        {b.label}
      </span>
    );
  };
  
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>预警规则引擎</h1>
          <p className="text-sm mt-1" style={{ color: '#7A8BA8' }}>配置预警规则，实现供应链风险自动监控</p>
        </div>
        <button className="px-4 py-2 rounded text-sm font-medium flex items-center gap-2"
          style={{ background: '#2D7DD2', color: '#fff' }}>
          <Plus className="w-4 h-4" />
          创建规则
        </button>
      </div>
      
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="card p-4">
          <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>规则总数</p>
          <p className="text-3xl font-display" style={{ color: '#E8EDF4' }}>{mockRules.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>已启用</p>
          <p className="text-3xl font-display" style={{ color: '#00897B' }}>
            {mockRules.filter(r => r.status === 'enabled').length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>今日触发</p>
          <p className="text-3xl font-display" style={{ color: '#F57C00' }}>
            {mockRules.reduce((sum, r) => sum + r.triggeredToday, 0)}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>草稿</p>
          <p className="text-3xl font-display" style={{ color: '#445568' }}>
            {mockRules.filter(r => r.status === 'draft').length}
          </p>
        </div>
      </div>
      
      <div className="flex gap-2 mb-4">
        {['all', 'supply', 'inventory', 'demand', 'cost'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="px-4 py-2 rounded text-sm transition-all"
            style={{ 
              background: filter === cat ? '#2D7DD2' : 'transparent',
              color: filter === cat ? '#fff' : '#7A8BA8',
              border: `1px solid ${filter === cat ? '#2D7DD2' : '#1E2D45'}`
            }}
          >
            {cat === 'all' ? '全部' : 
             cat === 'supply' ? '供应' : 
             cat === 'inventory' ? '库存' : 
             cat === 'demand' ? '需求' : '成本'}
          </button>
        ))}
      </div>
      
      <div className="space-y-3">
        {filtered.map(rule => (
          <div 
            key={rule.id}
            onClick={() => setSelected(rule)}
            className="card p-4 cursor-pointer transition-all"
            style={{ 
              background: selected?.id === rule.id ? 'rgba(45,125,210,0.08)' : '#131926',
              borderColor: selected?.id === rule.id ? '#2D7DD2' : '#1E2D45'
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${getPriorityColor(rule.priority)}20` }}>
                  {getCategoryIcon(rule.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{rule.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" 
                      style={{ background: `${getPriorityColor(rule.priority)}20`, color: getPriorityColor(rule.priority) }}>
                      {rule.priority}
                    </span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#7A8BA8' }}>{rule.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(rule.status)}
                <div className="text-right">
                  <p className="text-2xl font-display" style={{ color: rule.triggeredToday > 0 ? '#F57C00' : '#445568' }}>
                    {rule.triggeredToday}
                  </p>
                  <p className="text-xs" style={{ color: '#445568' }}>今日触发</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-3 pt-3 border-t" style={{ borderColor: '#1E2D45' }}>
              <span className="text-xs" style={{ color: '#445568' }}>
                条件: {rule.conditions.length}个
              </span>
              <span className="text-xs" style={{ color: '#445568' }}>
                动作: {rule.actions.length}个
              </span>
              <span className="text-xs ml-auto" style={{ color: '#445568' }}>
                创建: {rule.createdAt}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertRules;
