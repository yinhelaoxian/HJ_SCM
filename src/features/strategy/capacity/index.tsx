import React, { useState, useEffect, useMemo } from 'react';
import { Settings, Factory, TrendingUp, DollarSign, Search, Filter, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Select } from '@/ui/Select';
import { CapacityTypes } from './types';
import axios from 'axios';
import { getCapacityData } from '@/services/api/strategy';

// 定义 CapacityData 类型
interface CapacityData {
  id: number;
  name: string;
  location: string;
  type: string;
  capacity: string;
  utilization: number;
  cost: string;
  status: 'overloaded' | 'normal' | 'underloaded';
}

// 筛选选项类型定义
interface FilterOptions {
  type: 'all' | 'factory' | 'assembly';
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
  assembly: '装配厂',
};

interface CapacityOptimization {
  id: number;
  title: string;
  description: string;
  cost: string;
  roi: string;
  priority: 'high' | 'medium' | 'low';
}

interface CapacityForecast {
  year: number;
  capacity: number;
  demand: number;
}

/**
 * 产能投资规划页面
 *
 * 功能：产能分析、投资规划、设备管理、产能优化
 */
const CapacityPlanningPage: React.FC = () => {
  // API 数据状态
  const [data, setData] = useState<CapacityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 筛选状态
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    location: 'all',
    sortUtilization: 'none',
    search: '',
  });

  // 使用 useMemo 计算筛选后的数据
  const filteredData = useMemo(() => {
    let result = [...data];

    // 类型筛选
    if (filters.type !== 'all') {
      result = result.filter((item) => item.type === filters.type);
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
      result = result.filter((item) =>
        targetLocations.some((loc) => item.location.includes(loc))
      );
    }

    // 搜索筛选（工厂名称）
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchLower)
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
  }, [data, filters]);

  // 筛选后的统计
  const filteredStats = useMemo(() => {
    const totalCapacity = filteredData.length > 0
      ? `${(filteredData.reduce((sum, item) => sum + parseFloat(item.capacity.replace(/[^\d.]/g, '')), 0) / 10000).toFixed(1)}万件`
      : '0万件';
    
    const utilization = filteredData.length > 0
      ? `${Math.round(filteredData.reduce((sum, item) => sum + item.utilization, 0) / filteredData.length)}%`
      : '0%';

    return {
      totalCapacity,
      utilization,
      investmentNeeded: '¥4.5亿',
      roi: '16.8%',
      count: filteredData.length,
    };
  }, [filteredData]);

  // 从 API 获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getCapacityData();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 面包屑组件
  const Breadcrumb = () => (
    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <span>战略管理</span>
      <span>/</span>
      <span className="text-white">产能投资</span>
    </div>
  );

  // 页面布局组件
  const PageLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="page-enter">
      <Breadcrumb />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
            产能投资规划
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>产能分析与投资优化</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            配置
          </Button>
        </div>
      </div>
      {children}
    </div>
  );

  // Loading Spinner
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#2D7DD2' }}></div>
      <span className="ml-3" style={{ color: '#7A8BA8' }}>加载中...</span>
    </div>
  );

  // Error Alert
  const ErrorAlert = ({ message }: { message: string }) => (
    <div className="p-4 mb-4 rounded border" style={{ background: 'rgba(229,57,53,0.1)', borderColor: 'rgba(229,57,53,0.3)' }}>
      <div className="flex items-center gap-2">
        <span className="text-lg">❌</span>
        <span className="text-sm font-medium" style={{ color: '#E53935' }}>错误</span>
      </div>
      <p className="text-xs mt-2" style={{ color: '#7A8BA8' }}>{message}</p>
    </div>
  );

  // 产能不均风险提示组件
  const CapacityRiskAlert = ({ capacityItems }: { capacityItems: CapacityData[] }) => {
    if (capacityItems.length === 0) return null;
    
    const maxUtilization = Math.max(...capacityItems.map(item => item.utilization));
    const minUtilization = Math.min(...capacityItems.map(item => item.utilization));
    const gap = maxUtilization - minUtilization;

    return (
      <Card className="p-4 mb-4" style={{ background: 'linear-gradient(135deg, rgba(229,57,53,0.12) 0%, rgba(245,124,0,0.08) 100%)', border: '1px solid rgba(229,57,53,0.3)' }}>
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <h3 className="text-sm font-medium" style={{ color: '#E53935' }}>
              产能不均风险预警
            </h3>
          </div>
          <div className="flex-1 grid gap-3" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {/* 产能差距分析 */}
            <div className="p-3 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="text-xs mb-2" style={{ color: '#7A8BA8' }}>产能差距分析</div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold" style={{ color: '#E53935' }}>{maxUtilization}%</span>
                <span className="text-xs" style={{ color: '#7A8BA8' }}>vs</span>
                <span className="text-xl font-bold" style={{ color: '#00897B' }}>{minUtilization}%</span>
              </div>
              <div className="text-sm mt-1" style={{ color: '#E8EDF4' }}>
                差距: <span className="font-medium" style={{ color: '#F57C00' }}>{gap}%</span>
              </div>
            </div>

            {/* ROI 评估 */}
            <div className="p-3 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="text-xs mb-2" style={{ color: '#7A8BA8' }}>投资建议 ROI 评估</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#7A8BA8' }}>扩建青岛</span>
                  <span style={{ color: '#00897B' }}>+25%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#7A8BA8' }}>提升泰国</span>
                  <span style={{ color: '#00897B' }}>+18%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 投资建议 */}
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(229,57,53,0.2)' }}>
          <div className="text-xs mb-2" style={{ color: '#7A8BA8' }}>投资建议</div>
          <div className="flex gap-3">
            <div className="flex-1 p-2 rounded text-xs" style={{ background: 'rgba(229,57,53,0.1)' }}>
              <div className="font-medium" style={{ color: '#E8EDF4' }}>🏭 扩建青岛总部</div>
              <div style={{ color: '#7A8BA8' }}>产能超载 12%，需扩建</div>
              <div className="mt-1" style={{ color: '#F57C00' }}>投资 ¥1.5亿</div>
            </div>
            <div className="flex-1 p-2 rounded text-xs" style={{ background: 'rgba(0,137,123,0.1)' }}>
              <div className="font-medium" style={{ color: '#E8EDF4' }}>🌏 提升泰国产能</div>
              <div style={{ color: '#7A8BA8' }}>利用率仅 43%，可优化</div>
              <div className="mt-1" style={{ color: '#F57C00' }}>投资 ¥5000万</div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // 计算统计数据
  const stats = {
    totalCapacity: data.length > 0 ? `${(data.reduce((sum, item) => sum + parseFloat(item.capacity.replace(/[^\d.]/g, '')), 0) / 10000).toFixed(1)}万件` : '0万件',
    utilization: data.length > 0 ? `${Math.round(data.reduce((sum, item) => sum + item.utilization, 0) / data.length)}%` : '0%',
    investmentNeeded: '¥4.5亿',
    roi: '16.8%'
  };

  const capacityItems = filteredData;

  // 产能不均风险分析
  const riskAnalysis = {
    gap: filteredData.length > 0 ? Math.max(...filteredData.map(item => item.utilization)) - Math.min(...filteredData.map(item => item.utilization)) : 0,
    suggestions: [
      {
        action: '扩建青岛总部工厂',
        reason: '现有产能超载 12%，建议扩建以满足需求',
        investment: '¥1.5亿',
        expectedRoi: '25%'
      },
      {
        action: '提升泰国产能利用率',
        reason: '产能利用率仅 43%，可通过转移订单提高至 70%',
        investment: '¥5000万',
        expectedRoi: '18%'
      }
    ]
  };

  const investments = [
    {
      id: 1,
      title: '扩建青岛总部工厂',
      description: '新增两条自动化生产线，缓解产能超载压力',
      cost: '¥1.5亿',
      roi: '25.0%',
      priority: 'high' as const
    },
    {
      id: 2,
      title: '提升泰国曼谷工厂产能利用率',
      description: '优化生产排程，转移华东订单至泰国工厂',
      cost: '¥5000万',
      roi: '18.0%',
      priority: 'high' as const
    },
    {
      id: 3,
      title: '苏州工厂设备升级',
      description: '升级现有设备，提高生产效率12%',
      cost: '¥3500万',
      roi: '16.5%',
      priority: 'medium' as const
    }
  ];

  // 显示 Loading 或 Error
  if (loading) {
    return (
      <PageLayout>
        <LoadingSpinner />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <ErrorAlert message={error} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
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
            style={{ minWidth: 100 }}
          >
            <option value="all">全部</option>
            <option value="factory">工厂</option>
            <option value="assembly">装配厂</option>
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
            style={{ minWidth: 100 }}
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
              placeholder="搜索工厂名称..."
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
            onClick={() => {
              const fetchData = async () => {
                try {
                  setLoading(true);
                  setError(null);
                  const result = await getCapacityData();
                  setData(result.data);
                } catch (err) {
                  setError(err instanceof Error ? err.message : '获取数据失败');
                } finally {
                  setLoading(false);
                }
              };
              fetchData();
            }}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            重试
          </Button>
        </Card>
      )}

      {/* 产能统计 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Factory className="w-4 h-4" style={{ color: '#2D7DD2' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>总产能</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>
            {filteredStats.totalCapacity}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>
            {filteredStats.count} 个工厂
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#00897B' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>平均利用率</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>
            {filteredStats.utilization}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>
            目标 85%
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4" style={{ color: '#F57C00' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>投资需求</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>
            {filteredStats.investmentNeeded}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>
            年度投资预算
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#E53935' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>投资回报</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E53935' }}>
            {filteredStats.roi}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>
            平均投资回报率
          </div>
        </Card>
      </div>

      {/* 产能项目列表 */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium" style={{ color: '#E8EDF4' }}>产能项目管理</h3>
          <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(45,125,210,0.1)', color: '#2D7DD2' }}>
            筛选 {filteredStats.count} / {data.length} 工厂
          </span>
        </div>
        {filteredData.length === 0 ? (
          <div className="text-center py-8" style={{ color: '#7A8BA8' }}>
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>没有符合条件的工厂</p>
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
          <div className="space-y-3">
            {capacityItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded border"
              style={{ 
                background: '#131926', 
                borderColor: item.status === 'overloaded' ? 'rgba(229,57,53,0.4)' : 
                           item.status === 'underloaded' ? 'rgba(0,137,123,0.3)' : '#1E2D45'
              }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded flex items-center justify-center text-lg"
                  style={{ 
                    background: item.status === 'overloaded' ? 'rgba(229,57,53,0.15)' : 
                               item.status === 'underloaded' ? 'rgba(0,137,123,0.15)' : 'rgba(45,125,210,0.1)'
                  }}>
                  {item.status === 'overloaded' ? '🔴' : item.status === 'underloaded' ? '🟢' : '🏭'}
                </div>
                <div>
                  <div className="font-medium" style={{ color: '#E8EDF4' }}>
                    {item.name}
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#445568' }}>
                    {item.location} · 类型: {item.type === 'factory' ? '生产工厂' : '装配厂'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-32">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#7A8BA8' }}>利用率</span>
                    <span className="text-xs" style={{ 
                      color: item.utilization > 100 ? '#E53935' : 
                             item.utilization < 50 ? '#00897B' : '#E8EDF4'
                    }}>
                      {item.utilization > 100 ? `${item.utilization}% (超载)` : `${item.utilization}%`}
                    </span>
                  </div>
                  <div className="h-2 rounded bg-slate-800">
                    <div
                      className="h-full rounded"
                      style={{
                        width: `${Math.min(item.utilization, 100)}%`,
                        background: item.utilization > 100 ? '#E53935' : 
                                   item.utilization < 50 ? '#00897B' : 
                                   item.utilization > 80 ? '#F57C00' : '#00897B'
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm" style={{ color: '#E8EDF4' }}>
                    {item.cost}
                  </div>
                  <div className="text-xs" style={{ color: '#445568' }}>
                    投资成本
                  </div>
                </div>
                <Button variant="outline" size="sm">优化</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 产能不均风险提示 */}
      <CapacityRiskAlert capacityItems={capacityItems} />

      {/* 投资建议 */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>投资优化建议</h3>
        <div className="space-y-3">
          {investments.map((inv) => (
            <div key={inv.id} className="flex items-start gap-3 p-3 rounded"
              style={{
                background: inv.priority === 'high' ? 'rgba(229,57,53,0.08)' :
                  inv.priority === 'medium' ? 'rgba(245,124,0.08)' : 'rgba(0,137,123,0.08)'
              }}>
              <TrendingUp className="w-4 h-4 mt-0.5"
                style={{
                  color: inv.priority === 'high' ? '#E53935' :
                    inv.priority === 'medium' ? '#F57C00' : '#00897B'
                }} />
              <div className="flex-1">
                <div className="font-medium"
                  style={{
                    color: inv.priority === 'high' ? '#E53935' :
                      inv.priority === 'medium' ? '#F57C00' : '#00897B'
                  }}>
                  {inv.title}
                </div>
                <div className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                  {inv.description}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm" style={{ color: '#E8EDF4' }}>
                  {inv.cost}
                </div>
                <div className="text-xs" style={{ color: '#445568' }}>
                  ROI: {inv.roi}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PageLayout>
  );
};

export default CapacityPlanningPage;
