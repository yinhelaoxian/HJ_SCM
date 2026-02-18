import React, { useState } from 'react';
import { Settings, MapPin, TrendingUp, DollarSign } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { NetworkNode, NetworkOptimization, NetworkStats } from './types';

/**
 * 网络规划页面
 *
 * 功能：网络节点管理、配送中心布局、成本优化、覆盖范围分析
 */
const NetworkPlanningPage: React.FC = () => {
  const [nodes] = useState<NetworkNode[]>([
    { id: '1', name: '华东配送中心', type: 'dc', capacity: 1000, utilization: 85, cost: '¥2.5M', location: '上海' },
    { id: '2', name: '华南配送中心', type: 'dc', capacity: 800, utilization: 72, cost: '¥1.8M', location: '广州' },
    { id: '3', name: '华北配送中心', type: 'dc', capacity: 600, utilization: 91, cost: '¥1.2M', location: '北京' },
    { id: '4', name: '西南配送中心', type: 'dc', capacity: 400, utilization: 58, cost: '¥0.9M', location: '成都' },
  ]);

  const [optimizations] = useState<NetworkOptimization[]>([
    { id: '1', title: '华北仓扩容', description: '利用率达 91%，建议扩建 30% 产能', cost: '¥3.5M', roi: '18个月', priority: 'high' },
    { id: '2', title: '新增东北节点', description: '东北地区覆盖不足，建议在沈阳建立配送中心', cost: '¥4.2M', roi: '24个月', priority: 'medium' },
  ]);

  const stats: NetworkStats = {
    totalNodes: nodes.length,
    averageUtilization: Math.round(nodes.reduce((sum, node) => sum + node.utilization, 0) / nodes.length),
    totalCost: '¥6.4M',
    coverage: 8,
  };

  return (
    <div className="page-enter">
      {/* 面包屑 */}
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: '#7A8BA8' }}>
        <span>战略管理</span>
        <span>/</span>
        <span style={{ color: '#E8EDF4' }}>网络规划</span>
      </div>

      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
            🌐 网络规划
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>配送网络布局优化与成本控制</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            配置
          </Button>
        </div>
      </div>

      {/* 网络统计 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" style={{ color: '#2D7DD2' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>网络节点</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>
            {stats.totalNodes}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>
            覆盖 {stats.coverage} 省市
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#00897B' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>平均利用率</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>
            {stats.averageUtilization}%
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>
            目标 85%
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4" style={{ color: '#F57C00' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>年度成本</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>
            {stats.totalCost}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>
            配送网络总成本
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" style={{ color: '#E53935' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>高负荷节点</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E53935' }}>
            {nodes.filter(node => node.utilization > 90).length}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>
            利用率 &gt; 90%
          </div>
        </Card>
      </div>

      {/* 网络节点列表 */}
      <Card className="p-4 mb-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>网络节点管理</h3>
        <div className="space-y-3">
          {nodes.map((node) => (
            <div key={node.id} className="flex items-center justify-between p-4 rounded border"
              style={{ background: '#131926', borderColor: '#1E2D45' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded flex items-center justify-center text-lg"
                  style={{ background: 'rgba(45,125,210,0.1)' }}>
                  🏭
                </div>
                <div>
                  <div className="font-medium" style={{ color: '#E8EDF4' }}>
                    {node.name}
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#445568' }}>
                    {node.location} · 类型: {node.type === 'dc' ? '配送中心' : '仓库'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-32">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#7A8BA8' }}>利用率</span>
                    <span className="text-xs" style={{ color: '#E8EDF4' }}>
                      {node.utilization}%
                    </span>
                  </div>
                  <div className="h-2 rounded bg-slate-800">
                    <div
                      className="h-full rounded"
                      style={{
                        width: `${node.utilization}%`,
                        background: node.utilization > 90 ? '#E53935' : node.utilization > 80 ? '#F57C00' : '#00897B'
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm" style={{ color: '#E8EDF4' }}>
                    {node.cost}
                  </div>
                  <div className="text-xs" style={{ color: '#445568' }}>
                    年化成本
                  </div>
                </div>
                <Button variant="outline" size="sm">优化</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 优化建议 */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>网络优化建议</h3>
        <div className="space-y-3">
          {optimizations.map((opt) => (
            <div key={opt.id} className="flex items-start gap-3 p-3 rounded"
              style={{
                background: opt.priority === 'high' ? 'rgba(229,57,53,0.08)' :
                  opt.priority === 'medium' ? 'rgba(245,124,0,08)' : 'rgba(0,137,123,0.08)'
              }}>
              <TrendingUp className="w-4 h-4 mt-0.5"
                style={{
                  color: opt.priority === 'high' ? '#E53935' :
                    opt.priority === 'medium' ? '#F57C00' : '#00897B'
                }} />
              <div className="flex-1">
                <div className="font-medium"
                  style={{
                    color: opt.priority === 'high' ? '#E53935' :
                      opt.priority === 'medium' ? '#F57C00' : '#00897B'
                  }}>
                  {opt.title}
                </div>
                <div className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                  {opt.description}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm" style={{ color: '#E8EDF4' }}>
                  {opt.cost}
                </div>
                <div className="text-xs" style={{ color: '#445568' }}>
                  ROI: {opt.roi}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default NetworkPlanningPage;
