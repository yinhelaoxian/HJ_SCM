import React from 'react';
import { Network, TrendingUp, DollarSign, PieChart, Settings, AlertTriangle } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * 战略规划页面
 * 
 * ISC 框架：战略层模块
 * 功能：网络规划、产能投资、产品组合、财务约束
 */
const StrategyPage = () => {
  const networks = [
    { name: '华东配送中心', capacity: 1000, utilization: 85, cost: '¥2.5M' },
    { name: '华南配送中心', capacity: 800, utilization: 72, cost: '¥1.8M' },
    { name: '华北配送中心', capacity: 600, utilization: 91, cost: '¥1.2M' },
  ];

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          🌐 战略规划
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            配置
          </Button>
        </div>
      </div>

      {/* 战略 KPI */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-4 h-4" style={{ color: '#2D7DD2' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>网络节点</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>12</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>覆盖 8 省市</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#00897B' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>产能利用率</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>82%</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>目标 85%</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4" style={{ color: '#F57C00' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>产品组合</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>156</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>SKU 数量</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4" style={{ color: '#445568' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>年度预算</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>¥15M</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>已使用 62%</div>
        </Card>
      </div>

      {/* 网络规划 */}
      <Card className="p-4 mb-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>网络规划概览</h3>
        <div className="space-y-3">
          {networks.map((net, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded border"
              style={{ background: '#131926', borderColor: '#1E2D45' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded flex items-center justify-center text-lg"
                  style={{ background: 'rgba(45,125,210,0.1)' }}>
                  🏭
                </div>
                <div>
                  <div className="font-medium" style={{ color: '#E8EDF4' }}>{net.name}</div>
                  <div className="text-xs mt-1" style={{ color: '#445568' }}>
                    产能: {net.capacity} 单位/月
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-32">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#7A8BA8' }}>利用率</span>
                    <span className="text-xs" style={{ color: '#E8EDF4' }}>{net.utilization}%</span>
                  </div>
                  <div className="h-2 rounded bg-slate-800">
                    <div 
                      className="h-full rounded"
                      style={{ 
                        width: `${net.utilization}%`,
                        background: net.utilization > 90 ? '#E53935' : net.utilization > 80 ? '#F57C00' : '#00897B'
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm" style={{ color: '#E8EDF4' }}>{net.cost}</div>
                  <div className="text-xs" style={{ color: '#445568' }}>年化成本</div>
                </div>
                <Button variant="outline" size="sm">优化</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 产能投资建议 */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>产能投资建议</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded"
            style={{ background: 'rgba(0,137,123,0.08)' }}>
            <TrendingUp className="w-4 h-4 mt-0.5" style={{ color: '#00897B' }} />
            <div>
              <div className="text-sm font-medium" style={{ color: '#00897B' }}>华北仓扩容</div>
              <div className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                利用率达 91%，建议扩建 30% 产能，预计投资 ¥3.5M，ROI 18 个月
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded"
            style={{ background: 'rgba(245,124,0,0.08)' }}>
            <AlertTriangle className="w-4 h-4 mt-0.5" style={{ color: '#F57C00' }} />
            <div>
              <div className="text-sm font-medium" style={{ color: '#F57C00' }}>新增西南节点</div>
              <div className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                西南地区覆盖不足，建议在成都建立配送中心，投资 ¥4.2M
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StrategyPage;
