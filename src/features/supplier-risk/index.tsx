import React from 'react';
import { AlertTriangle } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const RadarChart = ({ data }) => {
  const option = {
    polar: { radius: ['30%', '70%'] },
    angleAxis: { type: 'category', data: ['财务', '交付', '质量', '地缘', '集中', '合规'] },
    radiusAxis: { show: false },
    series: [{
      type: 'radar',
      data: [{ value: [61, 21, 78, 54, 18, 82] }]
    }]
  };
  return <ReactECharts option={option} style={{ height: 220 }} />;
};

const OTDTrend = ({ trend }) => {
  const option = {
    grid: { top: 20, right: 20, bottom: 30, left: 50 },
    xAxis: { type: 'category', data: ['5月','6月','7月','8月','9月','10月'], axisLabel: { color: '#7A8BA8' } },
    yAxis: { type: 'value', min: 0.5, max: 1, axisLabel: { color: '#7A8BA8' }, splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } } },
    series: [{
      data: trend,
      type: 'line',
      smooth: true,
      lineStyle: { color: '#E53935', width: 2 },
      itemStyle: { color: '#E53935' },
      areaStyle: { color: 'rgba(229, 57, 53, 0.1)' }
    }]
  };
  return <ReactECharts option={option} style={{ height: 120 }} />;
};

const RiskChain = ({ supplier }) => {
  return (
    <div className="card p-4 mt-4">
      <h3 className="text-sm font-medium text-danger mb-3">风险传导链路</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="px-3 py-2 bg-danger-bg border border-danger rounded text-sm text-danger">{supplier.name}</span>
          <span className="mx-2 text-muted">→</span>
          <span className="px-3 py-2 bg-warning-bg border border-warning rounded text-sm text-warning">{supplier.keyMaterials[0]}</span>
        </div>
      </div>
      <div className="mt-4 p-3 rounded" style={{ background: 'rgba(245,124,0,0.06)', border: '1px solid #F57C00' }}>
        <p className="text-xs mb-2" style={{ color: '#F57C00' }}>⚠️ 隐性风险发现</p>
        <p className="text-sm" style={{ color: '#7A8BA8' }}>以下2家国内供应商的关键零件同样依赖 Bühler 的传动组件：</p>
        <div className="mt-2 space-y-1">
          <p className="text-xs" style={{ color: '#445568' }}>· 宁波天阁</p>
          <p className="text-xs" style={{ color: '#445568' }}>· 苏州联达</p>
        </div>
      </div>
    </div>
  );
};

const suppliers = [
  { id: 'S001', flag: '🇩🇪', name: 'Bühler Motor GmbH', riskScore: 87, keyMaterials: ['传动组件·HJ-LA23'], radar: { financial: 61, delivery: 21, quality: 78, geopolitical: 54, concentration: 18, compliance: 82 }, otdTrend: [0.89, 0.85, 0.82, 0.78, 0.76, 0.72], riskFactors: ['核心传动组件依赖德国供应商', '圣诞旺季产能已被IKEA锁定50%'] },
  { id: 'S002', flag: '🇨🇳', name: '宁波天阁', riskScore: 45, keyMaterials: ['注塑件·HJ-LA22'], radar: { financial: 78, delivery: 82, quality: 85, geopolitical: 90, concentration: 45, compliance: 88 }, otdTrend: [0.92, 0.91, 0.93, 0.90, 0.88, 0.89], riskFactors: ['二次供应商风险'] },
  { id: 'S003', flag: '🇨🇳', name: '苏州联达', riskScore: 32, keyMaterials: ['电子元件·HJ-CTRL1'], radar: { financial: 85, delivery: 88, quality: 82, geopolitical: 90, concentration: 35, compliance: 90 }, otdTrend: [0.94, 0.93, 0.92, 0.91, 0.90, 0.91], riskFactors: [] },
];

const SupplierRisk = () => {
  const supplier = suppliers[0];
  
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display text-primary">供应商风险全景</h1>
      </div>
      
      <div className="grid gap-4" style={{ gridTemplateColumns: '28% 46% 26%' }}>
        <div>
          <h3 className="text-sm font-medium mb-3" style={{ color: '#7A8BA8' }}>供应商列表</h3>
          {suppliers.map(s => (
            <div key={s.id} className="p-3 mb-2 rounded cursor-pointer border-l-4 border-accent hover:bg-opacity-50"
              style={{ background: s.id === 'S001' ? 'rgba(45,125,210,0.08)' : '#131926', borderColor: s.id === 'S001' ? '#2D7DD2' : '#1E2D45' }}>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: '#E8EDF4' }}>{s.flag} {s.name}</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(229,57,53,0.1)', color: '#E53935' }}>{s.riskScore}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <div className="card p-4">
            <div className="flex items-center mb-4">
              <span className="text-lg">🇩🇪</span>
              <div className="ml-2">
                <h2 className="text-lg font-medium" style={{ color: '#E8EDF4' }}>{supplier.name}</h2>
                <p className="text-xs" style={{ color: '#7A8BA8' }}>电机驱动</p>
              </div>
              <span className="ml-auto text-lg font-bold" style={{ color: '#E53935' }}>{supplier.riskScore}/100</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <RadarChart data={supplier.radar} />
              <div>
                <OTDTrend trend={supplier.otdTrend} />
                <p className="text-xs mt-2" style={{ color: '#445568' }}>近6个月OTD趋势</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              {supplier.riskFactors.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-danger">·</span>
                  <span style={{ color: '#7A8BA8' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <RiskChain supplier={supplier} />
        </div>
        
        <div>
          <div className="card p-4">
            <h3 className="text-sm font-medium mb-3" style={{ color: '#7A8BA8' }}>未来30天关键节点</h3>
            {[
              { date: '10月15日', event: 'Bühler确认最新交期' },
              { date: '10月20日', event: '替代供应商认证截止' },
              { date: '10月25日', event: 'IKEA确认提前发货' },
              { date: '11月1日', event: '圣诞订单首批交付' }
            ].map((node, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <span className="w-16 text-xs" style={{ color: '#445568' }}>{node.date}</span>
                <div className="flex-1 py-1.5 px-3 rounded text-sm" style={{ background: '#0B0F17', color: '#7A8BA8' }}>{node.event}</div>
                {i < 3 && <div className="w-3 h-3 rounded-full" style={{ background: '#2D7DD2' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierRisk;
