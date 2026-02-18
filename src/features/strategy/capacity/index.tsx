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

  // 模拟数据
  const stats = {
    totalCapacity: '12.5万件',
    utilization: '78%',
    investmentNeeded: '¥2.3亿',
    roi: '18.5%'
  };

  const capacityItems = [
    {
      id: 1,
      name: '华东生产基地',
      location: '上海',
      type: 'factory',
      capacity: '5.2万件',
      utilization: 85,
      cost: '¥1.2亿'
    },
    {
      id: 2,
      name: '华南制造中心',
      location: '深圳',
      type: 'factory',
      capacity: '4.8万件',
      utilization: 92,
      cost: '¥9500万'
    },
    {
      id: 3,
      name: '华北装配厂',
      location: '天津',
      type: 'assembly',
      capacity: '2.5万件',
      utilization: 65,
      cost: '¥4200万'
    }
  ];

  const investments = [
    {
      id: 1,
      title: '新增自动化生产线',
      description: '引入机器人自动化生产线，提升产能30%',
      cost: '¥8500万',
      roi: '22.3%',
      priority: 'high'
    },
    {
      id: 2,
      title: '扩建华南制造中心',
      description: '新增厂房面积20000平方米，增加两条生产线',
      cost: '¥1.2亿',
      roi: '15.8%',
      priority: 'medium'
    },
    {
      id: 3,
      title: '设备升级改造',
      description: '升级现有设备，提高生产效率15%',
      cost: '¥3200万',
      roi: '19.2%',
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
              style={{ background: '#131926', borderColor: '#1E2D45' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded flex items-center justify-center text-lg"
                  style={{ background: 'rgba(45,125,210,0.1)' }}>
                  🏭
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
