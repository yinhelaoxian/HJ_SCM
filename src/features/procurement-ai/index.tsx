import React, { useState } from 'react';
import { Check, Clock, Zap, RefreshCw } from 'lucide-react';
import { AI_SUGGESTIONS, AI_STATS } from '../../services/mock/ai.suggestions';

const SuggestionCard = ({ suggestion }) => {
  const [status, setStatus] = useState(suggestion.status || 'pending');
  const borderColors = { pending: '#F57C00', confirmed: '#00897B', rejected: '#445568' };
  const bgColors = { pending: 'rgba(245,124,0,0.04)', confirmed: 'rgba(0,137,123,0.06)', rejected: 'rgba(68,85,104,0.06)' };
  
  return (
    <div className="p-4 rounded transition-all duration-300"
      style={{ background: bgColors[status], border: `1px solid ${borderColors[status]}`,
        borderLeft: `4px solid ${borderColors[status]}`, opacity: status === 'rejected' ? 0.5 : 1, }} >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {suggestion.priority === 'critical' && (
            <span className="px-2 py-0.5 bg-danger text-white text-xs rounded">紧急</span>
          )}
          <span className="text-sm" style={{ color: '#E8EDF4' }}>{suggestion.title}</span>
        </div>
        <span className="text-xs" style={{ color: '#445568' }}>{suggestion.id}</span>
      </div>
      
      <div className="space-y-2 mb-3">
        {suggestion.actions.map((action, i) => (
          <div key={i} className="flex items-start gap-2 text-sm" style={{ color: '#7A8BA8' }}>
            <span className="text-accent">{i + 1}.</span>
            <span>{action}</span>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-4 p-3 rounded mb-3" style={{ background: '#0B0F17' }}>
        <div>
          <p className="text-xs mb-1" style={{ color: '#445568' }}>如执行</p>
          <p className="text-sm" style={{ color: '#00897B' }}>{suggestion.ifExecute}</p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: '#445568' }}>如不执行</p>
          <p className="text-sm" style={{ color: '#E53935' }}>{suggestion.ifNotExecute}</p>
        </div>
      </div>
      
      {status === 'pending' ? (
        <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #1E2D45' }}>
          <button onClick={() => setStatus('confirmed')}
            className="flex-1 py-1.5 rounded text-xs font-medium transition-all hover:opacity-90"
            style={{ background: '#00897B', color: '#fff' }} > ✓ 确认执行 </button>
          <button className="px-4 py-1.5 rounded text-xs transition-all hover:bg-opacity-80"
            style={{ border: '1px solid #1E2D45', color: '#7A8BA8', background: '#0B0F17' }} > ✎ 调整 </button>
          <button onClick={() => setStatus('rejected')}
            className="px-4 py-1.5 rounded text-xs transition-all"
            style={{ border: '1px solid #1E2D45', color: '#445568', background: '#0B0F17' }} > ✗ </button>
        </div>
      ) : status === 'confirmed' ? (
        <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: '1px solid #1E2D45' }}>
          <span className="text-xs font-medium" style={{ color: '#00897B' }}> ✅ 已确认 · 正在生成采购申请… </span>
        </div>
      ) : (
        <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid #1E2D45' }}>
          <span className="text-xs" style={{ color: '#445568' }}>已暂缓处理</span>
          <button onClick={() => setStatus('pending')} className="text-xs" style={{ color: '#7A8BA8' }} > 撤销 </button>
        </div>
      )}
    </div>
  );
};

const ProcurementAI = () => {
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display flex items-center" style={{ color: '#E8EDF4' }}>
            <Zap className="w-6 h-6 mr-2 text-accent" />AI采购建议看板</h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>基于多源信号智能识别采购机会与风险</p>
        </div>
        <button className="px-4 py-2 border rounded flex items-center gap-2" style={{ borderColor: '#2D7DD2', color: '#2D7DD2' }}>
          <RefreshCw className="w-4 h-4" />刷新分析</button>
      </div>
      
      <div className="flex gap-6 mb-6">
        <div className="flex-1 card p-3">
          <p className="text-xs" style={{ color: '#7A8BA8' }}>AI建议总数</p>
          <p className="text-2xl font-display" style={{ color: '#E8EDF4' }}>{AI_STATS.total}条</p>
        </div>
        <div className="flex-1 card p-3">
          <p className="text-xs" style={{ color: '#7A8BA8' }}>涉及预算</p>
          <p className="text-2xl font-display text-accent">¥{AI_STATS.budget}万</p>
        </div>
        <div className="flex-1 card p-3">
          <p className="text-xs" style={{ color: '#7A8BA8' }}>48h内紧急</p>
          <p className="text-2xl font-display text-danger">{AI_STATS.urgent}条</p>
        </div>
        <div className="flex-1 card p-3">
          <p className="text-xs" style={{ color: '#7A8BA8' }}>已确认</p>
          <p className="text-2xl font-display text-success">{AI_STATS.confirmed}条</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {AI_SUGGESTIONS.map((suggestion, i) => (
          <SuggestionCard key={i} suggestion={suggestion} />
        ))}
      </div>
    </div>
  );
};

export default ProcurementAI;
