import React, { useEffect, useState, useMemo } from 'react';
import { Settings, BarChart3, TrendingUp, DollarSign, Target, AlertCircle, RefreshCw, Search, Filter } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Select } from '@/ui/Select';
import { getPortfolioData } from '@/services/api/strategy';

interface PortfolioItem {
  id: number;
  name: string;
  category: string;
  sales: string;
  margin: number;
  growth: number;
  risk: string;
  riskLevel: number;
}

interface PortfolioOptimization {
  category: string;
  margin: number;
  risk: string;
  allocation: number;
  recommendation: string;
}

interface PortfolioRecommendation {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  potential: string;
}

interface PortfolioStats {
  totalProducts: number;
  topProducts: number;
  averageMargin: number;
  totalRevenue: string;
}

interface PortfolioData {
  items: PortfolioItem[];
  optimizations: PortfolioOptimization[];
}

// 筛选选项类型定义
interface FilterOptions {
  type: 'all' | 'sensor' | 'controller' | 'traditional';
  margin: 'all' | 'high' | 'medium' | 'low';
  risk: 'all' | 'high' | 'medium' | 'low';
  search: string;
}

// 产品类型映射
const productTypeMap: Record<string, string> = {
  sensor: '智能传感器',
  controller: '电子控制器',
  traditional: '传统电子组件',
};

/**
 * 产品组合分析页面
 *
 * 功能：产品组合管理、销售分析、盈利能力评估、优化建议
 */
const PortfolioAnalysisPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PortfolioStats>({
    totalProducts: 0,
    topProducts: 0,
    averageMargin: 0,
    totalRevenue: '¥0'
  });
  const [products, setProducts] = useState<PortfolioItem[]>([]);
  const [portfolioAnalysis, setPortfolioAnalysis] = useState<PortfolioOptimization[]>([]);
  const [recommendations, setRecommendations] = useState<PortfolioRecommendation[]>([]);

  // 筛选状态
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    margin: 'all',
    risk: 'all',
    search: '',
  });

  // 使用 useMemo 计算筛选后的产品
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 产品类型筛选
    if (filters.type !== 'all') {
      const typeMap: Record<string, string> = {
        sensor: '智能传感器',
        controller: '电子控制器',
        traditional: '传统电子组件',
      };
      result = result.filter((product) => product.category === typeMap[filters.type]);
    }

    // 利润率筛选
    if (filters.margin !== 'all') {
      const marginRanges: Record<string, (margin: number) => boolean> = {
        high: (m) => m >= 35,
        medium: (m) => m >= 20 && m < 35,
        low: (m) => m < 20,
      };
      result = result.filter((product) => marginRanges[filters.margin](product.margin));
    }

    // 风险等级筛选
    if (filters.risk !== 'all') {
      const riskMap: Record<string, string> = {
        high: '高',
        medium: '中',
        low: '低',
      };
      result = result.filter((product) => product.risk === riskMap[filters.risk]);
    }

    // 搜索筛选（产品名称）
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [products, filters]);

  // 筛选后的统计
  const filteredStats = useMemo(() => {
    const totalProducts = filteredProducts.length;
    const topProducts = filteredProducts.filter((p) => p.growth > 0).length;
    const averageMargin = filteredProducts.length > 0
      ? Math.round(filteredProducts.reduce((sum, p) => sum + p.margin, 0) / filteredProducts.length * 10) / 10
      : 0;
    const totalRevenue = filteredProducts.reduce((sum, p) => {
      const numStr = p.sales.replace(/[^\d.-]/g, '');
      return sum + parseFloat(numStr) || 0;
    }, 0);
    const formattedRevenue = `¥${Math.round(totalRevenue / 1000000)}M`;

    return {
      totalProducts,
      topProducts,
      averageMargin,
      totalRevenue: formattedRevenue,
    };
  }, [filteredProducts]);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPortfolioData() as any;

        // 计算统计数据
        const items = data.items || [];
        const totalProducts = items.length;
        const topProducts = items.filter(p => p.growth > 0).length;
        const averageMargin = items.length > 0
          ? Math.round(items.reduce((sum, p) => sum + p.margin, 0) / items.length * 10) / 10
          : 0;
        const totalRevenue = items.reduce((sum, p) => {
          const numStr = p.sales.replace(/[^\d.-]/g, '');
          return sum + parseFloat(numStr) || 0;
        }, 0);
        const formattedRevenue = `¥${Math.round(totalRevenue / 1000000)}M`;

        setStats({
          totalProducts,
          topProducts,
          averageMargin,
          totalRevenue: formattedRevenue
        });
        setProducts(items as any);
        setPortfolioAnalysis(data.optimizations as any || []);

        // 生成优化建议
        const recs: PortfolioRecommendation[] = [];
        items.forEach((item, index) => {
          recs.push({
            id: index + 1,
            title: `重点发展${item.category}业务`,
            description: `高利润(${item.margin}%)低滞销风险，应加大研发投入与产能扩张`,
            priority: item.riskLevel <= 1 ? 'high' : item.riskLevel === 2 ? 'medium' : 'high',
            potential: `+${item.growth > 0 ? item.growth : Math.abs(item.growth)}%`
          });
        });
        setRecommendations(recs);
      } catch (err) {
        console.error('Failed to fetch portfolio data:', err);
        setError('获取产品组合数据失败，请稍后重试');
        // 使用默认数据
        setProducts([
          { id: '1', name: '智能电机', category: '智能传感器', margin: 28, risk: 'low', revenue: '¥1.2亿', cost: '¥8640万', profit: '¥3360万', trend: 'up', sales: '1.2亿', growth: 15 },
          { id: '2', name: '控制器模块', category: '电子控制器', margin: 22, risk: 'medium', revenue: '¥8000万', cost: '¥6240万', profit: '¥1760万', trend: 'stable', sales: '8000万', growth: 5 },
          { id: '3', name: '传感器组件', category: '传统电子组件', margin: 15, risk: 'high', revenue: '¥5000万', cost: '¥4250万', profit: '¥750万', trend: 'down', sales: '5000万', growth: -8 },
        ] as any);
        setPortfolioAnalysis([
          { id: '1', title: '提升高毛利产品占比', description: '将智能电机产能提升20%', impact: '利润增加¥500万', difficulty: 'medium', status: 'pending' },
          { id: '2', title: '淘汰低毛利产品', description: '逐步淘汰传感器组件', impact: '释放产能用于高毛利产品', difficulty: 'hard', status: 'approved' },
        ] as any);
        setStats({ totalProducts: 3, topProducts: 2, averageMargin: 22, totalRevenue: '¥25M' });
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  // 面包屑组件
  const Breadcrumb = () => (
    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <span>战略管理</span>
      <span>/</span>
      <span className="text-white">产品组合</span>
    </div>
  );

  // 页面布局组件
  const PageLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="page-enter">
      <Breadcrumb />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
            产品组合分析
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>产品销售与盈利能力综合分析</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setLoading(true);
              setError(null);
              getPortfolioData()
                .then((data) => {
                  const items = data.items || [];
                  const totalProducts = items.length;
                  const topProducts = items.filter(p => p.growth > 0).length;
                  const averageMargin = items.length > 0
                    ? Math.round(items.reduce((sum, p) => sum + p.margin, 0) / items.length * 10) / 10
                    : 0;
                  const totalRevenue = items.reduce((sum, p) => {
                    const numStr = p.sales.replace(/[^\d.-]/g, '');
                    return sum + parseFloat(numStr) || 0;
                  }, 0);
                  const formattedRevenue = `¥${Math.round(totalRevenue / 1000000)}M`;

                  setStats({
                    totalProducts,
                    topProducts,
                    averageMargin,
                    totalRevenue: formattedRevenue
                  });
                  setProducts(items as any);
                  setPortfolioAnalysis(data.optimizations as any || []);
                })
                .catch((err) => {
                  console.error('Failed to refresh portfolio data:', err);
                  setError('获取产品组合数据失败，请稍后重试');
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            配置
          </Button>
        </div>
      </div>
      {children}
    </div>
  );

  // 筛选栏组件
  const FilterBar = () => (
    <div className="flex items-center gap-4 mb-6 p-4 rounded border" style={{ background: '#131926', borderColor: '#1E2D45' }}>
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4" style={{ color: '#7A8BA8' }} />
        <span className="text-sm font-medium" style={{ color: '#E8EDF4' }}>筛选条件</span>
      </div>
      
      {/* 产品类型筛选 */}
      <div className="flex items-center gap-2">
        <label className="text-sm" style={{ color: '#7A8BA8' }}>产品类型</label>
        <Select
          value={filters.type}
          onChange={(value) => setFilters({ ...filters, type: value as FilterOptions['type'] })}
          options={[
            { value: 'all', label: '全部' },
            { value: 'sensor', label: '智能传感器' },
            { value: 'controller', label: '电子控制器' },
            { value: 'traditional', label: '传统电子组件' },
          ]}
          style={{ minWidth: 140 }}
        />
      </div>

      {/* 利润率筛选 */}
      <div className="flex items-center gap-2">
        <label className="text-sm" style={{ color: '#7A8BA8' }}>利润率</label>
        <Select
          value={filters.margin}
          onChange={(value) => setFilters({ ...filters, margin: value as FilterOptions['margin'] })}
          options={[
            { value: 'all', label: '全部' },
            { value: 'high', label: '高' },
            { value: 'medium', label: '中' },
            { value: 'low', label: '低' },
          ]}
          style={{ minWidth: 100 }}
        />
      </div>

      {/* 风险等级筛选 */}
      <div className="flex items-center gap-2">
        <label className="text-sm" style={{ color: '#7A8BA8' }}>风险等级</label>
        <Select
          value={filters.risk}
          onChange={(value) => setFilters({ ...filters, risk: value as FilterOptions['risk'] })}
          options={[
            { value: 'all', label: '全部' },
            { value: 'high', label: '高' },
            { value: 'medium', label: '中' },
            { value: 'low', label: '低' },
          ]}
          style={{ minWidth: 100 }}
        />
      </div>

      {/* 搜索框 */}
      <div className="flex-1 flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A8BA8' }} />
          <input
            type="text"
            placeholder="搜索产品名称..."
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
        variant="ghost" 
        size="sm"
        onClick={() => setFilters({ type: 'all', margin: 'all', risk: 'all', search: '' })}
      >
        重置
      </Button>
    </div>
  );

  // Loading 状态
  const LoadingView = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <RefreshCw className="w-8 h-8 animate-spin mb-4" style={{ color: '#2D7DD2' }} />
      <p style={{ color: '#7A8BA8' }}>加载产品组合数据中...</p>
    </div>
  );

  // Error 状态
  const ErrorView = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertCircle className="w-8 h-8 mb-4" style={{ color: '#E53935' }} />
      <p style={{ color: '#E8EDF4' }} className="mb-2">{error}</p>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => {
          setLoading(true);
          setError(null);
          getPortfolioData()
            .then((data) => {
              const items = data.items || [];
              const totalProducts = items.length;
              const topProducts = items.filter(p => p.growth > 0).length;
              const averageMargin = items.length > 0
                ? Math.round(items.reduce((sum, p) => sum + p.margin, 0) / items.length * 10) / 10
                : 0;
              const totalRevenue = items.reduce((sum, p) => {
                const numStr = p.sales.replace(/[^\d.-]/g, '');
                return sum + parseFloat(numStr) || 0;
              }, 0);
              const formattedRevenue = `¥${Math.round(totalRevenue / 1000000)}M`;

              setStats({
                totalProducts,
                topProducts,
                averageMargin,
                totalRevenue: formattedRevenue
              });
              setProducts(items as any);
              setPortfolioAnalysis(data.optimizations as any || []);
            })
            .catch((err) => {
              console.error('Failed to refresh portfolio data:', err);
              setError('获取产品组合数据失败，请稍后重试');
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      >
        重试
      </Button>
    </div>
  );

  // 渲染内容
  const renderContent = () => {
    if (loading && products.length === 0) {
      return <LoadingView />;
    }

    if (error && products.length === 0) {
      return <ErrorView />;
    }

    return (
      <>
        <FilterBar />

        {/* 产品组合统计 */}
        <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4" style={{ color: '#2D7DD2' }} />
              <span className="text-sm" style={{ color: '#7A8BA8' }}>产品总数</span>
            </div>
            <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>
              {filteredStats.totalProducts}
            </div>
            <div className="text-xs mt-1" style={{ color: '#445568' }}>
              覆盖 5 个产品类别
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4" style={{ color: '#00897B' }} />
              <span className="text-sm" style={{ color: '#7A8BA8' }}>热销产品</span>
            </div>
            <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>
              {filteredStats.topProducts}
            </div>
            <div className="text-xs mt-1" style={{ color: '#445568' }}>
              销售额占比 65%
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4" style={{ color: '#F57C00' }} />
              <span className="text-sm" style={{ color: '#7A8BA8' }}>平均毛利率</span>
            </div>
            <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>
              {filteredStats.averageMargin}%
            </div>
            <div className="text-xs mt-1" style={{ color: '#445568' }}>
              目标 35%
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4" style={{ color: '#E53935' }} />
              <span className="text-sm" style={{ color: '#7A8BA8' }}>总营收</span>
            </div>
            <div className="text-2xl font-display font-bold" style={{ color: '#E53935' }}>
              {filteredStats.totalRevenue}
            </div>
            <div className="text-xs mt-1" style={{ color: '#445568' }}>
              本年度累计销售额
            </div>
          </Card>
        </div>

        {/* 产品组合列表 */}
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium" style={{ color: '#E8EDF4' }}>豪江智能产品组合（电子/智能制造）</h3>
            <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(45,125,210,0.1)', color: '#2D7DD2' }}>
              筛选 {filteredProducts.length} / {products.length} 产品
            </span>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8" style={{ color: '#7A8BA8' }}>
              <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>没有符合条件的产品</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2"
                onClick={() => setFilters({ type: 'all', margin: 'all', risk: 'all', search: '' })}
              >
                重置筛选
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 rounded border"
                  style={{ background: '#131926', borderColor: '#1E2D45' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded flex items-center justify-center text-lg"
                      style={{ background: 'rgba(45,125,210,0.1)' }}>
                      {product.category === '智能传感器' ? '📡' : product.category === '电子控制器' ? '🔲' : '⚙️'}
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: '#E8EDF4' }}>
                        {product.name}
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#445568' }}>
                        {product.category} · 滞销风险: 
                        <span style={{ 
                          color: product.risk === '低' ? '#00897B' : product.risk === '中' ? '#F57C00' : '#E53935',
                          marginLeft: '4px'
                        }}>
                          {product.risk}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm" style={{ color: '#E8EDF4' }}>
                        {product.sales}
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#445568' }}>
                        销售额
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm" style={{ color: '#E8EDF4' }}>
                        {product.margin}%
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#445568' }}>
                        毛利率
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm" style={{ color: '#E8EDF4' }}>
                        {product.growth > 0 ? `+${product.growth}%` : `${product.growth}%`}
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#445568' }}>
                        增长率
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">分析</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 利润率 vs 风险平衡分析 */}
        <Card className="p-4 mb-4">
          <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>利润率 vs 风险平衡分析</h3>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {portfolioAnalysis.map((item, index) => (
              <div key={index} className="p-4 rounded border"
                style={{ background: '#131926', borderColor: '#1E2D45' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium" style={{ color: '#E8EDF4' }}>{item.category}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    item.risk === '低' ? 'bg-green-900 text-green-400' :
                    item.risk === '中' ? 'bg-orange-900 text-orange-400' :
                    'bg-red-900 text-red-400'
                  }`}>
                    风险: {item.risk}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#7A8BA8' }}>利润率</span>
                    <span style={{ color: '#E8EDF4' }}>{item.margin}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#7A8BA8' }}>当前占比</span>
                    <span style={{ color: '#E8EDF4' }}>{item.allocation}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#7A8BA8' }}>优化建议</span>
                    <span style={{ 
                      color: item.recommendation === '重点发展' ? '#00897B' :
                      item.recommendation === '稳定经营' ? '#F57C00' : '#E53935'
                    }}>
                      {item.recommendation}
                    </span>
                  </div>
                </div>
                {/* 可视化进度条 */}
                <div className="mt-3 h-1.5 rounded-full" style={{ background: '#1E2D45' }}>
                  <div 
                    className="h-1.5 rounded-full"
                    style={{ 
                      width: `${item.margin}%`,
                      background: item.margin >= 40 ? '#00897B' : item.margin >= 20 ? '#F57C00' : '#E53935'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 产品组合优化建议 */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>产品组合优化建议</h3>
          <p className="text-xs mb-4" style={{ color: '#7A8BA8' }}>
            基于利润率与风险平衡分析，建议优化方向如下：
          </p>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.id} className="flex items-start gap-3 p-3 rounded"
                style={{
                  background: rec.priority === 'high' ? 'rgba(229,57,53,0.08)' :
                    rec.priority === 'medium' ? 'rgba(245,124,0,08)' : 'rgba(0,137,123,0.08)'
                }}>
                <Target className="w-4 h-4 mt-0.5"
                  style={{
                    color: rec.priority === 'high' ? '#E53935' :
                      rec.priority === 'medium' ? '#F57C00' : '#00897B'
                  }} />
                <div className="flex-1">
                  <div className="font-medium"
                    style={{
                      color: rec.priority === 'high' ? '#E53935' :
                        rec.priority === 'medium' ? '#F57C00' : '#00897B'
                    }}>
                    {rec.title}
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                    {rec.description}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm" style={{ color: '#E8EDF4' }}>
                    {rec.potential}
                  </div>
                  <div className="text-xs" style={{ color: '#445568' }}>
                    预计提升
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  };

  return (
    <PageLayout>
      {renderContent()}
    </PageLayout>
  );
};

export default PortfolioAnalysisPage;
