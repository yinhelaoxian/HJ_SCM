import React from 'react';
import { Settings, Factory, TrendingUp, DollarSign } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { CapacityTypes } from './types';

/**
 * 产能投资规划页面
 *
 * 功能：产能分析、投资规划、设备管理、产能优化
 */
const CapacityPlanningPage: React.FC = () => {
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

  // 产能不均风险提示组件
  const CapacityRiskAlert = () => {
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

  // 真实工厂数据
  const stats = {
    totalCapacity: '15.8万件',
    utilization: '78%',
    investmentNeeded: '¥4.5亿',
    roi: '16.8%'
  };

  const capacityItems = [
    {
      id: 1,
      name: '青岛总部工厂',
      location: '山东青岛',
      type: 'factory',
      capacity: '6.5万件',
      utilization: 112,
      cost: '¥2.8亿',
      status: 'overloaded'
    },
    {
      id: 2,
      name: '苏州华东工厂',
      location: '江苏苏州',
      type: 'factory',
      capacity: '5.8万件',
      utilization: 78,
      cost: '¥2.1亿',
      status: 'normal'
    },
    {
      id: 3,
      name: '泰国曼谷工厂',
      location: '泰国曼谷',
      type: 'factory',
      capacity: '3.5万件',
      utilization: 43,
      cost: '¥1.2亿',
      status: 'underloaded'
    }
  ];

  // 产能不均风险分析
  const riskAnalysis = {
    gap: 69, // 青岛 112% vs 泰国 43%
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
      priority: 'high'
    },
    {
      id: 2,
      title: '提升泰国曼谷工厂产能利用率',
      description: '优化生产排程，转移华东订单至泰国工厂',
      cost: '¥5000万',
      roi: '18.0%',
      priority: 'high'
    },
    {
      id: 3,
      title: '苏州工厂设备升级',
      description: '升级现有设备，提高生产效率12%',
      cost: '¥3500万',
      roi: '16.5%',
      priority: 'medium'
    }
  ];

  return (
    <PageLayout>
      {/* 产能统计 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Factory className="w-4 h-4" style={{ color: '#2D7DD2' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>总产能</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>
            {stats.totalCapacity}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>
            年生产能力
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#00897B' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>平均利用率</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>
            {stats.utilization}
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
            {stats.investmentNeeded}
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
            {stats.roi}
          </div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>
            平均投资回报率
          </div>
        </Card>
      </div>

      {/* 产能项目列表 */}
      <Card className="p-4 mb-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>产能项目管理</h3>
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
      <CapacityRiskAlert />

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
