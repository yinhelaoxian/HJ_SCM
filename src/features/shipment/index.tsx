import React from 'react';
import { Package, FileText, Truck, CheckCircle } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * 发货管理页面
 * 
 * 功能：ASN 管理、装箱单、发货确认
 */
const ShipmentPage = () => {
  const shipments = [
    { id: 'ASN-20260215001', order: 'SO-2026020145', items: 12, status: '待发货', warehouse: '华东仓', time: '14:30' },
    { id: 'ASN-20260215002', order: 'SO-2026020146', items: 8, status: '已打印', warehouse: '华东仓', time: '12:00' },
    { id: 'ASN-20260215003', order: 'SO-2026020147', items: 25, status: '已发货', warehouse: '华南仓', time: '10:00' },
  ];

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          📤 发货管理
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <FileText className="w-4 h-4 mr-1" />
            批量打印
          </Button>
          <Button size="sm">
            <Package className="w-4 h-4 mr-1" />
            新建发货
          </Button>
        </div>
      </div>

      {/* 发货概览 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>今日发货</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>18</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>单数</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4" style={{ color: '#F57C00' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>待发货</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>5</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>待处理</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4" style={{ color: '#00897B' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>已发货</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>13</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>今日完成</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>发货准确率</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>99.2%</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>本月累计</div>
        </Card>
      </div>

      {/* 发货列表 */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>发货单列表</h3>
        <div className="space-y-3">
          {shipments.map((ship, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded border"
              style={{ background: '#131926', borderColor: '#1E2D45' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded flex items-center justify-center text-lg"
                  style={{ background: 'rgba(45,125,210,0.1)' }}>
                  📦
                </div>
                <div>
                  <div className="font-medium" style={{ color: '#E8EDF4' }}>{ship.id}</div>
                  <div className="text-xs mt-1" style={{ color: '#445568' }}>
                    订单: <span className="font-mono" style={{ color: '#2D7DD2' }}>{ship.order}</span>
                    <span className="mx-2">|</span>
                    {ship.warehouse}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm" style={{ color: '#E8EDF4' }}>{ship.items} 项</div>
                  <div className="text-xs" style={{ color: '#445568' }}>{ship.time}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded"
                  style={{ 
                    background: ship.status === '待发货' ? 'rgba(245,124,0,0.1)' : 
                               ship.status === '已打印' ? 'rgba(45,125,210,0.1)' : 'rgba(0,137,123,0.1)',
                    color: ship.status === '待发货' ? '#F57C00' : 
                           ship.status === '已打印' ? '#2D7DD2' : '#00897B'
                  }}>
                  {ship.status}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <FileText className="w-3 h-3 mr-1" />
                    打印
                  </Button>
                  <Button variant={ship.status === '待发货' ? 'primary' : 'ghost'} size="sm">
                    {ship.status === '待发货' ? '确认发货' : '详情'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ShipmentPage;
