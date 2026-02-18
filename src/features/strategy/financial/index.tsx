import React from 'react';
import { Settings, DollarSign, TrendingUp, AlertCircle, Target } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { FinancialTypes } from './types';

/**
 * 财务约束管理页面
 *
 * 功能：预算管理、成本控制、财务指标分析、投资约束设置
 */
const FinancialConstraintsPage: React.FC = () => {
  // 面包屑组件
  const Breadcrumb = () => (
    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <span>战略管理</span>
      <span>/</span>
      <span className="text-white">财务约束</span>
    </div>
  );

  // 页面布局组件
  const PageLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="page-enter">
      <Breadcrumb />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
            财务约束管理
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>预算控制与财务风险管控</p>
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
  const financialStats = {
    totalBudget: '¥120,000,000',
    usedBudget: '¥85,600,000',
    budgetUtilization: 71.3,
    costSavings: '¥3,200,000',
    investmentConstraints: 5,
    riskLevel: '中等'
  };

  const budgetItems = [
    { id: 1, name: '运输成本', budget: '¥45,000,000', used: '¥32,400,000', utilization: 72, trend: -2.5 },
    { id: 2, name: '仓储成本', budget: '¥30,000,000', used: '¥24,600,000', utilization: 82, trend: 1.8 },
    { id: 3, name: '人力成本', budget: '¥25,000,000', used: '¥18,900,000', utilization: 75.6, trend: 0.5 },
    { id: 4, name: '设备投资', budget: '¥20,000,000', used: '¥9,700,000', utilization: 48.5, trend: -5.2 }
  ];

  const investmentConstraints = [
    { id: 1, title: '资本支出限制', description: '年度资本支出不得超过¥50,000,000', priority: 'high', impact: '严重' },
    { id: 2, title: 'ROI要求', description: '新投资项目ROI需≥12%', priority: 'medium', impact: '中等' },
    { id: 3, title: '现金流约束', description: '月度净现金流需保持正数', priority: 'high', impact: '严重' },
    { id: 4, title: '成本控制目标', description: '物流成本占营收比例需≤8%', priority: 'medium', impact: '中等' },
    { id: 5, title: '预算偏差控制', description: '季度预算偏差需控制在±5%以内', priority: 'low', impact: '轻微' }
  ];

  return (
    <PageLayout>
      {/* 财务统计 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4" style={{ color: '#2D7DD2' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>总预算</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>
            {financialStats.totalBudget}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>
            年度财务预算
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#00897B' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>预算利用率</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>
            {financialStats.budgetUtilization}%
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>
            已使用 ¥{financialStats.usedBudget}
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4" style={{ color: '#F57C00' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>成本节约</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>
            {financialStats.costSavings}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>
            年度成本优化成果
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4" style={{ color: '#E53935' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>风险等级</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E53935' }}>
            {financialStats.riskLevel}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>
            {financialStats.investmentConstraints} 项约束条件
          </div>
        </Card>
      </div>

      {/* 预算项目管理 */}
      <Card className="p-4 mb-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>预算项目管理</h3>
        <div className="space-y-3">
          {budgetItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded border"
              style={{ background: '#131926', borderColor: '#1E2D45' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded flex items-center justify-center text-lg"
                  style={{ background: 'rgba(45,125,210,0.1)' }}>
                  💰
                </div>
                <div>
                  <div className="font-medium" style={{ color: '#E8EDF4' }}>
                    {item.name}
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#445568' }}>
                    预算: {item.budget} · 已使用: {item.used}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-32">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#7A8BA8' }}>利用率</span>
                    <span className="text-xs" style={{ color: '#E8EDF4' }}>
                      {item.utilization}%
                    </span>
                  </div>
                  <div className="h-2 rounded bg-slate-800">
                    <div
                      className="h-full rounded"
                      style={{
                        width: `${item.utilization}%`,
                        background: item.utilization > 90 ? '#E53935' : item.utilization > 80 ? '#F57C00' : '#00897B'
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm" style={{ color: item.trend < 0 ? '#00897B' : '#E53935' }}>
                    {item.trend > 0 ? '+' : ''}{item.trend}%
                  </div>
                  <div className="text-xs" style={{ color: '#445568' }}>
                    环比趋势
                  </div>
                </div>
                <Button variant="outline" size="sm">调整</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 投资约束设置 */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>投资约束条件</h3>
        <div className="space-y-3">
          {investmentConstraints.map((constraint) => (
            <div key={constraint.id} className="flex items-start gap-3 p-3 rounded"
              style={{
                background: constraint.priority === 'high' ? 'rgba(229,57,53,0.08)' :
                  constraint.priority === 'medium' ? 'rgba(245,124,0.08)' : 'rgba(0,137,123,0.08)'
              }}>
              <AlertCircle className="w-4 h-4 mt-0.5"
                style={{
                  color: constraint.priority === 'high' ? '#E53935' :
                    constraint.priority === 'medium' ? '#F57C00' : '#00897B'
                }} />
              <div className="flex-1">
                <div className="font-medium"
                  style={{
                    color: constraint.priority === 'high' ? '#E53935' :
                      constraint.priority === 'medium' ? '#F57C00' : '#00897B'
                  }}>
                  {constraint.title}
                </div>
                <div className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                  {constraint.description}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm" style={{ color: '#E8EDF4' }}>
                  {constraint.impact}
                </div>
                <div className="text-xs" style={{ color: '#445568' }}>
                  影响程度
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PageLayout>
  );
};

export default FinancialConstraintsPage;
