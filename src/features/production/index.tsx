import React from 'react';
import { Factory, ClipboardList, Package, Clock, AlertTriangle } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * 生产排产页面
 * 
 * 功能：工单列表、优先级管理、生产进度
 */
const ProductionPage = () => {
  const orders = [
    { id: 'WO-20260215001', product: '线性驱动装置 A', qty: 500, progress: 80, status: '生产中', priority: '高', due: '2026-02-18' },
    { id: 'WO-20260215002', product: '电动推杆 B', qty: 200, progress: 45, status: '生产中', priority: '中', due: '2026-02-20' },
    { id: 'WO-20260215003', product: '控制器 C', qty: 1000, progress: 0, status: '待排产', priority: '低', due: '2026-02-25' },
    { id: 'WO-20260215004', product: '升降柱 D', qty: 100, progress: 100, status: '待入库', priority: '紧急', due: '2026-02-16' },
  ];

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          🏭 生产排产
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <ClipboardList className="w-4 h-4 mr-1" />
            导出计划
          </Button>
          <Button size="sm">
            新建工单
          </Button>
        </div>
      </div>

      {/* 生产概览 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>今日工单</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>12</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>进行中</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" style={{ color: '#F57C00' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>待排产</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>8</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>待处理</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" style={{ color: '#E53935' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>延期风险</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E53935' }}>2</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>需关注</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4" style={{ color: '#00897B' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>完工率</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>76%</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>本周目标</div>
        </Card>
      </div>

      {/* 工单列表 */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>工单列表</h3>
        <div className="space-y-3">
          {orders.map((order, i) => (
            <div key={i} className="p-4 rounded border"
              style={{ background: '#131926', borderColor: '#1E2D45' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm" style={{ color: '#2D7DD2' }}>{order.id}</span>
                  <span className="text-sm" style={{ color: '#E8EDF4' }}>{order.product}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded"
                    style={{ 
                      background: order.priority === '紧急' ? 'rgba(229,57,53,0.1)' : 
                                 order.priority === '高' ? 'rgba(245,124,0,0.1)' : 'rgba(45,125,210,0.1)',
                      color: order.priority === '紧急' ? '#E53935' : 
                             order.priority === '高' ? '#F57C00' : '#2D7DD2'
                    }}>
                    {order.priority}
                  </span>
                  <span className="text-xs" style={{ color: '#7A8BA8' }}>交期: {order.due}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#7A8BA8' }}>生产进度</span>
                    <span className="text-xs font-medium" style={{ color: '#E8EDF4' }}>
                      {order.progress}% ({order.qty} 件)
                    </span>
                  </div>
                  <div className="h-2 rounded bg-slate-800">
                    <div 
                      className="h-full rounded"
                      style={{ 
                        width: `${order.progress}%`,
                        background: order.progress === 100 ? '#00897B' : 
                                   order.progress === 0 ? '#445568' : '#2D7DD2'
                      }}
                    />
                  </div>
                </div>
                <Button 
                  variant={order.status === '待排产' ? 'primary' : 'secondary'} 
                  size="sm"
                >
                  {order.status === '待排产' ? '开始排产' : 
                   order.status === '生产中' ? '查看进度' : '确认入库'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProductionPage;
