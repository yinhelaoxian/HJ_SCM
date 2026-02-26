import React, { useState } from 'react';
import { Package, RotateCcw, AlertTriangle, RefreshCw, PackageReturn, Check } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * RMA退货管理页面
 */
const RMAPage = () => {
  const [rmas, setRmas] = useState([
    { 
      rmaId: 'RMA-20260215001',
      orderNo: 'SO-20260201001',
      customer: '瑞哈医疗',
      material: '线性驱动装置 LA23',
      quantity: 2,
      reason: '产品缺陷',
      status: 'RECEIVED',
      applyDate: '2026-02-14',
      receivedDate: '2026-02-15',
    },
    { 
      rmaId: 'RMA-20260215002',
      orderNo: 'SO-20260201002',
      customer: 'IKEA',
      material: '电动推杆 B',
      quantity: 5,
      reason: '外观划痕',
      status: 'PENDING',
      applyDate: '2026-02-15',
      receivedDate: '-',
    },
  ]);

  const getStatusBadge = (status) => {
    const config = {
      'PENDING': { bg: 'rgba(245,124,0,0.1)', color: '#F57C00', text: '待处理' },
      'RECEIVED': { bg: 'rgba(45,125,210,0.1)', color: '#2D7DD2', text: '已收货' },
      'INSPECTING': { bg: 'rgba(137,124,0,0.1)', color: '#F9A825', text: '检验中' },
      'PROCESSED': { bg: 'rgba(0,137,123,0.1)', color: '#00897B', text: '已处理' },
    };
    return config[status] || config['PENDING'];
  };

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          🔄 RMA退货管理
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            刷新
          </Button>
          <Button size="sm">
            <PackageReturn className="w-4 h-4 mr-1" />
            新建退货
          </Button>
        </div>
      </div>

      {/* 统计 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>待处理</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>
            {rmas.filter(r => r.status === 'PENDING').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>已收货</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#2D7DD2' }}>
            {rmas.filter(r => r.status === 'RECEIVED').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>本月退货率</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E53935' }}>2.1%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>处理周期</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#445568' }}>3.5天</div>
        </Card>
      </div>

      {/* 退货列表 */}
      <Card className="p-4">
        <div className="space-y-4">
          {rmas.map((rma, i) => {
            const badge = getStatusBadge(rma.status);
            return (
              <div key={i} className="p-4 rounded border" style={{ background: '#131926', borderColor: '#1E2D45' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm" style={{ color: '#F57C00' }}>{rma.rmaId}</span>
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{rma.material}</div>
                      <div className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                        订单: {rma.orderNo} | 客户: {rma.customer}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs px-2 py-1 rounded" 
                      style={{ background: 'rgba(245,124,0,0.1)', color: '#F57C00' }}>
                      {rma.quantity} 件
                    </span>
                    <span className="text-xs px-2 py-1 rounded" style={{ background: badge.bg, color: badge.color }}>
                      {badge.text}
                    </span>
                    <Button variant={rma.status === 'PENDING' ? 'primary' : 'outline'} size="sm">
                      {rma.status === 'PENDING' ? '受理' : '详情'}
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: '#7A8BA8' }}>
                  <span>申请日期: {rma.applyDate}</span>
                  <span>收货日期: {rma.receivedDate}</span>
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" style={{ color: '#F57C00' }} />
                    原因: {rma.reason}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default RMAPage;
