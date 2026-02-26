import React from 'react';
import { CheckCircle, AlertTriangle, Package, Truck } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * 齐套分析页面
 * 
 * 功能：物料齐套检查、缺口分析、预计到货
 */
const KittingPage = () => {
  const orders = [
    { id: 'PO-20260215001', priority: '高', items: 12, kitted: 10, status: 'partial', eta: '2026-02-16' },
    { id: 'PO-20260215002', priority: '中', items: 8, kitted: 8, status: 'ready', eta: '-' },
    { id: 'PO-20260215003', priority: '紧急', items: 15, kitted: 5, status: 'critical', eta: '2026-02-15' },
  ];

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          📦 齐套分析
        </h1>
        <Button variant="ghost" size="sm">
          刷新齐套状态
        </Button>
      </div>

      {/* 齐套概览 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4" style={{ color: '#00897B' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>已齐套</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>15</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>订单数</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4" style={{ color: '#F57C00' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>部分齐套</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>8</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>订单数</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" style={{ color: '#E53935' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>缺口严重</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E53935' }}>3</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>订单数</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4" style={{ color: '#2D7DD2' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>今日到货</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#2D7DD2' }}>5</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>预计改善</div>
        </Card>
      </div>

      {/* 齐套订单列表 */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>齐套状态列表</h3>
        <div className="space-y-3">
          {orders.map((order, i) => (
            <div key={i} className="p-4 rounded border"
              style={{ background: '#131926', borderColor: '#1E2D45' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm" style={{ color: '#2D7DD2' }}>{order.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded"
                    style={{ 
                      background: order.priority === '紧急' ? 'rgba(229,57,53,0.1)' : 
                                 order.priority === '高' ? 'rgba(245,124,0,0.1)' : 'rgba(45,125,210,0.1)',
                      color: order.priority === '紧急' ? '#E53935' : 
                             order.priority === '高' ? '#F57C00' : '#2D7DD2'
                    }}>
                    {order.priority}
                  </span>
                </div>
                <span className="text-xs" style={{ color: '#445568' }}>预计到货: {order.eta}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#7A8BA8' }}>齐套进度</span>
                    <span className="text-xs font-medium" style={{ color: '#E8EDF4' }}>
                      {order.kitted}/{order.items} 项
                    </span>
                  </div>
                  <div className="h-2 rounded bg-slate-800">
                    <div 
                      className="h-full rounded"
                      style={{ 
                        width: `${(order.kitted / order.items) * 100}%`,
                        background: order.status === 'ready' ? '#00897B' : 
                                   order.status === 'critical' ? '#E53935' : '#F57C00'
                      }}
                    />
                  </div>
                </div>
                <Button variant={order.status === 'critical' ? 'danger' : 'ghost'} size="sm">
                  {order.status === 'ready' ? '下达生产' : '查看缺口'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default KittingPage;
