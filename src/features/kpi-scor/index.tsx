import React from 'react';
import { Activity, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * SCOR 绩效看板
 * 
 * ISC 框架：SCOR 模型对齐
 * 功能：SCOR 指标展示、趋势分析、对标对比
 */
const SCORDashboardPage = () => {
  const metrics = [
    { 
      category: 'Plan', 
      name: '计划准确率', 
      value: 87, 
      target: 90, 
      trend: '+3%',
      color: '#2D7DD2',
      items: [
        { name: '预测准确率', value: 87 },
        { name: 'MPS 达成率', value: 92 },
        { name: 'MRP 准时率', value: 88 },
      ]
    },
    { 
      category: 'Source', 
      name: '采购及时率', 
      value: 94, 
      target: 95, 
      trend: '+2%',
      color: '#00897B',
      items: [
        { name: '供应商准时交货', value: 94 },
        { name: '来料合格率', value: 98 },
        { name: '采购成本达成', value: 91 },
      ]
    },
    { 
      category: 'Make', 
      name: '生产周期', 
      value: 5.2, 
      target: 5.0, 
      trend: '-0.3d',
      unit: '天',
      color: '#F57C00',
      items: [
        { name: '工单准时完成', value: 89 },
        { name: '生产周期', value: 5.2 },
        { name: '产能利用率', value: 82 },
      ]
    },
    { 
      category: 'Deliver', 
      name: 'OTIF 率', 
      value: 95, 
      target: 95, 
      trend: '+1%',
      color: '#00897B',
      items: [
        { name: '准时交付率', value: 95 },
        { name: '订单完整率', value: 99 },
        { name: '完美订单率', value: 94 },
      ]
    },
    { 
      category: 'Return', 
      name: '退货率', 
      value: 2.1, 
      target: 2.0, 
      trend: '-0.3%',
      unit: '%',
      color: '#F57C00',
      items: [
        { name: '客户退货率', value: 2.1 },
        { name: '退货处理周期', value: 3.5 },
        { name: '退货原因分析', value: '质量 45%' },
      ]
    },
    { 
      category: 'Enable', 
      name: '供应链总成本', 
      value: 8.5, 
      target: 8.0, 
      trend: '-0.2',
      unit: '%',
      color: '#445568',
      items: [
        { name: '库存持有成本', value: 3.2 },
        { name: '物流成本', value: 3.1 },
        { name: '缺货成本', value: 2.2 },
      ]
    },
  ];

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          📊 SCOR 绩效看板
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            对标分析
          </Button>
          <Button size="sm">
            生成报告
          </Button>
        </div>
      </div>

      {/* SCOR 六大流程概览 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        {metrics.map((metric, i) => (
          <Card key={i} className="p-3">
            <div className="text-xs mb-1" style={{ color: metric.color }}>{metric.category}</div>
            <div className="text-lg font-display font-bold" style={{ color: '#E8EDF4' }}>
              {metric.value}{metric.unit || '%'}
            </div>
            <div className="text-xs mt-1 flex items-center gap-1"
              style={{ color: metric.trend.startsWith('+') || metric.trend.startsWith('-') && metric.name === '生产周期' ? '#00897B' : '#445568' }}>
              <TrendingUp className="w-3 h-3" />
              {metric.trend}
            </div>
          </Card>
        ))}
      </div>

      {/* 详细指标 */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {metrics.map((metric, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
                  style={{ background: `${metric.color}20`, color: metric.color }}>
                  {metric.category[0]}
                </div>
                <div>
                  <h3 className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{metric.name}</h3>
                  <div className="text-xs" style={{ color: '#7A8BA8' }}>
                    目标: {metric.target}{metric.unit || '%'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-display font-bold" style={{ color: metric.value >= metric.target ? '#00897B' : '#F57C00' }}>
                  {metric.value}{metric.unit || '%'}
                </div>
                <div className="text-xs" style={{ color: '#7A8BA8' }}>
                  vs 目标 {metric.value >= metric.target ? '达成' : '差距 ' + (metric.target - metric.value)}
                </div>
              </div>
            </div>
            
            {/* 进度条 */}
            <div className="h-2 rounded bg-slate-800 mb-4">
              <div 
                className="h-full rounded"
                style={{ 
                  width: `${Math.min(100, (metric.value / (metric.target * 1.2)) * 100)}%`,
                  background: metric.color 
                }}
              />
            </div>

            {/* 子指标 */}
            <div className="space-y-2">
              {metric.items.map((item, j) => (
                <div key={j} className="flex items-center justify-between text-xs">
                  <span style={{ color: '#7A8BA8' }}>{item.name}</span>
                  <span style={{ color: '#E8EDF4' }}>{item.value}{typeof item.value === 'number' && item.name !== '退货原因分析' ? '%' : ''}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* SCOR 模型说明 */}
      <Card className="p-4 mt-4">
        <h3 className="text-sm font-medium mb-3" style={{ color: '#E8EDF4' }}>SCOR 模型说明</h3>
        <div className="grid gap-4 text-xs" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
          <div>
            <div className="font-medium mb-1" style={{ color: '#2D7DD2' }}>Plan</div>
            <div style={{ color: '#7A8BA8' }}>供应链计划、资源配置</div>
          </div>
          <div>
            <div className="font-medium mb-1" style={{ color: '#00897B' }}>Source</div>
            <div style={{ color: '#7A8BA8' }}>采购、收货、供应商管理</div>
          </div>
          <div>
            <div className="font-medium mb-1" style={{ color: '#F57C00' }}>Make</div>
            <div style={{ color: '#7A8BA8' }}>生产制造、测试、包装</div>
          </div>
          <div>
            <div className="font-medium mb-1" style={{ color: '#00897B' }}>Deliver</div>
            <div style={{ color: '#7A8BA8' }}>订单管理、运输、发票</div>
          </div>
          <div>
            <div className="font-medium mb-1" style={{ color: '#445568' }}>Return</div>
            <div style={{ color: '#7A8BA8' }}>退货、逆向物流</div>
          </div>
          <div>
            <div className="font-medium mb-1" style={{ color: '#445568' }}>Enable</div>
            <div style={{ color: '#7A8BA8' }}>使能流程、绩效管理</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SCORDashboardPage;
