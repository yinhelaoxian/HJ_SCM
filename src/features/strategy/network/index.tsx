import React, { useState } from 'react';
import { Settings, MapPin, TrendingUp, DollarSign, AlertTriangle, Globe, BarChart3 } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { NetworkNode, NetworkOptimization, NetworkStats, RiskAlert } from './types';

// 豪江智能真实业务场景数据
const mockNodes: NetworkNode[] = [
  {
    id: '1',
    name: '青岛总部工厂',
    location: '山东省青岛市',
    type: 'factory',
    utilization: 112,
    cost: '¥1,850万',
    capacity: 120,
  },
  {
    id: '2',
    name: '苏州华东工厂',
    location: '江苏省苏州市',
    type: 'factory',
    utilization: 78,
    cost: '¥920万',
    capacity: 100,
  },
  {
    id: '3',
    name: '泰国曼谷工厂',
    location: '泰国曼谷市',
    type: 'factory',
    utilization: 43,
    cost: '¥480万',
    capacity: 80,
  },
  {
    id: '4',
    name: '华北配送中心',
    location: '天津市',
    type: 'dc',
    utilization: 91,
    cost: '¥720万',
    capacity: 95,
  },
];

const mockOptimizations: NetworkOptimization[] = [
  {
    id: '1',
    title: '产能调配优化',
    description: '将华东订单转移部分至泰国工厂，利用其闲置产能',
    priority: 'high',
    cost: '¥120万',
    roi: '18%',
  },
  {
    id: '2',
    title: '青岛工厂产能扩张',
    description: '新增生产线缓解总部超负荷状态',
    priority: 'high',
    cost: '¥2,500万',
    roi: '25%',
  },
  {
    id: '3',
    title: '跨国物流成本优化',
    description: '整合海运与空运渠道，降低运输成本15%',
    priority: 'medium',
    cost: '¥80万',
    roi: '22%',
  },
  {
    id: '4',
    title: '仓储自动化升级',
    description: '天津配送中心引入自动化分拣系统',
    priority: 'medium',
    cost: '¥450万',
    roi: '30%',
  },
];

// 风险提示数据
const riskAlerts: RiskAlert[] = [
  {
    id: '1',
    type: 'logistics',
    title: '跨国物流风险',
    description: '汇率波动（泰铢/人民币）+ 地缘政治不确定性可能影响跨境运输成本与时效',
    severity: 'high',
    mitigation: '建议建立双币种结算机制，增加国内备货缓冲',
  },
  {
    id: '2',
    type: 'capacity',
    title: '产能不均预警',
    description: '青岛总部(112%)超载 vs 泰国工厂(43%)低负荷，产能利用率差距达69%',
    severity: 'high',
    mitigation: '建议加速订单转移，提升泰国工厂至65%以上利用率',
  },
  {
    id: '3',
    type: 'supply',
    title: '供应链中断风险',
    description: '单一供应源依赖度过高，关键零部件库存仅维持15天',
    severity: 'medium',
    mitigation: '建立多元化供应商体系，增加安全库存至30天',
  },
];

/**
 * 网络规划页面
 *
 * 功能：网络节点管理、配送中心布局、成本优化、覆盖范围分析
 */
const NetworkPlanningPage: React.FC = () => {
  const [nodes] = useState<NetworkNode[]>(mockNodes);
  const [optimizations] = useState<NetworkOptimization[]>(mockOptimizations);
  const [stats] = useState<NetworkStats>(() => {
    const totalNodes = mockNodes.length;
    const avgUtilization = Math.round(mockNodes.reduce((sum, n) => sum + n.utilization, 0) / totalNodes);
    const totalCost = mockNodes.reduce((sum, n) => {
      const costNum = parseFloat(n.cost.replace(/[¥,]/g, ''));
      return sum + costNum;
    }, 0);
    return {
      totalNodes,
      averageUtilization: avgUtilization,
      totalCost: `¥${(totalCost / 10000).toFixed(0)}万`,
      coverage: 8,
    };
  });

  if (loading) {
    return (
      <div className="page-enter">
        <div className="flex items-center gap-2 text-sm mb-6" style={{ color: '#7A8BA8' }}>
          <span>战略管理</span>
          <span>/</span>
          <span style={{ color: '#E8EDF4' }}>网络规划</span>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: '#2D7DD2' }} />
            <p style={{ color: '#7A8BA8' }}>加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-enter">
        <div className="flex items-center gap-2 text-sm mb-6" style={{ color: '#7A8BA8' }}>
          <span>战略管理</span>
          <span>/</span>
          <span style={{ color: '#E8EDF4' }}>网络规划</span>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-lg mb-2" style={{ color: '#E53935' }}>数据加载失败</p>
            <p className="text-sm" style={{ color: '#7A8BA8' }}>{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              重试
            </Button>
          </div>
        </div>
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
            {nodes.filter((node) => node.utilization > 90).length}
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
            <div
              key={node.id}
              className="flex items-center justify-between p-4 rounded border"
              style={{ background: '#131926', borderColor: '#1E2D45' }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded flex items-center justify-center text-lg"
                  style={{ background: 'rgba(45,125,210,0.1)' }}
                >
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
                        background:
                          node.utilization > 90
                            ? '#E53935'
                            : node.utilization > 80
                              ? '#F57C00'
                              : '#00897B',
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
                <Button variant="outline" size="sm">
                  优化
                </Button>
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
            <div
              key={opt.id}
              className="flex items-start gap-3 p-3 rounded"
              style={{
                background:
                  opt.priority === 'high'
                    ? 'rgba(229,57,53,0.08)'
                    : opt.priority === 'medium'
                      ? 'rgba(245,124,0,0.08)'
                      : 'rgba(0,137,123,0.08)',
              }}
            >
              <TrendingUp
                className="w-4 h-4 mt-0.5"
                style={{
                  color:
                    opt.priority === 'high'
                      ? '#E53935'
                      : opt.priority === 'medium'
                        ? '#F57C00'
                        : '#00897B',
                }}
              />
              <div className="flex-1">
                <div
                  className="font-medium"
                  style={{
                    color:
                      opt.priority === 'high'
                        ? '#E53935'
                        : opt.priority === 'medium'
                          ? '#F57C00'
                          : '#00897B',
                  }}
                >
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
