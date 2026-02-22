import React, { useState, useEffect } from 'react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

// 网络节点数据
const mockNodes = [
  { id: '1', name: '青岛总部', location: '青岛', type: 'factory', utilization: 92, cost: '¥1200万', capacity: 1000 },
  { id: '2', name: '华东配送中心', location: '上海', type: 'dc', utilization: 78, cost: '¥800万', capacity: 800 },
  { id: '3', name: '华南配送中心', location: '深圳', type: 'dc', utilization: 85, cost: '¥750万', capacity: 700 },
  { id: '4', name: '华北配送中心', location: '北京', type: 'dc', utilization: 65, cost: '¥600万', capacity: 500 },
  { id: '5', name: '泰国工厂', location: '泰国', type: 'factory', utilization: 43, cost: '¥500万', capacity: 600 },
  { id: '6', name: '苏州工厂', location: '苏州', type: 'factory', utilization: 88, cost: '¥900万', capacity: 850 },
];

const NetworkPlanningPage = () => {
  const [nodes, setNodes] = useState(mockNodes);
  const [loading] = useState(false);

  const typeMap: Record<string, string> = {
    factory: '工厂',
    dc: '配送中心',
    warehouse: '仓库',
  };

  const getUtilizationColor = (util: number) => {
    if (util > 90) return '#E53935';
    if (util > 80) return '#F57C00';
    return '#00897B';
  };

  const stats = {
    totalNodes: nodes.length,
    averageUtilization: Math.round(nodes.reduce((sum, n) => sum + n.utilization, 0) / nodes.length),
    totalCost: '¥4750万',
    coverage: 85,
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
        <span style={{ color: '#E8EDF4' }}>网络规划</span>
      </div>

      <h1 className="text-2xl font-display mb-6" style={{ color: '#E8EDF4' }}>
        🗺️ 网络规划
      </h1>

      {/* KPI 卡片 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="text-sm" style={{ color: '#7A8BA8' }}>网络节点</div>
          <div className="text-2xl font-bold mt-1" style={{ color: '#E8EDF4' }}>{stats.totalNodes}</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>覆盖 6 个地区</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm" style={{ color: '#7A8BA8' }}>平均利用率</div>
          <div className="text-2xl font-bold mt-1" style={{ color: '#00897B' }}>{stats.averageUtilization}%</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>目标 85%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm" style={{ color: '#7A8BA8' }}>总成本</div>
          <div className="text-2xl font-bold mt-1" style={{ color: '#E8EDF4' }}>{stats.totalCost}</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>年化运营成本</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm" style={{ color: '#7A8BA8' }}>覆盖率</div>
          <div className="text-2xl font-bold mt-1" style={{ color: '#2D7DD2' }}>{stats.coverage}%</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>目标 90%</div>
        </Card>
      </div>

      {/* 网络节点列表 */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium" style={{ color: '#E8EDF4' }}>网络节点管理</h3>
        </div>
        
        <div className="space-y-3">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="flex items-center justify-between p-4 rounded border"
              style={{ background: '#131926', borderColor: '#1E2D45' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded flex items-center justify-center text-lg"
                  style={{ background: 'rgba(45,125,210,0.1)' }}>
                  🏭
                </div>
                <div>
                  <div className="font-medium" style={{ color: '#E8EDF4' }}>{node.name}</div>
                  <div className="text-xs mt-1" style={{ color: '#445568' }}>
                    {node.location} · {typeMap[node.type] || node.type}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-32">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#7A8BA8' }}>利用率</span>
                    <span className="text-xs" style={{ color: '#E8EDF4' }}>{node.utilization}%</span>
                  </div>
                  <div className="h-2 rounded bg-slate-800">
                    <div
                      className="h-full rounded"
                      style={{
                        width: `${node.utilization}%`,
                        background: getUtilizationColor(node.utilization)
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm" style={{ color: '#E8EDF4' }}>{node.cost}</div>
                  <div className="text-xs" style={{ color: '#445568' }}>年化成本</div>
                </div>
                <Button variant="ghost" size="sm">详情</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 优化建议 */}
      <Card className="p-4 mt-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>优化建议</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded" style={{ background: 'rgba(0,137,123,0.08)' }}>
            <span style={{ color: '#00897B' }}>📈</span>
            <div>
              <div className="text-sm font-medium" style={{ color: '#00897B' }}>华北仓扩容</div>
              <div className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                利用率达65%，建议扩建30%产能，预计投资¥3.5M，ROI 18个月
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded" style={{ background: 'rgba(245,124,0,0.08)' }}>
            <span style={{ color: '#F57C00' }}>⚠️</span>
            <div>
              <div className="text-sm font-medium" style={{ color: '#F57C00' }}>泰国工厂产能转移</div>
              <div className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                青岛总部(92%)超载 vs 泰国工厂(43%)低负荷，建议加速订单转移
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NetworkPlanningPage;
