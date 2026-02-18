import React, { useState, useEffect, useCallback } from 'react';
import { Settings, MapPin, TrendingUp, DollarSign, AlertTriangle, Globe, BarChart3, RefreshCw } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import axios from 'axios';
import { getNetworkData } from '@/services/api/strategy';
import { NetworkNode, NetworkOptimization, NetworkStats, RiskAlert } from './types';

// 风险提示数据（保持静态，后续可接入 API）
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
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [optimizations, setOptimizations] = useState<NetworkOptimization[]>([]);
  const [stats, setStats] = useState<NetworkStats>({
    totalNodes: 0,
    averageUtilization: 0,
    totalCost: '¥0万',
    coverage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNetworkData();
      setNodes(data.nodes);
      setOptimizations(data.optimizations);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            配置
          </Button>
        </div>
      </div>

      {/* Loading 状态 */}
      {loading && (
        <div className="flex items-center justify-center py-12" style={{ color: '#7A8BA8' }}>
          <RefreshCw className="w-6 h-6 mr-2 animate-spin" />
          <span>加载数据中...</span>
        </div>
      )}

      {/* Error 状态 */}
      {error && (
        <Card className="p-4 mb-4" style={{ background: 'rgba(229,57,53,0.1)', borderColor: '#E53935' }}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" style={{ color: '#E53935' }} />
            <span style={{ color: '#E53935' }}>加载失败</span>
          </div>
          <p className="text-sm mt-2" style={{ color: '#B0BEC5' }}>{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={loadData}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            重试
          </Button>
        </Card>
      )}

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
      <Card className="p-4 mb-4">
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

      {/* 风险提示模块 */}
      <Card className="p-4 mb-4" style={{ borderLeft: '4px solid #E53935' }}>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4" style={{ color: '#E53935' }} />
          <h3 className="text-sm font-medium" style={{ color: '#E8EDF4' }}>风险预警提示</h3>
        </div>
        <div className="space-y-3">
          {riskAlerts.map((risk) => (
            <div
              key={risk.id}
              className="p-3 rounded border"
              style={{
                background: 'rgba(229,57,53,0.05)',
                borderColor: risk.severity === 'high' ? 'rgba(229,57,53,0.3)' : 'rgba(245,124,0,0.3)',
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center"
                  style={{
                    background:
                      risk.type === 'logistics'
                        ? 'rgba(33,150,243,0.2)'
                        : risk.type === 'capacity'
                          ? 'rgba(255,152,0,0.2)'
                          : 'rgba(156,39,176,0.2)',
                  }}
                >
                  {risk.type === 'logistics' ? (
                    <Globe className="w-4 h-4" style={{ color: '#2196F3' }} />
                  ) : risk.type === 'capacity' ? (
                    <BarChart3 className="w-4 h-4" style={{ color: '#FF9800' }} />
                  ) : (
                    <AlertTriangle className="w-4 h-4" style={{ color: '#9C27B0' }} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-medium text-sm"
                      style={{
                        color:
                          risk.severity === 'high'
                            ? '#E53935'
                            : risk.severity === 'medium'
                              ? '#F57C00'
                              : '#FF9800',
                      }}
                    >
                      {risk.title}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        background:
                          risk.severity === 'high'
                            ? 'rgba(229,57,53,0.2)'
                            : 'rgba(245,124,0,0.2)',
                        color:
                          risk.severity === 'high'
                            ? '#E53935'
                            : '#F57C00',
                      }}
                    >
                      {risk.severity === 'high' ? '高风险' : '中风险'}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: '#B0BEC5' }}>
                    {risk.description}
                  </div>
                  <div className="mt-2 p-2 rounded text-xs" style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <span className="font-medium" style={{ color: '#4CAF50' }}>应对建议：</span>
                    <span style={{ color: '#B0BEC5' }}>{risk.mitigation}</span>
                  </div>
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
