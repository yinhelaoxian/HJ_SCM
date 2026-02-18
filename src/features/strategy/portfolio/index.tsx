import React from 'react';
import { Settings, BarChart3, TrendingUp, DollarSign, Target } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { PortfolioTypes } from './types';

/**
 * 产品组合分析页面
 *
 * 功能：产品组合管理、销售分析、盈利能力评估、优化建议
 */
const PortfolioAnalysisPage: React.FC = () => {
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
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            配置
          </Button>
        </div>
      </div>
      {children}
    </div>
  );

  // 模拟数据
  const stats = {
    totalProducts: 156,
    topProducts: 24,
    averageMargin: 32.5,
    totalRevenue: '¥89M'
  };

  // 豪江智能多产品线数据 - 电子/智能制造
  const products = [
    { id: 1, name: '智能传感器系列', category: '智能传感器', sales: '¥35.2M', margin: 45, growth: 18, risk: '低', riskLevel: 1 },
    { id: 2, name: '电子控制器系列', category: '电子控制器', sales: '¥28.6M', margin: 28, growth: 12, risk: '中', riskLevel: 2 },
    { id: 3, name: '传统电子组件', category: '传统电子', sales: '¥25.2M', margin: 12, growth: -8, risk: '高', riskLevel: 3 }
  ];

  // 利润率 vs 风险平衡分析 - 豪江智能产品组合
  const portfolioAnalysis = [
    { category: '智能传感器', margin: 45, risk: '低', allocation: 35, recommendation: '重点发展' },
    { category: '电子控制器', margin: 28, risk: '中', allocation: 40, recommendation: '稳定经营' },
    { category: '传统电子', margin: 12, risk: '高', allocation: 25, recommendation: '逐步收缩' }
  ];

  const recommendations = [
    { id: 1, title: '重点发展智能传感器业务', description: '高利润(45%)低滞销风险，应加大研发投入与产能扩张', priority: 'high', potential: '+25%' },
    { id: 2, title: '优化电子控制器产品结构', description: '中利润中风险，需控制库存深度，聚焦高周转型号', priority: 'medium', potential: '+15%' },
    { id: 3, title: '收缩传统电子组件线', description: '低利润(12%)高滞销风险，建议逐步削减SKU并清库存', priority: 'high', potential: '+12%' },
    { id: 4, title: '建立多产品线风险联动机制', description: '跨产品线滞销风险预警，统一财务资源调配', priority: 'medium', potential: '+8%' },
    { id: 5, title: '财务约束下的组合优化', description: '在资金有限时优先保障高利润产品线，降低低效产品占比', priority: 'low', potential: '+10%' }
  ];

  return (
    <PageLayout>
      {/* 产品组合统计 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4" style={{ color: '#2D7DD2' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>产品总数</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>
            {stats.totalProducts}
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
            {stats.topProducts}
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
            {stats.averageMargin}%
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
            {stats.totalRevenue}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>
            本年度累计销售额
          </div>
        </Card>
      </div>

      {/* 产品组合列表 */}
      <Card className="p-4 mb-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>豪江智能产品组合（电子/智能制造）</h3>
        <div className="space-y-3">
          {products.map((product) => (
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
                <Button variant="outline" size="sm">分析</Button>
              </div>
            </div>
          ))}
        </div>
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
                  rec.priority === 'medium' ? 'rgba(245,124,0.08)' : 'rgba(0,137,123,0.08)'
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
    </PageLayout>
  );
};

export default PortfolioAnalysisPage;
