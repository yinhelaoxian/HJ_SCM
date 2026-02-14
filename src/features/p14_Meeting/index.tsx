import React from 'react';

const Meeting: React.FC = () => (
  <div className="page-enter">
    <h1 className="text-2xl font-display mb-6" style={{ color: '#E8EDF4' }}>S&OP会议管理</h1>
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <div className="card p-4">
        <h3 className="text-base mb-2" style={{ color: '#E8EDF4' }}>10月S&OP会议</h3>
        <p className="text-xs" style={{ color: '#7A8BA8' }}>2026-10-20 · 已排期</p>
      </div>
      <div className="card p-4">
        <h3 className="text-base mb-2" style={{ color: '#E8EDF4' }}>Pre-S&OP会议</h3>
        <p className="text-xs" style={{ color: '#7A8BA8' }}>2026-10-15 · 已完成</p>
      </div>
    </div>
  </div>
);

export default Meeting;
