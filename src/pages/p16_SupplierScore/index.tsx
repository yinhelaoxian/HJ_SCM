import React from 'react';

const suppliers = [
  { name: 'Buhler', score: 61, trend: 'down', otd: 61, quality: 78 },
  { name: '宁波天阁', score: 82, trend: 'stable', otd: 88, quality: 85 },
  { name: '苏州联达', score: 79, trend: 'up', otd: 82, quality: 80 }
];

const SupplierScore: React.FC = () => (
  <div className="page-enter">
    <h1 className="text-2xl font-display mb-6" style={{ color: '#E8EDF4' }}>供应商绩效管理</h1>
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <div className="card p-4">
        <h3 className="text-sm mb-4" style={{ color: '#7A8BA8' }}>评分排名</h3>
        {suppliers.map((s, i) => (
          <div key={i} className="flex items-center justify-between p-3 mb-2 rounded" style={{ background: '#131926' }}>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs" 
                style={{ background: i === 0 ? '#E53935' : i === 1 ? '#F57C00' : '#00897B', color: '#fff' }}>
                {i + 1}
              </span>
              <span style={{ color: '#E8EDF4' }}>{s.name}</span>
            </div>
            <span style={{ color: s.score >= 80 ? '#00897B' : s.score >= 60 ? '#F57C00' : '#E53935' }}>
              {s.score}
            </span>
          </div>
        ))}
      </div>
      <div className="card p-4">
        <h3 className="text-sm mb-4" style={{ color: '#7A8BA8' }}>OTD趋势</h3>
        <div className="h-32 bg-slate-800 rounded" />
      </div>
      <div className="card p-4">
        <h3 className="text-sm mb-4" style={{ color: '#7A8BA8' }}>质量趋势</h3>
        <div className="h-32 bg-slate-800 rounded" />
      </div>
    </div>
  </div>
);

export default SupplierScore;
