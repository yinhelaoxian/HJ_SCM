import React from 'react';

const capacity = [
  { name: '青岛A线', util: 112 },
  { name: '青岛B线', util: 78 },
  { name: '泰国线', util: 43 }
];

const RCCP: React.FC = () => (
  <div className="page-enter">
    <h1 className="text-2xl font-display mb-6" style={{ color: '#E8EDF4' }}>RCCP粗能力核查</h1>
    <div className="space-y-4">
      {capacity.map(c => (
        <div key={c.name} className="card p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm" style={{ color: '#E8EDF4' }}>{c.name}</span>
            <span className="text-sm"
              style={{ color: c.util > 100 ? '#E53935' : c.util < 60 ? '#F57C00' : '#00897B' }}>
              {c.util}%
            </span>
          </div>
          <div className="h-2 rounded bg-slate-700">
            <div className="h-full rounded"
              style={{ width: `${c.util}%`,
                background: c.util > 100 ? '#E53935' : c.util < 60 ? '#F57C00' : '#00897B' }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default RCCP;
