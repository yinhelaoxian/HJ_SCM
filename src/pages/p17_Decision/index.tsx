import React from 'react';
import { Lightbulb } from 'lucide-react';

const decisions = [
  { title: '启动Buhler备选供应商认证', impact: '高', status: 'pending' },
  { title: '泰国工厂转产部分LA23', impact: '中', status: 'approved' }
];

const Decision: React.FC = () => (
  <div className="page-enter">
    <h1 className="text-2xl font-display mb-6" style={{ color: '#E8EDF4' }}>决策支持系统</h1>
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
      <div className="card p-4">
        <h3 className="text-sm mb-4" style={{ color: '#7A8BA8' }}>AI推荐决策</h3>
        {decisions.map((d, i) => (
          <div key={i} className="p-3 mb-2 rounded flex items-center justify-between" style={{ background: '#131926' }}>
            <div className="flex items-center gap-3">
              <Lightbulb className="w-5 h-5" style={{ color: '#F57C00' }} />
              <span style={{ color: '#E8EDF4' }}>{d.title}</span>
            </div>
            <span style={{ color: '#F57C00' }}>{d.impact}</span>
          </div>
        ))}
      </div>
      <div className="card p-4">
        <h3 className="text-sm mb-4" style={{ color: '#7A8BA8' }}>决策效果追踪</h3>
        <div className="h-48 bg-slate-800 rounded" />
      </div>
    </div>
  </div>
);

export default Decision;
