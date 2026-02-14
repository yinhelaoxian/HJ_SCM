import React, { useState, useCallback } from 'react';
import {
  GanttChart, Calendar, Download, RefreshCw,
  AlertTriangle, CheckCircle, Clock
} from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';

/**
 * MPS 主生产计划甘特图
 */
export default function MPSPlan() {
  const [loading, setLoading] = useState(false);
  
  // 模拟MPS数据
  const mockMPSData = {
    productId: 'PRODUCT-001',
    productName: '医养电机',
    utilization: 0.85,
    conflicts: [
      { week: 4, type: 'CAPACITY', severity: 'HIGH', message: '产能不足，预测>计划' }
    ],
    weeklyPlans: [
      { week: 1, date: '2026-02-17', forecast: 520, plan: 600, capacity: 800, utilization: 0.75 },
      { week: 2, date: '2026-02-24', forecast: 580, plan: 600, capacity: 800, utilization: 0.75 },
      { week: 3, date: '2026-03-03', forecast: 650, plan: 700, capacity: 800, utilization: 0.88 },
      { week: 4, date: '2026-03-10', forecast: 720, plan: 700, capacity: 800, utilization: 0.88 },
      { week: 5, date: '2026-03-17', forecast: 680, plan: 700, capacity: 800, utilization: 0.88 },
      { week: 6, date: '2026-03-24', forecast: 620, plan: 600, capacity: 800, utilization: 0.75 },
      { week: 7, date: '2026-03-31', forecast: 580, plan: 600, capacity: 800, utilization: 0.75 },
      { week: 8, date: '2026-04-07', forecast: 520, plan: 500, capacity: 800, utilization: 0.63 },
      { week: 9, date: '2026-04-14', forecast: 480, plan: 500, capacity: 800, utilization: 0.63 },
      { week: 10, date: '2026-04-21', forecast: 420, plan: 500, capacity: 800, utilization: 0.63 },
      { week: 11, date: '2026-04-28', forecast: 450, plan: 500, capacity: 800, utilization: 0.63 },
      { week: 12, date: '2026-05-05', forecast: 490, plan: 500, capacity: 800, utilization: 0.63 },
      { week: 13, date: '2026-05-12', forecast: 550, plan: 600, capacity: 800, utilization: 0.75 }
    ],
    ganttData: {
      workCenter: '装配线A',
      items: [
        { name: 'W1', start: '2026-02-17', end: '2026-02-21', quantity: 600, status: 'COMPLETED' },
        { name: 'W2', start: '2026-02-24', end: '2026-02-28', quantity: 600, status: 'IN_PROGRESS' },
        { name: 'W3', start: '2026-03-03', end: '2026-03-07', quantity: 700, status: 'PLANNED' }
      ]
    }
  };

  const handleGenerate = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // 产能利用图表数据
  const utilizationData = mockMPSData.weeklyPlans.map(p => ({
    week: `W${p.week}`,
    forecast: p.forecast,
    plan: p.plan,
    capacity: p.capacity,
    utilization: Math.round(p.utilization * 100)
  }));

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">MPS 主生产计划</h1>
          <p className="text-gray-400 mt-1">13周滚动计划 · 产能约束 · 甘特图</p>
        </div>
        <Button onClick={handleGenerate} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          重新生成计划
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">平均利用率</p>
              <p className="text-3xl font-bold text-white">85%</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">计划完成率</p>
              <p className="text-3xl font-bold text-white">92%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">产能冲突</p>
              <p className="text-3xl font-bold text-amber-400">1</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-amber-400" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">春节影响</p>
              <p className="text-3xl font-bold text-purple-400">W4</p>
            </div>
            <Clock className="w-8 h-8 text-purple-400" />
          </div>
        </Card>
      </div>

      {/* 产能利用图表 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">产能利用趋势</h3>
        <div className="h-64">
          <div className="flex h-full items-end gap-1">
            {utilizationData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all"
                  style={{ height: `${d.utilization}%` }}
                />
                <span className="text-xs text-gray-500">{d.week}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 甘特图 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">排程甘特图</h3>
        <div className="space-y-3">
          {mockMPSData.ganttData.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-12 text-gray-400 text-sm">{item.name}</span>
              <div className="flex-1 bg-gray-800 rounded h-8 relative overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full rounded flex items-center px-3 text-sm ${
                    item.status === 'COMPLETED'
                      ? 'bg-green-500/80 text-white'
                      : item.status === 'IN_PROGRESS'
                        ? 'bg-blue-500/80 text-white'
                        : 'bg-gray-600 text-gray-300'
                  }`}
                  style={{ width: `${(i + 1) * 8}%` }}
                >
                  {item.quantity}件
                </div>
              </div>
              <span className="text-gray-500 text-sm">
                {item.start} ~ {item.end}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* 周计划明细 */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">周计划明细</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">周次</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">日期</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">预测</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">计划</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">产能</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">利用率</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {mockMPSData.weeklyPlans.map((row, i) => (
              <tr key={i} className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-white font-medium">W{row.week}</td>
                <td className="px-4 py-3 text-gray-400">{row.date}</td>
                <td className="px-4 py-3 text-right text-gray-300">{row.forecast}</td>
                <td className="px-4 py-3 text-right font-semibold text-white">{row.plan}</td>
                <td className="px-4 py-3 text-right text-gray-400">{row.capacity}</td>
                <td className="px-4 py-3 text-right">
                  <span className={
                    row.utilization > 0.9 ? 'text-amber-400' :
                    row.utilization > 0.8 ? 'text-blue-400' : 'text-green-400'
                  }>
                    {Math.round(row.utilization * 100)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={row.utilization > 0.9 ? 'warning' : 'success'}>
                    {row.utilization > 0.9 ? '高负荷' : '正常'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
