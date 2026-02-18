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

  const products = [
    { id: 1, name: '智能手表 Pro', category: '智能穿戴', sales: '¥12.5M', margin: 45, growth: 18 },
    { id: 2, name: '无线耳机 Air', category: '音频设备', sales: '¥8.9M', margin: 38, growth: 12 },
    { id: 3, name: '智能音箱 Mini', category: '智能家居', sales: '¥5.6M', margin: 32, growth: 8 },
    { id: 4, name: '运动手环 Lite', category: '智能穿戴', sales: '¥4.2M', margin: 28, growth: -5 },
    { id: 5, name: '智能灯泡套装', category: '智能家居', sales: '¥3.8M', margin: 42, growth: 25 }
  ];

  const recommendations = [
    { id: 1, title: '重点推广智能手表 Pro', description: '高利润率产品，市场需求增长迅速', priority: 'high', potential: '+25%' },
    { id: 2, title: '优化运动手环 Lite', description: '销量下滑，需改进产品功能或降低成本', priority: 'medium', potential: '+10%' },
    { id: 3, title: '扩展智能音箱系列', description: '智能家居市场前景广阔，可增加产品线', priority: 'low', potential: '+15%' }
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
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>产品组合管理</h3>
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-4 rounded border"
              style={{ background: '#131926', borderColor: '#1E2D45' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded flex items-center justify-center text-lg"
                  style={{ background: 'rgba(45,125,210,0.1)' }}>
                  📱
                </div>
                <div>
                  <div className="font-medium" style={{ color: '#E8EDF4' }}>
                    {product.name}
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#445568' }}>
                    {product.category} · 增长率: {product.growth > 0 ? `+${product.growth}%` : `${product.growth}%`}
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
                <Button variant="outline" size="sm">分析</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 优化建议 */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>产品组合优化建议</h3>
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
