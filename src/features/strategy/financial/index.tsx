import React, { useState, useEffect, useMemo } from 'react';
import { Settings, DollarSign, TrendingUp, AlertCircle, Target, Search, Filter, RefreshCw } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Select } from '@/ui/Select';
import { getFinancialData } from '@/services/api/strategy';
import { FinancialTypes } from './types';

// 筛选选项类型定义
interface FilterOptions {
  budgetStatus: 'all' | 'used' | 'remaining';
  expenseType: 'all' | 'equipment' | 'labor' | 'logistics' | 'rd';
  quarter: 'all' | 'q1' | 'q2' | 'q3' | 'q4';
  search: string;
}

// 预算状态映射
const budgetStatusMap: Record<string, string> = {
  used: '已用',
  remaining: '剩余',
};

// 支出类型映射
const expenseTypeMap: Record<string, string> = {
  equipment: '设备',
  labor: '人力',
  logistics: '物流',
  rd: '研发',
};

// 季度映射
const quarterMap: Record<string, string> = {
  q1: 'Q1',
  q2: 'Q2',
  q3: 'Q3',
  q4: 'Q4',
};

// 财务数据类型定义
interface FinancialStats {
  totalBudget: string;
  usedBudget: string;
  pendingInvestment: string;
  budgetUtilization: number;
  costSavings: string;
  investmentConstraints: number;
  riskLevel: string;
}

interface BudgetItem {
  id: number;
  name: string;
  budget: string;
  used: string;
  utilization: number;
  trend: number;
  type: 'equipment' | 'labor' | 'logistics' | 'rd';
  quarter: string;
  status: 'used' | 'remaining';
}

interface InvestmentConstraint {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
}

interface FinancialRisk {
  id: number;
  type: string;
  title: string;
  description: string;
  severity: 'danger' | 'warning' | 'info';
  suggestion: string;
}

// API 响应数据类型
interface FinancialApiResponse {
  metrics: Array<{
    totalBudget: string;
    usedBudget: string;
    budgetUtilization: number;
    costSavings: string;
    riskLevel: string;
  }>;
  constraints: Array<{
    id: number;
    title: string;
    description: string;
    priority: string;
    impact: string;
  }>;
  risks: Array<{
    id: number;
    type: string;
    title: string;
    description: string;
    severity: string;
    suggestion: string;
  }>;
}

/**
 * 财务约束管理页面
 *
 * 功能：预算管理、成本控制、财务指标分析、投资约束设置
 */
