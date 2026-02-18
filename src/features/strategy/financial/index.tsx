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

  // 豪江智能财务约束数据
  const financialStats = {
    totalBudget: '¥1,500,000,000',
    usedBudget: '¥850,000,000',
    pendingInvestment: '¥320,000,000',
    budgetUtilization: 56.7,
    costSavings: '¥68,500,000',
    investmentConstraints: 8,
    riskLevel: '较高'
  };

  const budgetItems = [
    { id: 1, name: '研发投入', budget: '¥500,000,000', used: '¥320,000,000', utilization: 64, trend: 2.3 },
    { id: 2, name: '生产基地建设', budget: '¥450,000,000', used: '¥280,000,000', utilization: 62.2, trend: 1.5 },
    { id: 3, name: '智能制造升级', budget: '¥300,000,000', used: '¥180,000,000', utilization: 60, trend: -1.2 },
    { id: 4, name: '市场拓展', budget: '¥250,000,000', used: '¥70,000,000', utilization: 28, trend: 5.8 }
  ];

  const investmentConstraints = [
    { id: 1, title: '年度预算上限', description: '年度总预算不得超过¥15亿元', priority: 'high', impact: '硬性约束' },
    { id: 2, title: '资本支出限制', description: '已分配资本支出¥8.5亿元', priority: 'high', impact: '已占用' },
    { id: 3, title: '待审批投资', description: '待审批投资¥3.2亿元', priority: 'medium', impact: '审批中' },
    { id: 4, title: 'ROI要求', description: '新投资项目ROI需≥15%', priority: 'high', impact: '严格' },
    { id: 5, title: '现金流约束', description: '季度净现金流需保持正数', priority: 'high', impact: '关键' },
    { id: 6, title: '成本控制目标', description: '研发成本占营收比例需≤12%', priority: 'medium', impact: '重要' },
    { id: 7, title: '预算偏差控制', description: '季度预算偏差需控制在±3%以内', priority: 'low', impact: '监控' },
    { id: 8, title: '投资回报周期', description: '项目投资回收期需≤3年', priority: 'medium', impact: '评估' }
  ];

  // 财务风险提示数据
  const financialRisks = [
    {
      id: 1,
      type: 'budget',
      title: '预算超支风险',
      description: '当前预算利用率56.7%，需关注Q3-Q4支出增长趋势',
      severity: 'warning',
      suggestion: '建议加强预算审批流程，严格控制非必要支出'
    },
    {
      id: 2,
      type: 'roi',
      title: 'ROI不达标风险',
      description: '部分研发项目ROI偏低，需优化资源配置',
      severity: 'danger',
      suggestion: '建议建立ROI动态评估机制，及时调整投资组合'
    },
    {
      id: 3,
      type: 'capex',
      title: '资本支出vs回报评估',
      description: '已投入¥8.5亿资本支出，预计回报周期2.5-3年',
      severity: 'info',
      suggestion: '建议定期追踪资本支出回报率，确保投资效益最大化'
    }
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
      <Card className="p-4 mb-4">
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

      {/* 财务风险提示模块 */}
      <Card className="p-4" style={{ background: 'linear-gradient(135deg, rgba(229,57,53,0.1) 0%, rgba(245,124,0,0.08) 100%)' }}>
        <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: '#F57C00' }}>
          <AlertCircle className="w-4 h-4" />
          财务风险提示
        </h3>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {financialRisks.map((risk) => (
            <div key={risk.id} className="p-4 rounded border"
              style={{
                background: risk.severity === 'danger' ? 'rgba(229,57,53,0.12)' :
                  risk.severity === 'warning' ? 'rgba(245,124,0,0.12)' : 'rgba(45,125,210,0.12)',
                borderColor: risk.severity === 'danger' ? '#E53935' :
                  risk.severity === 'warning' ? '#F57C00' : '#2D7DD2'
              }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium"
                  style={{
                    color: risk.severity === 'danger' ? '#E53935' :
                      risk.severity === 'warning' ? '#F57C00' : '#2D7DD2'
                  }}>
                  {risk.title}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  risk.severity === 'danger' ? 'bg-red-900/50 text-red-300' :
                    risk.severity === 'warning' ? 'bg-orange-900/50 text-orange-300' : 'bg-blue-900/50 text-blue-300'
                }`}>
                  {risk.severity === 'danger' ? '高风险' : risk.severity === 'warning' ? '中风险' : '关注'}
                </span>
              </div>
              <p className="text-xs mb-3" style={{ color: '#B8C5D3' }}>
                {risk.description}
              </p>
              <div className="p-2 rounded text-xs"
                style={{ background: 'rgba(0,0,0,0.2)' }}>
                <div className="font-medium mb-1" style={{ color: '#7A8BA8' }}>建议措施</div>
                <div style={{ color: '#E8EDF4' }}>{risk.suggestion}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PageLayout>
  );
};

export default FinancialConstraintsPage;
