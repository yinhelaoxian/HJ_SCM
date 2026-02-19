import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Settings, MapPin, TrendingUp, DollarSign, AlertTriangle, Globe, BarChart3, RefreshCw, Search, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Select } from '@/ui/Select';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import { getNetworkData } from '@/services/api/strategy';
import { NetworkNode, NetworkOptimization, NetworkStats, RiskAlert } from './types';

// 筛选选项类型定义
interface FilterOptions {
  type: 'all' | 'factory' | 'dc' | 'warehouse';
  location: 'all' | 'qingdao' | 'su' | 'thailand' | 'north';
  sortUtilization: 'none' | 'high' | 'low';
  search: string;
}

// 地域映射
const locationMap: Record<string, string> = {
  qingdao: '青岛',
  su: '苏州',
  thailand: '泰国',
  north: '华北',
};

// 类型映射
const typeMap: Record<string, string> = {
  factory: '工厂',
  dc: '配送中心',
  warehouse: '仓库',
};

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

  // 筛选状态
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    location: 'all',
    sortUtilization: 'none',
    search: '',
  });

  // 高亮节点状态
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const nodeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 处理图表点击事件
  const handleChartClick = useCallback(
    (params: any) => {
      const chartData = filteredNodes.slice(0, 12);
      const nodeIndex = params.dataIndex;
      const node = chartData[nodeIndex];
      if (!node) return;

      setHighlightedNodeId(node.id);

      // 滚动到对应节点
      const nodeElement = nodeRefs.current[node.id];
      if (nodeElement) {
        nodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // 3秒后取消高亮
      setTimeout(() => {
        setHighlightedNodeId(null);
      }, 3000);
    },
    [filteredNodes]
  );

  // 使用 useMemo 计算筛选后的节点
  const filteredNodes = useMemo(() => {
    let result = [...nodes];

    // 类型筛选
    if (filters.type !== 'all') {
      result = result.filter((node) => node.type === filters.type);
    }

    // 地域筛选
    if (filters.location !== 'all') {
      const locationNames: Record<string, string[]> = {
        qingdao: ['青岛'],
        su: ['苏州'],
        thailand: ['泰国'],
        north: ['华北'],
      };
      const targetLocations = locationNames[filters.location] || [];
      result = result.filter((node) => 
        targetLocations.some((loc) => node.location.includes(loc))
      );
    }

    // 搜索筛选（节点名称）
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((node) =>
        node.name.toLowerCase().includes(searchLower)
      );
    }

    // 利用率排序
    if (filters.sortUtilization !== 'none') {
      result.sort((a, b) => 
        filters.sortUtilization === 'high' 
          ? b.utilization - a.utilization 
          : a.utilization - b.utilization
      );
    }

    return result;
  }, [nodes, filters]);

  // 筛选后的统计
  const filteredStats = useMemo(() => {
    const utilizationValues = filteredNodes.map((n) => n.utilization);
    const avgUtilization = utilizationValues.length > 0
      ? Math.round(utilizationValues.reduce((a, b) => a + b, 0) / utilizationValues.length)
      : 0;

    return {
      totalNodes: filteredNodes.length,
      averageUtilization: avgUtilization,
      highLoadNodes: filteredNodes.filter((n) => n.utilization > 90).length,
    };
  }, [filteredNodes]);

  // ECharts 图表配置
  const utilizationChartOption = useMemo(() => {
    const chartData = filteredNodes.slice(0, 12); // 最多显示12个节点
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1A2235',
        borderColor: '#2D7DD2',
        textStyle: { color: '#E8EDF4' },
        formatter: (params: any) => {
          const dataIndex = params[0].dataIndex;
          const node = chartData[dataIndex];
          if (!node) return '';
          return `
            <div style="padding: 8px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${node.name}</div>
              <div style="color: #7A8BA8; font-size: 12px;">${node.location} · ${typeMap[node.type]}</div>
              <div style="margin-top: 8px;">
                <span style="color: #7A8BA8;">利用率：</span>
                <span style="color: ${node.utilization > 90 ? '#E53935' : node.utilization > 80 ? '#F57C00' : '#00897B'}; font-weight: 600;">
                  ${node.utilization}%
                </span>
              </div>
              <div>
                <span style="color: #7A8BA8;">成本：</span>
                <span style="color: #F57C00;">${node.cost}</span>
              </div>
            </div>
          `;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: chartData.map((n) => n.name),
        axisLabel: {
          color: '#7A8BA8',
          fontSize: 11,
          rotate: 30,
          interval: 0,
          formatter: (value: string) => (value.length > 6 ? value.slice(0, 6) + '...' : value),
        },
        axisLine: { lineStyle: { color: '#1E2D45' } },
      },
      yAxis: {
        type: 'value',
        max: 120,
        axisLabel: { color: '#7A8BA8', formatter: '{value}%' },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } },
      },
      series: [
        {
          name: '利用率',
          type: 'bar',
          barWidth: '50%',
          data: chartData.map((n) => ({
            value: n.utilization,
            itemStyle: {
              color:
                n.utilization > 90
                  ? '#E53935'
                  : n.utilization > 80
                    ? '#F57C00'
                    : '#00897B',
              borderRadius: [4, 4, 0, 0],
            },
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(45, 125, 210, 0.5)',
              borderColor: '#2D7DD2',
              borderWidth: 2,
            },
          },
          select: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(45, 125, 210, 0.5)',
              borderColor: '#2D7DD2',
              borderWidth: 2,
            },
          },
        },
      ],
    };
  }, [filteredNodes]);

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

      {/* 筛选栏 */}
      <div className="flex items-center gap-4 mb-6 p-4 rounded border" style={{ background: '#131926', borderColor: '#1E2D45' }}>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: '#7A8BA8' }} />
          <span className="text-sm font-medium" style={{ color: '#E8EDF4' }}>筛选条件</span>
        </div>
        
        {/* 类型筛选 */}
        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: '#7A8BA8' }}>类型</label>
          <Select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value as FilterOptions['type'] })}
            style={{ minWidth: 120 }}
          >
            <option value="all">全部</option>
            <option value="factory">工厂</option>
            <option value="dc">配送中心</option>
            <option value="warehouse">仓库</option>
          </Select>
        </div>

        {/* 地域筛选 */}
        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: '#7A8BA8' }}>地域</label>
          <Select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value as FilterOptions['location'] })}
            style={{ minWidth: 100 }}
          >
            <option value="all">全部</option>
            <option value="qingdao">青岛</option>
            <option value="su">苏州</option>
            <option value="thailand">泰国</option>
            <option value="north">华北</option>
          </Select>
        </div>

        {/* 利用率排序 */}
        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: '#7A8BA8' }}>利用率</label>
          <Select
            value={filters.sortUtilization}
            onChange={(e) => setFilters({ ...filters, sortUtilization: e.target.value as FilterOptions['sortUtilization'] })}
            style={{ minWidth: 120 }}
          >
            <option value="none">全部</option>
            <option value="high">高到低</option>
            <option value="low">低到高</option>
          </Select>
        </div>

        {/* 搜索框 */}
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A8BA8' }} />
            <input
              type="text"
              placeholder="搜索节点名称..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-sm rounded border bg-[#0D1421] placeholder-[#445568]"
              style={{ 
                borderColor: '#1E2D45', 
                color: '#E8EDF4',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* 重置按钮 */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setFilters({ type: 'all', location: 'all', sortUtilization: 'none', search: '' })}
        >
          重置
        </Button>
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
            {filteredStats.totalNodes}
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
            {filteredStats.averageUtilization}%
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
            <AlertTriangle className="w-4 h-4" style={{ color: '#E53935' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>高负荷节点</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E53935' }}>
            {filteredStats.highLoadNodes}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>
            利用率 &gt; 90%
          </div>
        </Card>
      </div>

      {/* 节点利用率图表 */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium flex items-center gap-2" style={{ color: '#E8EDF4' }}>
            <BarChart3 className="w-4 h-4" style={{ color: '#2D7DD2' }} />
            节点利用率分布
          </h3>
          <span className="text-xs" style={{ color: '#7A8BA8' }}>
            点击柱状图可定位到对应节点
          </span>
        </div>
        <ReactECharts
          option={utilizationChartOption}
          style={{ height: 280 }}
          onEvents={{ click: handleChartClick }}
        />
      </Card>

      {/* 网络节点列表 */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium" style={{ color: '#E8EDF4' }}>网络节点管理</h3>
          <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(45,125,210,0.1)', color: '#2D7DD2' }}>
            筛选 {filteredStats.totalNodes} / {nodes.length} 节点
          </span>
        </div>
        <div className="space-y-3">
          {filteredNodes.length === 0 ? (
            <div className="text-center py-8" style={{ color: '#7A8BA8' }}>
              <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>没有符合条件的节点</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setFilters({ type: 'all', location: 'all', sortUtilization: 'none', search: '' })}
              >
                重置筛选
              </Button>
            </div>
          ) : (
            filteredNodes.map((node) => (
              <div
                key={node.id}
                ref={(el) => (nodeRefs.current[node.id] = el)}
                className="flex items-center justify-between p-4 rounded border transition-all duration-300"
                style={{
                  background: highlightedNodeId === node.id ? 'rgba(45, 125, 210, 0.15)' : '#131926',
                  borderColor: highlightedNodeId === node.id ? '#2D7DD2' : '#1E2D45',
                  borderWidth: highlightedNodeId === node.id ? '2px' : '1px',
                  boxShadow: highlightedNodeId === node.id ? '0 0 20px rgba(45, 125, 210, 0.3)' : 'none',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center text-lg"
                    style={{ background: 'rgba(45,125,210,0.1)' }}
                  >
                    {node.type === 'factory' ? '🏭' : node.type === 'dc' ? '🏬' : '📦'}
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: '#E8EDF4' }}>
                      {node.name}
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#445568' }}>
                      {node.location} · {typeMap[node.type]}
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
            ))
          )}
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
