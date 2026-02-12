// Page 5: AI采购建议看板
import React, { useState } from 'react';
import {
  Check, Edit, Clock, AlertCircle,
  Zap, DollarSign, RefreshCw
} from 'lucide-react';
import { AI_SUGGESTIONS, AI_STATS } from '../../data/ai.suggestions';
import { DEMO_CONFIG } from '../../config/demo.config';

const SuggestionCard: React.FC<{ suggestion: typeof AI_SUGGESTIONS[0]; onAction: (id: string) => void }> = ({ suggestion, onAction }) => {
  const [expanded, setExpanded] = useState(false);
  const statusColors = {
    pending: 'border-warning bg-warning-bg',
    confirmed: 'border-success bg-success-bg',
    rejected: 'border-danger bg-danger-bg'
  };
  
  return (
    <div className={`card p-4 border-l-4 ${statusColors[suggestion.status as keyof typeof statusColors] || 'border-l-warning'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {suggestion.priority === 'critical' && (
            <span className="px-2 py-0.5 bg-danger text-white text-xs rounded">紧急</span>
          )}
          <span className="text-sm text-primary">{suggestion.title}</span>
        </div>
        <span className="text-xs text-muted">{suggestion.id}</span>
      </div>
      
      <div className="space-y-2 mb-3">
        {suggestion.actions.map((action, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-secondary">
            <span className="text-accent">{i + 1}.</span>
            <span>{action}</span>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-4 p-3 bg-base rounded mb-3 text-xs">
        <div>
          <p className="text-muted mb-1">如执行</p>
          <p className="text-success">{suggestion.ifExecute}</p>
        </div>
        <div>
          <p className="text-muted mb-1">如不执行</p>
          <p className="text-danger">{suggestion.ifNotExecute}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {suggestion.factors?.map((f, i) => (
            <span key={i} className="px-2 py-0.5 bg-card rounded text-xs text-secondary">
              {f.name} {f.weight}%
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs text-white bg-success rounded hover:opacity-90">
            ✓ 确认执行
          </button>
          <button className="px-3 py-1 text-xs border border-border text-secondary rounded hover:bg-card">
            ✎ 调整
          </button>
        </div>
      </div>
    </div>
  );
};

const StatsBar: React.FC = () => (
  <div className="flex gap-6 mb-6">
    <div className="flex-1 card p-3">
      <p className="text-xs text-secondary mb-1">AI建议总数</p>
      <p className="text-2xl font-display text-primary">{AI_STATS.total}条</p>
    </div>
    <div className="flex-1 card p-3">
      <p className="text-xs text-secondary mb-1">涉及预算</p>
      <p className="text-2xl font-display text-accent">¥{AI_STATS.budget}万</p>
    </div>
    <div className="flex-1 card p-3">
      <p className="text-xs text-secondary mb-1">48h内紧急</p>
      <p className="text-2xl font-display text-danger">{AI_STATS.urgent}条</p>
    </div>
    <div className="flex-1 card p-3">
      <p className="text-xs text-secondary mb-1">已确认</p>
      <p className="text-2xl font-display text-success">{AI_STATS.confirmed}条</p>
    </div>
  </div>
);

const ActionButtons: React.FC = () => (
  <div className="flex gap-2 mb-6">
    {[
      { label: '全部待处理', count: 14, active: true },
      { label: '48h紧急', count: 3, active: false },
      { label: '已确认执行', count: 0, active: false },
      { label: '供应商协同', count: 2, active: false }
    ].map((filter, i) => (
      <button
        key={i}
        className={`px-4 py-2 rounded text-sm ${
          filter.active 
            ? 'bg-accent text-white' 
            : 'border border-border text-secondary hover:bg-card'
        }`}
      >
        {filter.label} ({filter.count})
      </button>
    ))}
  </div>
);

const ProcurementAI: React.FC = () => {
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display text-primary flex items-center">
            <Zap className="w-6 h-6 mr-2 text-accent" />
            AI采购建议看板
          </h1>
          <p className="text-sm text-secondary">基于多源信号智能识别采购机会与风险</p>
        </div>
        <button className="px-4 py-2 border border-accent text-accent rounded flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          刷新分析
        </button>
      </div>
      
      <StatsBar />
      <ActionButtons />
      
      <div className="space-y-4">
        {AI_SUGGESTIONS.map(suggestion => (
          <SuggestionCard 
            key={suggestion.id} 
            suggestion={suggestion}
            onAction={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default ProcurementAI;
