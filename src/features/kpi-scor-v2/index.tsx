import React, { useState } from 'react';
import { Activity, TrendingUp, TrendingDown, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * SCOR绩效看板 - 优化版本
 */
const SCORKPIPage = () => {
  const [metrics] = useState([
    { category: 'Plan', name: '计划准确率', value: 87, target: 90, trend: '+3%', color: '#2D7DD2' },
    { category: 'Source', name: '采购及时率', value: 94, target: 95, trend: '+2%', color: '#00897B' },
    { category: 'Make', name: '生产周期', value: 5.2, target: 5.0, trend: '-0.3d', color: '#F57C00', unit: '天' },
    { category: 'Deliver', name: 'OTIF率', value: 95, target: 95, trend: '+1%', color: '#00897B' },
    { category: 'Return', name: '退货率', value: 2.1, target: 2.0, trend: '-0.3%', color: '#F57C00', unit: '%' },
    { category: 'Enable', name: '库存周转', value: 8.5, target: 8.0, trend: '+0.5', color: '#2D7DD2', unit: '次' },
  ]);

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          📊 SCOR绩效看板
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            刷新
          </Button>
          <Button size="sm">导出报告</Button>
        </div>
      </div>

      {/* SCOR流程图 */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between">
          {[
            { name: 'Plan', icon: '📋', color: '#2D7DD2' },
            { name: 'Source', icon: '🛒', color: '#00897B' },
            { name: 'Make', icon: '🏭', color: '#F57C00' },
            { name: 'Deliver', icon: '🚚', color: '#00897B' },
            { name: 'Return', icon: '🔄', color: '#445568' },
            { name: 'Enable', icon: '⚙️', color: '#445568' },
          ].map((item, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{ background: `${item.color}20` }}>
                  {item.icon}
                </div>
                <span className="text-xs mt-2" style={{ color: item.color }}>{item.name}</span>
              </div>
              {i < 5 && <div className="flex-1 h-0.5 mx-2" style={{ background: '#1E2D45' }} />}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* KPI卡片 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {metrics.map((metric, i) => {
          const achieved = metric.unit === '天' || metric.unit === '%' 
            ? (metric.name === '退货率' ? metric.value <= metric.target : metric.value <= metric.target)
            : metric.value >= metric.target;
          return (
            <Card key={i} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs" style={{ color: metric.color }}>{metric.category}</span>
                {achieved ? (
                  <CheckCircle className="w-4 h-4" style={{ color: '#00897B' }} />
                ) : (
                  <AlertCircle className="w-4 h-4" style={{ color: '#F57C00' }} />
                )}
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-display font-bold" style={{ color: '#E8EDF4' }}>
                  {metric.value}
                </span>
                <span className="text-sm mb-1" style={{ color: '#445568' }}>{metric.unit || '%'}</span>
                <span className="text-sm mb-1 flex items-center gap-1"
                  style={{ color: metric.trend.includes('+') || metric.trend.includes('-') ? '#00897B' : '#E53935' }}>
                  {metric.trend.includes('+') ? <TrendingUp className="w-3 h-3" /> : 
                   metric.trend.includes('-') ? <TrendingDown className="w-3 h-3" /> : null}
                  {metric.trend}
                </span>
              </div>
              <div className="mt-2 text-xs" style={{ color: '#7A8BA8' }}>{metric.name}</div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span style={{ color: '#445568' }}>目标: {metric.target}{metric.unit || '%'}</span>
                  <span style={{ color: achieved ? '#00897B' : '#F57C00' }}>
                    {achieved ? '达成' : '差距 ' + Math.abs(metric.value - metric.target)}
                  </span>
                </div>
                <div className="h-1.5 rounded bg-slate-800">
                  <div 
                    className="h-full rounded"
                    style={{ 
                      width: `${Math.min(100, (metric.value / (metric.target * 1.2)) * 100)}%`,
                      background: metric.color
                    }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 趋势图占位 */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>KPI趋势</h3>
        <div className="h-48 rounded flex items-center justify-center"
          style={{ background: 'rgba(45,125,210,0.05)', border: '1px dashed #1E2D45' }}>
          <div className="text-center">
            <Activity className="w-8 h-8 mx-auto mb-2" style={{ color: '#2D7DD2' }} />
            <p className="text-sm" style={{ color: '#7A8BA8' }}>KPI趋势图表</p>
            <p className="text-xs mt-1" style={{ color: '#445568' }}>集成 ECharts/Recharts 展示月度趋势</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SCORKPIPage;
