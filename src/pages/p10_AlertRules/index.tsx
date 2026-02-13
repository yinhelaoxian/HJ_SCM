import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Play, Bell, Settings, CheckCircle, XCircle } from 'lucide-react';

// 规则状态类型
type RuleStatus = 'draft' | 'enabled' | 'disabled';
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
  createdAt: string;
}

// 模拟数据
const mockRules: AlertRule[] = [
  {
    id: 'R001',
    name: '供应商OTD低于90%',
    description: '当供应商OTD低于90%时触发预警',
    category: 'supply',
    priority: 'P1',
    status: 'enabled',
    conditions: [{ id: 'c1', field: 'supplier.otd', operator: 'lt', value: 0.9 }],
    actions: [{ id: 'a1', type: 'notification', template: '供应商OTD低于90%，请关注' }],
    createdAt: '2026-02-01'
  },
  {
    id: 'R002',
    name: '库存低于安全库存',
    description: '在手库存低于安全库存时触发',
    category: 'inventory',
    priority: 'P1',
    status: 'enabled',
    conditions: [{ id: 'c1', field: 'inventory.onHand', operator: 'lt', value: 'inventory.safetyStock' }],
    actions: [{ id: 'a1', type: 'notification', template: '库存不足，请及时补货' }],
    createdAt: '2026-02-02'
  },
  {
    id: 'R003',
    name: '需求预测偏差>20%',
    description: '实际需求与预测偏差超过20%',
    category: 'demand',
    priority: 'P2',
    status: 'enabled',
    conditions: [{ id: 'c1', field: 'demand.variance', operator: 'gt', value: 0.2 }],
    actions: [{ id: 'a1', type: 'notification', template: '需求预测偏差大，请分析' }],
    createdAt: '2026-02-03'
  },
  {
    id: 'R004',
    name: '成本超预算',
    description: '实际成本超过预算时触发',
    category: 'cost',
    priority: 'P1',
    status: 'draft',
    conditions: [{ id: 'c1', field: 'cost.actual', operator: 'gt', value: 'cost.budget' }],
    actions: [{ id: 'a1', type: 'email', template: '成本超预算，请关注' }],
    createdAt: '2026-02-04'
  }
];

const AlertRules: React.FC = () => {
  const [rules, setRules] = useState<AlertRule[]>(mockRules);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const categories = [
    { id: 'all', name: '全部' },
    { id: 'supply', name: '供应风险' },
    { id: 'demand', name: '需求异常' },
    { id: 'inventory', name: '库存风险' },
    { id: 'cost', name: '成本风险' }
  ];
  
  const priorityColors: Record<AlertPriority, string> = {
    'P0': 'bg-red-500',
    'P1': 'bg-orange-500',
    'P2': 'bg-yellow-500',
    'P3': 'bg-blue-500'
  };
  
  const priorityLabels: Record<AlertPriority, string> = {
    'P0': '紧急',
    'P1': '重要',
    'P2': '一般',
    'P3': '提示'
  };
  
  const filteredRules = rules.filter(r => 
    selectedCategory === 'all' || r.category === selectedCategory
  );
  
  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      supply: '供应风险',
      demand: '需求异常',
      inventory: '库存风险',
      cost: '成本风险'
    };
    return labels[cat] || cat;
  };
  
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
            预警规则引擎
          </h1>
          <p className="text-sm mt-1" style={{ color: '#7A8BA8' }}>
            配置预警规则，实现供应链风险自动监控
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded text-sm flex items-center gap-2"
          style={{ background: '#2D7DD2', color: '#fff' }}
        >
          <Plus className="w-4 h-4" />
          创建规则
        </button>
      </div>
      
      {/* 统计卡片 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="card p-4">
          <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>规则总数</p>
          <p className="text-3xl font-display" style={{ color: '#E8EDF4' }}>{rules.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>已启用</p>
          <p className="text-3xl font-display" style={{ color: '#00897B' }}>
            {rules.filter(r => r.status === 'enabled').length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>草稿</p>
          <p className="text-3xl font-display" style={{ color: '#F57C00' }}>
            {rules.filter(r => r.status === 'draft').length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs mb-1" style={{ color: '#7A8BA8' }}>今日触发</p>
          <p className="text-3xl font-display" style={{ color: '#E53935' }}>12</p>
        </div>
      </div>
      
      {/* 分类筛选 */}
      <div className="flex gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded text-sm ${
              selectedCategory === cat.id 
                ? '' 
                : ''
            }`}
            style={{ 
              background: selectedCategory === cat.id ? '#2D7DD2' : 'transparent',
              color: selectedCategory === cat.id ? '#fff' : '#7A8BA8',
              border: selectedCategory === cat.id ? 'none' : '1px solid #1E2D45'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>
      
      {/* 规则列表 */}
      <div className="space-y-3">
        {filteredRules.map(rule => (
          <div key={rule.id} className="card p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  rule.category === 'supply' ? 'bg-red-500/20' :
                  rule.category === 'demand' ? 'bg-orange-500/20' :
                  rule.category === 'inventory' ? 'bg-green-500/20' :
                  'bg-blue-500/20'
                }`}>
                  <Bell className="w-5 h-5" style={{ 
                    color: rule.category === 'supply' ? '#E53935' :
                           rule.category === 'demand' ? '#F57C00' :
                           rule.category === 'inventory' ? '#00897B' : '#2D7DD2'
                  }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-medium" style={{ color: '#E8EDF4' }}>{rule.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${priorityColors[rule.priority]}`} style={{ color: '#fff' }}>
                      {priorityLabels[rule.priority]}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs" 
                      style={{ background: rule.status === 'enabled' ? 'rgba(0,137,123,0.1)' : 'rgba(245,124,0,0.1)',
                      color: rule.status === 'enabled' ? '#00897B' : '#F57C00' }}>
                      {rule.status === 'enabled' ? '已启用' : '草稿'}
                    </span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#7A8BA8' }}>{rule.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded hover:bg-opacity-50" 
                  style={{ background: 'rgba(45,125,210,0.1)', color: '#2D7DD2' }}
                  title="测试规则"
                >
                  <Play className="w-4 h-4" />
                </button>
                <button className="p-2 rounded hover:bg-opacity-50" 
                  style={{ background: 'rgba(45,125,210,0.1)', color: '#2D7DD2' }}
                  title="编辑"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 rounded hover:bg-opacity-50" 
                  style={{ background: 'rgba(229,57,53,0.1)', color: '#E53935' }}
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* 规则详情 */}
            <div className="mt-4 pt-3 border-t" style={{ borderColor: '#1E2D45' }}>
              <div className="flex gap-6 text-xs">
                <div>
                  <span className="text-muted">分类:</span>
                  <span className="ml-2" style={{ color: '#7A8BA8' }}>{getCategoryLabel(rule.category)}</span>
                </div>
                <div>
                  <span className="text-muted">条件数:</span>
                  <span className="ml-2" style={{ color: '#7A8BA8' }}>{rule.conditions.length}个</span>
                </div>
                <div>
                  <span className="text-muted">动作数:</span>
                  <span className="ml-2" style={{ color: '#7A8BA8' }}>{rule.actions.length}个</span>
                </div>
                <div>
                  <span className="text-muted">创建时间:</span>
                  <span className="ml-2" style={{ color: '#7A8BA8' }}>{rule.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertRules;
