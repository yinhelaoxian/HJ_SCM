import React, { useState } from 'react';
import { Plus, Check, X, Package, RefreshCw, MapPin } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * 收货作业页面
 */
const GoodsReceiptPage = () => {
  const [receipts, setReceipts] = useState([
    {
      grId: 'GR-20260215001',
      poNumber: 'PO-20260214001',
      supplier: 'Bühler Motor',
      expectedDate: '2026-02-15',
      status: 'RECEIVING',
      items: [
        { material: '电机 A 型', expectedQty: 100, actualQty: 0, batchNo: 'B20260215001' }
      ]
    },
    {
      grId: 'GR-20260215002',
      poNumber: 'PO-20260214002',
      supplier: '宁波天阁',
      expectedDate: '2026-02-15',
      status: 'COMPLETED',
      items: [
        { material: '轴承 B 型', expectedQty: 200, actualQty: 200, batchNo: 'B20260215002' }
      ]
    },
  ]);

  const getStatusBadge = (status) => {
    const config = {
      'CREATED': { bg: 'rgba(68,85,104,0.2)', color: '#7A8BA8', text: '新建' },
      'RECEIVING': { bg: 'rgba(45,125,210,0.1)', color: '#2D7DD2', text: '收货中' },
      'CHECKED': { bg: 'rgba(245,124,0,0.1)', color: '#F57C00', text: '已检验' },
      'PUTAWAY': { bg: 'rgba(137,124,0,0.1)', color: '#F9A825', text: '待上架' },
      'COMPLETED': { bg: 'rgba(0,137,123,0.1)', color: '#00897B', text: '已完成' },
    };
    return config[status] || config['CREATED'];
  };

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          📥 收货作业
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            刷新
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            手工收货
          </Button>
        </div>
      </div>

      {/* 统计 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>今日收货</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>{receipts.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>收货中</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#2D7DD2' }}>
            {receipts.filter(r => r.status === 'RECEIVING').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>已完成</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>
            {receipts.filter(r => r.status === 'COMPLETED').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>待上架</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>
            {receipts.filter(r => r.status === 'PUTAWAY').length}
          </div>
        </Card>
      </div>

      {/* 收货列表 */}
      <Card className="p-4">
        <div className="space-y-4">
          {receipts.map((receipt, i) => {
            const badge = getStatusBadge(receipt.status);
            return (
              <div key={i} className="p-4 rounded border" style={{ background: '#131926', borderColor: '#1E2D45' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm" style={{ color: '#2D7DD2' }}>{receipt.grId}</span>
                    <span className="text-sm" style={{ color: '#E8EDF4' }}>{receipt.poNumber}</span>
                    <span className="text-xs px-2 py-0.5 rounded"
                      style={{ background: 'rgba(45,125,210,0.1)', color: '#2D7DD2' }}>
                      {receipt.supplier}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs" style={{ color: '#7A8BA8' }}>
                      预计: {receipt.expectedDate}
                    </span>
                    <span className="text-xs px-2 py-1 rounded" style={{ background: badge.bg, color: badge.color }}>
                      {badge.text}
                    </span>
                    <Button variant={receipt.status === 'RECEIVING' ? 'primary' : 'outline'} size="xs">
                      {receipt.status === 'RECEIVING' ? '开始收货' : '详情'}
                    </Button>
                  </div>
                </div>
                
                {/* 物料明细 */}
                <div className="mt-3 pt-3 border-t" style={{ borderColor: '#1E2D45' }}>
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ color: '#7A8BA8' }}>
                        <th className="text-left py-2 px-2">物料</th>
                        <th className="text-right py-2 px-2">应收</th>
                        <th className="text-right py-2 px-2">实收</th>
                        <th className="text-left py-2 px-2">批次号</th>
                        <th className="text-left py-2 px-2">库位</th>
                        <th className="text-center py-2 px-2">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receipt.items.map((item, j) => (
                        <tr key={j} className="border-b" style={{ borderColor: '#1E2D45' }}>
                          <td className="py-2 px-2" style={{ color: '#E8EDF4' }}>{item.material}</td>
                          <td className="py-2 px-2 text-right" style={{ color: '#7A8BA8' }}>{item.expectedQty}</td>
                          <td className="py-2 px-2 text-right font-medium" 
                            style={{ color: item.actualQty > 0 ? '#00897B' : '#E8EDF4' }}>
                            {item.actualQty}
                          </td>
                          <td className="py-2 px-2 font-mono" style={{ color: '#445568' }}>{item.batchNo}</td>
                          <td className="py-2 px-2">
                            <span className="flex items-center gap-1 text-xs" style={{ color: '#7A8BA8' }}>
                              <MapPin className="w-3 h-3" />
                              待分配
                            </span>
                          </td>
                          <td className="py-2 px-2 text-center">
                            {receipt.status === 'RECEIVING' && (
                              <Button variant="outline" size="xs">扫码收货</Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default GoodsReceiptPage;