const FinancialConstraintsPage: React.FC = () => {
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [financialStats, setFinancialStats] = useState<FinancialStats>({
    totalBudget: '¥0',
    usedBudget: '¥0',
    pendingInvestment: '¥0',
    budgetUtilization: 0,
    costSavings: '¥0',
    investmentConstraints: 0,
    riskLevel: '未知'
  });
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [investmentConstraints, setInvestmentConstraints] = useState<InvestmentConstraint[]>([]);
  const [financialRisks, setFinancialRisks] = useState<FinancialRisk[]>([]);

  // 筛选状态
  const [filters, setFilters] = useState<FilterOptions>({
    budgetStatus: 'all',
    expenseType: 'all',
    quarter: 'all',
    search: '',
  });

  // 使用 useMemo 计算筛选后的预算项目
  const filteredBudgetItems = useMemo(() => {
    let result = [...budgetItems];

    // 预算状态筛选
    if (filters.budgetStatus !== 'all') {
      result = result.filter((item) => item.status === filters.budgetStatus);
    }

    // 支出类型筛选
    if (filters.expenseType !== 'all') {
      result = result.filter((item) => item.type === filters.expenseType);
    }

    // 季度筛选
    if (filters.quarter !== 'all') {
      result = result.filter((item) => item.quarter === filters.quarter);
    }

    // 搜索筛选（项目名称）
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [budgetItems, filters]);

  // 筛选后的统计
  const filteredStats = useMemo(() => {
    const totalBudgetValue = filteredBudgetItems.reduce((sum, item) => {
      const value = parseFloat(item.budget.replace(/[¥,]/g, ''));
      return sum + (isNaN(value) ? 0 : value);
    }, 0);

    const usedBudgetValue = filteredBudgetItems.reduce((sum, item) => {
      const value = parseFloat(item.used.replace(/[¥,]/g, ''));
      return sum + (isNaN(value) ? 0 : value);
    }, 0);

    const avgUtilization = filteredBudgetItems.length > 0
      ? Math.round(filteredBudgetItems.reduce((sum, item) => sum + item.utilization, 0) / filteredBudgetItems.length)
      : 0;

    return {
      totalBudget: `¥${(totalBudgetValue / 100000000).toFixed(1)}亿`,
      usedBudget: `¥${(usedBudgetValue / 100000000).toFixed(1)}亿`,
      budgetUtilization: avgUtilization,
      count: filteredBudgetItems.length,
    };
  }, [filteredBudgetItems]);

  // 获取财务数据
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFinancialData() as unknown as FinancialApiResponse;
        
        // 解析 metrics
        if (data.metrics && data.metrics.length > 0) {
          const metric = data.metrics[0];
          setFinancialStats({
            totalBudget: metric.totalBudget || '¥0',
            usedBudget: metric.usedBudget || '¥0',
            pendingInvestment: '¥320,000,000', // 默认值
            budgetUtilization: metric.budgetUtilization || 0,
            costSavings: metric.costSavings || '¥0',
            investmentConstraints: data.constraints?.length || 0,
            riskLevel: metric.riskLevel || '未知'
          });
        }

        // 解析 budgetItems（从 projections 中提取）
        if (data.projections && data.projections.length > 0) {
          const projections = data.projections as unknown as Array<{
            period: string;
            budget: string;
            used: string;
            utilization: number;
            trend: number;
          }>;
          setBudgetItems(projections.map((p, index) => ({
            id: index + 1,
            name: p.period,
            budget: p.budget,
            used: p.used,
            utilization: p.utilization,
            trend: p.trend
          })));
        } else {
          // 默认 budgetItems
          setBudgetItems([
            { id: 1, name: '研发投入', budget: '¥500,000,000', used: '¥320,000,000', utilization: 64, trend: 2.3, type: 'rd', quarter: 'q1', status: 'used' },
            { id: 2, name: '生产基地建设', budget: '¥450,000,000', used: '¥280,000,000', utilization: 62.2, trend: 1.5, type: 'equipment', quarter: 'q2', status: 'used' },
            { id: 3, name: '智能制造升级', budget: '¥300,000,000', used: '¥180,000,000', utilization: 60, trend: -1.2, type: 'equipment', quarter: 'q1', status: 'used' },
            { id: 4, name: '市场拓展', budget: '¥250,000,000', used: '¥70,000,000', utilization: 28, trend: 5.8, type: 'labor', quarter: 'q3', status: 'used' },
            { id: 5, name: '物流系统优化', budget: '¥150,000,000', used: '¥20,000,000', utilization: 13.3, trend: 1.2, type: 'logistics', quarter: 'q4', status: 'remaining' },
            { id: 6, name: '人力资源培训', budget: '¥80,000,000', used: '¥75,000,000', utilization: 93.8, trend: 0.5, type: 'labor', quarter: 'q2', status: 'used' },
          ]);
        }

        // 解析 constraints
        if (data.constraints && data.constraints.length > 0) {
          setInvestmentConstraints(data.constraints.map(c => ({
            id: c.id,
            title: c.title,
            description: c.description,
            priority: (c.priority as 'high' | 'medium' | 'low') || 'medium',
            impact: c.impact
          })));
        } else {
          // 默认 constraints
          setInvestmentConstraints([
            { id: 1, title: '年度预算上限', description: '年度总预算不得超过¥15亿元', priority: 'high', impact: '硬性约束' },
            { id: 2, title: '资本支出限制', description: '已分配资本支出¥8.5亿元', priority: 'high', impact: '已占用' },
            { id: 3, title: '待审批投资', description: '待审批投资¥3.2亿元', priority: 'medium', impact: '审批中' },
            { id: 4, title: 'ROI要求', description: '新投资项目ROI需≥15%', priority: 'high', impact: '严格' },
            { id: 5, title: '现金流约束', description: '季度净现金流需保持正数', priority: 'high', impact: '关键' },
            { id: 6, title: '成本控制目标', description: '研发成本占营收比例需≤12%', priority: 'medium', impact: '重要' },
            { id: 7, title: '预算偏差控制', description: '季度预算偏差需控制在±3%以内', priority: 'low', impact: '监控' },
            { id: 8, title: '投资回报周期', description: '项目投资回收期需≤3年', priority: 'medium', impact: '评估' }
          ]);
        }

        // 解析 risks
        if (data.risks && data.risks.length > 0) {
          setFinancialRisks(data.risks.map(r => ({
            id: r.id,
            type: r.type,
            title: r.title,
            description: r.description,
            severity: (r.severity as 'danger' | 'warning' | 'info') || 'info',
            suggestion: r.suggestion
          })));
        } else {
          // 默认 risks
          setFinancialRisks([
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
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch financial data:', err);
        setError('加载财务数据失败，请稍后重试');
        // 设置默认数据以保持 UI 显示
        setBudgetItems([
          { id: 1, name: '研发投入', budget: '¥500,000,000', used: '¥320,000,000', utilization: 64, trend: 2.3, type: 'rd', quarter: 'q1', status: 'used' },
          { id: 2, name: '生产基地建设', budget: '¥450,000,000', used: '¥280,000,000', utilization: 62.2, trend: 1.5, type: 'equipment', quarter: 'q2', status: 'used' },
          { id: 3, name: '智能制造升级', budget: '¥300,000,000', used: '¥180,000,000', utilization: 60, trend: -1.2, type: 'equipment', quarter: 'q1', status: 'used' },
          { id: 4, name: '市场拓展', budget: '¥250,000,000', used: '¥70,000,000', utilization: 28, trend: 5.8, type: 'labor', quarter: 'q3', status: 'used' },
          { id: 5, name: '物流系统优化', budget: '¥150,000,000', used: '¥20,000,000', utilization: 13.3, trend: 1.2, type: 'logistics', quarter: 'q4', status: 'remaining' },
          { id: 6, name: '人力资源培训', budget: '¥80,000,000', used: '¥75,000,000', utilization: 93.8, trend: 0.5, type: 'labor', quarter: 'q2', status: 'used' },
        ]);
        setInvestmentConstraints([
          { id: 1, title: '年度预算上限', description: '年度总预算不得超过¥15亿元', priority: 'high', impact: '硬性约束' },
          { id: 2, title: '资本支出限制', description: '已分配资本支出¥8.5亿元', priority: 'high', impact: '已占用' },
          { id: 3, title: '待审批投资', description: '待审批投资¥3.2亿元', priority: 'medium', impact: '审批中' },
          { id: 4, title: 'ROI要求', description: '新投资项目ROI需≥15%', priority: 'high', impact: '严格' },
          { id: 5, title: '现金流约束', description: '季度净现金流需保持正数', priority: 'high', impact: '关键' },
          { id: 6, title: '成本控制目标', description: '研发成本占营收比例需≤12%', priority: 'medium', impact: '重要' },
          { id: 7, title: '预算偏差控制', description: '季度预算偏差需控制在±3%以内', priority: 'low', impact: '监控' },
          { id: 8, title: '投资回报周期', description: '项目投资回收期需≤3年', priority: 'medium', impact: '评估' }
        ]);
        setFinancialRisks([
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
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

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

  // Loading 状态
  const LoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: '#2D7DD2' }}></div>
        <p style={{ color: '#7A8BA8' }}>加载财务数据中...</p>
      </div>
    </div>
  );

  // Error 状态
  const ErrorState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <AlertCircle className="w-8 h-8 mx-auto mb-4" style={{ color: '#E53935' }} />
        <p style={{ color: '#E53935' }}>{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          重新加载
        </Button>
      </div>
    </div>
  );

  return (
    <PageLayout>
      {/* 错误状态显示 */}
      {error && (
        <div className="mb-4 p-4 rounded" style={{ background: 'rgba(229,57,53,0.1)', border: '1px solid rgba(229,57,53,0.3)' }}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" style={{ color: '#E53935' }} />
            <span style={{ color: '#E53935' }}>{error}</span>
          </div>
        </div>
      )}

      {/* Loading 状态 */}
      {loading ? (
        <LoadingState />
      ) : (
        <>
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
                已使用 {financialStats.usedBudget}
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
                      constraint.priority === 'medium' ? 'rgba(245,124,0,0.08)' : 'rgba(0,137,123,0.08)'
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
        </>
      )}
    </PageLayout>
  );
};

export default FinancialConstraintsPage;
