import React, { useState } from 'react';
import { Plus, Play, Check, Clock, Factory, Package, RefreshCw } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * 生产订单管理页面
 */
const ProductionOrdersPage = () => {
  const [orders, setOrders] = useState([
    { 
      poId: 'WO-20260215001', 
      product: '线性驱动装置 LA23',
      quantity: 500, 
      plannedStart: '2026-02-15', 
      plannedEnd: '2026-02-20',
      actualStart: '2026-02-15',
      status: 'IN_PROGRESS',
      progress: 35,
      operations: [
        { name: 'OP10-组装', status: 'COMPLETED', progress: 100 },
        { name: 'OP20-测试', status: 'IN_PROGRESS', progress: 60 },
        { name: 'OP30-包装', status: 'PENDING', progress: 0 },
      ]
    },
    { 
      poId: 'WO-20260215002', 
      product: '电动推杆 B',
      quantity: 200, 
      plannedStart: '2026-02-16', 
      plannedEnd: '2026-02-22',
      actualStart: '',
      status: 'CREATED',
      progress: 0,
      operations: [
        { name: 'OP10-组装', status: 'PENDING', progress: 0 },
        { name: 'OP20-测试', status: 'PENDING', progress: 0 },
      ]
    },
    { 
      poId: 'WO-20260215003', 
      product: '升降柱 D',
      quantity: 100, 
      plannedStart: '2026-02-14', 
      plannedEnd: '2026-02-18',
      actualStart: '2026-02-14',
      actualEnd: '2026-02-17',
      status: 'COMPLETED',
      progress: 100,
      operations: [
        { name: 'OP10-组装', status: 'COMPLETED', progress: 100 },
        { name: 'OP20-测试', status: 'COMPLETED', progress: 100 },
        { name: 'OP30-包装', status: 'COMPLETED', progress: 100 },
      ]
    },
  ]);

  const getStatusBadge = (status) => {
    const config = {
      'CREATED': { bg: 'rgba(68,85,104,0.2)', color: '#7A8BA8', text: '新建' },
      'RELEASED': { bg: 'rgba(45,125,210,0.1)', color: '#2D7DD2', text: '已下达' },
      'IN_PROGRESS': { bg: 'rgba(245,124,0,0.1)', color: '#F57C00', text: '生产中' },
      'COMPLETED': { bg: 'rgba(0,137,123,0.1)', color: '#00897B', text: '已完成' },
      'CLOSED': { bg: 'rgba(0,137,123,0.1)', color: '#00897B', text: '已关闭' },
    };
    return config[status] || config['CREATED'];
  };

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          🏭 生产订单
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            刷新
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            新建工单
          </Button>
        </div>
      </div>

      {/* 统计 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Factory className="w-4 h-4" style={{ color: '#2D7DD2' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>今日工单</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>{orders.length}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" style={{ color: '#F57C00' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>生产中</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>
            {orders.filter(o => o.status === 'IN_PROGRESS').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-4 h-4" style={{ color: '#00897B' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>已完成</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>
            {orders.filter(o => o.status === 'COMPLETED').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4" style={{ color: '#445568' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>完工率</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>
            {Math.round(orders.filter(o => o.status === 'COMPLETED').length / orders.length * 100)}%
          </div>
        </Card>
      </div>

      {/* 工单列表 */}
      <Card className="p-4">
        <div className="space-y-4">
          {orders.map((order, i) => {
            const badge = getStatusBadge(order.status);
            return (
              <div key={i} className="p-4 rounded border" style={{ background: '#131926', borderColor: '#1E2D45' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm" style={{ color: '#2D7DD2' }}>{order.poId}</span>
                    <span className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{order.product}</span>
                    <span className="text-xs px-2 py-0.5 rounded"
                      style={{ background: 'rgba(45,125,210,0.1)', color: '#2D7DD2' }}>
                      {order.quantity} 件
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs" style={{ color: '#7A8BA8' }}>进度</span>
                        <span className="text-xs" style={{ color: '#E8EDF4' }}>{order.progress}%</span>
                      </div>
                      <div className="h-2 rounded bg-slate-800">
                        <div 
                          className="h-full rounded"
                          style={{ 
                            width: `${order.progress}%`,
                            background: order.progress === 100 ? '#00897B' : '#2D7DD2'
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded" style={{ background: badge.bg, color: badge.color }}>
                      {badge.text}
                    </span>
                    {order.status === 'CREATED' && (
                      <Button variant="primary" size="xs">
                        <Play className="w-3 h-3 mr-1" />
                        下达生产
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* 工序进度 */}
                <div className="mt-3 pt-3 border-t flex items-center gap-4" style={{ borderColor: '#1E2D45' }}>
                  {order.operations.map((op, j) => (
                    <React.Fragment key={j}>
                      <div className="flex items-center gap-2">
                        {op.status === 'COMPLETED' ? (
                          <Check className="w-4 h-4" style={{ color: '#00897B' }} />
                        ) : op.status === 'IN_PROGRESS' ? (
                          <Clock className="w-4 h-4" style={{ color: '#F57C00' }} />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: '#445568' }} />
                        )}
                        <span className="text-xs" style={{ color: op.status === 'PENDING' ? '#445568' : '#E8EDF4' }}>
                          {op.name}
                        </span>
                      </div>
                      {j < order.operations.length - 1 && (
                        <div className="w-8 h-0.5" style={{ background: '#1E2D45' }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                
                {/* 计划日期 */}
                <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: '#7A8BA8' }}>
                  <span>计划: {order.plannedStart} ~ {order.plannedEnd}</span>
                  {order.actualStart && <span>实际: {order.actualStart} ~ {order.actualEnd || '-'}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default ProductionOrdersPage;
