import React, { useState, useEffect } from 'react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

// 产能数据
const mockCapacityData = [
  { id: 1, name: '青岛工厂', location: '青岛', type: 'factory', capacity: '10000', utilization: 92, cost: '¥1200万', status: 'overloaded' },
  { id: 2, name: '苏州工厂', location: '苏州', type: 'factory', capacity: '8000', utilization: 88, cost: '¥900万', status: 'normal' },
  { id: 3, name: '泰国工厂', location: '泰国', type: 'factory', capacity: '6000', utilization: 43, cost: '¥500万', status: 'underloaded' },
  { id: 4, name: '组装线A', location: '青岛', type: 'assembly', capacity: '5000', utilization: 85, cost: '¥300万', status: 'normal' },
  { id: 5, name: '组装线B', location: '苏州', type: 'assembly', capacity: '4000', utilization: 72, cost: '¥250万', status: 'normal' },
];

const CapacityPage = () => {
  const [data, setData] = useState(mockCapacityData);
  const [loading] = useState(false);

  const typeMap: Record<string, string> = {
    factory: '工厂',
    assembly: '组装线',
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    overloaded: { label: '超负荷', color: '#E53935' },
    normal: { label: '正常', color: '#00897B' },
    underloaded: { label: '低负荷', color: '#F57C00' },
  };

  const getUtilizationColor = (util: number) => {
    if (util > 90) return '#E53935';
    if (util > 80) return '#F57C00';
    return '#00897B';
  };

  const stats = {
    totalCapacity: '33,000单位',
    averageUtilization: Math.round(data.reduce((sum, d) => sum + d.utilization, 0) / data.length),
    investmentNeeded: '¥450M',
    roi: '16.8%',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#2D7DD2' }}></div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      {/* 面包屑 */}
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: '#7A8BA8' }}>
        <span>战略管理</span>
        <span>/</span>
        <span style={{ color: '#E8EDF4' }}>产能投资</span>
      </div>

      <h1 className="text-2xl font-display mb-6" style={{ color: '#E8EDF4' }}>
        ⚡ 产能投资规划
      </h1>

      {/* KPI 卡片 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="text-sm" style={{ color: '#7A8BA8' }}>总产能</div>
          <div className="text-2xl font-bold mt-1" style={{ color: '#E8EDF4' }}>{stats.totalCapacity}</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>月产能</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm" style={{ color: '#7A8BA8' }}>平均利用率</div>
          <div className="text-2xl font-bold mt-1" style={{ color: '#00897B' }}>{stats.averageUtilization}%</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>目标 85%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm" style={{ color: '#7A8BA8' }}>需要投资</div>
          <div className="text-2xl font-bold mt-1" style={{ color: '#F57C00' }}>{stats.investmentNeeded}</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>扩建计划</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm" style={{ color: '#7A8BA8' }}>预期ROI</div>
          <div className="text-2xl font-bold mt-1" style={{ color: '#2D7DD2' }}>{stats.roi}</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>投资回报率</div>
        </Card>
      </div>

      {/* 产能列表 */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium" style={{ color: '#E8EDF4' }}>产能分布</h3>
        </div>
        
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded border"
              style={{ background: '#131926', borderColor: '#1E2D45' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded flex items-center justify-center text-lg"
                  style={{ background: 'rgba(45,125,210,0.1)' }}>
                  🏭
                </div>
                <div>
                  <div className="font-medium" style={{ color: '#E8EDF4' }}>{item.name}</div>
                  <div className="text-xs mt-1" style={{ color: '#445568' }}>
                    {item.location} · {typeMap[item.type] || item.type}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-32">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#7A8BA8' }}>利用率</span>
                    <span className="text-xs" style={{ color: '#E8EDF4' }}>{item.utilization}%</span>
                  </div>
                  <div className="h-2 rounded bg-slate-800">
                    <div
                      className="h-full rounded"
                      style={{
                        width: `${item.utilization}%`,
                        background: getUtilizationColor(item.utilization)
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm" style={{ color: '#E8EDF4' }}>{item.cost}</div>
                  <div className="text-xs" style={{ color: '#445568' }}>年化成本</div>
                </div>
                <div className="text-xs px-2 py-1 rounded" 
                  style={{ background: `${statusMap[item.status].color}20`, color: statusMap[item.status].color }}>
                  {statusMap[item.status].label}
                </div>
                <Button variant="ghost" size="sm">详情</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 投资建议 */}
      <Card className="p-4 mt-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>投资建议</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded" style={{ background: 'rgba(229,57,53,0.08)' }}>
            <span style={{ color: '#E53935' }}>🔴</span>
            <div>
              <div className="text-sm font-medium" style={{ color: '#E53935' }}>青岛工厂扩建</div>
              <div className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                利用率达92%超负荷，建议扩建30%产能，预计投资¥150M，ROI 20个月
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded" style={{ background: 'rgba(245,124,0,0.08)' }}>
            <span style={{ color: '#F57C00' }}>🟠</span>
            <div>
              <div className="text-sm font-medium" style={{ color: '#F57C00' }}>泰国工厂产能转移</div>
              <div className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                利用率仅43%，建议将20%订单转移至泰国工厂，提升至65%
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CapacityPage;
