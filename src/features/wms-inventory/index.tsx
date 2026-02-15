import React, { useState } from 'react';
import { Search, Package, AlertTriangle, RefreshCw, MapPin } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * 库存查询页面
 */
const InventoryPage = () => {
  const [inventory, setInventory] = useState([
    { material: '电机 A 型', materialId: 'MAT-001', storageLocation: '青岛仓', storageBin: 'A01-01-01', batchNo: 'B20260215001', quantity: 150, unit: '个', status: 'FREE', qualityStatus: 'OK' },
    { material: '轴承 B 型', materialId: 'MAT-002', storageLocation: '青岛仓', storageBin: 'A02-01-02', batchNo: 'B20260215002', quantity: 280, unit: '个', status: 'FREE', qualityStatus: 'OK' },
    { material: '外壳 C 型', materialId: 'MAT-003', storageLocation: '苏州仓', storageBin: 'B01-02-01', batchNo: 'B20260210001', quantity: 45, unit: '个', status: 'BLOCKED', qualityStatus: 'WARNING' },
    { material: '控制器总成', materialId: 'MAT-004', storageLocation: '青岛仓', storageBin: 'C01-03-01', batchNo: 'B20260214001', quantity: 80, unit: '个', status: 'FREE', qualityStatus: 'OK' },
    { material: '线性驱动装置 LA23', materialId: 'MAT-005', storageLocation: '成品仓', storageBin: 'F01-01-01', batchNo: 'B20260215003', quantity: 30, unit: '套', status: 'FREE', qualityStatus: 'OK' },
  ]);

  const getStatusBadge = (status) => {
    const config = {
      'FREE': { bg: 'rgba(0,137,123,0.1)', color: '#00897B', text: '可用' },
      'BLOCKED': { bg: 'rgba(229,57,53,0.1)', color: '#E53935', text: '冻结' },
      'QUARANTINE': { bg: 'rgba(245,124,0,0.1)', color: '#F57C00', text: '待检' },
    };
    return config[status] || config['FREE'];
  };

  const totalQty = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const blockedQty = inventory.filter(i => i.status === 'BLOCKED').reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          📦 库存查询
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            刷新
          </Button>
          <Button size="sm">库存调整</Button>
        </div>
      </div>

      {/* 统计 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>总库存SKU</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>{inventory.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>总数量</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>{totalQty}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>冻结库存</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E53935' }}>{blockedQty}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>库位数</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#2D7DD2' }}>{new Set(inventory.map(i => i.storageBin)).size}</div>
        </Card>
      </div>

      {/* 搜索 */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#445568' }} />
            <input
              type="text"
              placeholder="搜索物料编码/名称/批次号..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded border"
              style={{ background: '#131926', borderColor: '#1E2D45', color: '#E8EDF4' }}
            />
          </div>
          <Button variant="outline">重置</Button>
          <Button>搜索</Button>
        </div>
      </Card>

      {/* 库存列表 */}
      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: '#1E2D45' }}>
                <th className="text-left py-3 px-3" style={{ color: '#7A8BA8' }}>物料编码</th>
                <th className="text-left py-3 px-3" style={{ color: '#7A8BA8' }}>物料名称</th>
                <th className="text-left py-3 px-3" style={{ color: '#7A8BA8' }}>存储地点</th>
                <th className="text-left py-3 px-3" style={{ color: '#7A8BA8' }}>库位</th>
                <th className="text-left py-3 px-3" style={{ color: '#7A8BA8' }}>批次号</th>
                <th className="text-right py-3 px-3" style={{ color: '#7A8BA8' }}>数量</th>
                <th className="text-center py-3 px-3" style={{ color: '#7A8BA8' }}>状态</th>
                <th className="text-center py-3 px-3" style={{ color: '#7A8BA8' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, i) => {
                const badge = getStatusBadge(item.status);
                return (
                  <tr key={i} className="border-b hover:bg-slate-800/50" style={{ borderColor: '#1E2D45' }}>
                    <td className="py-3 px-3 font-mono" style={{ color: '#2D7DD2' }}>{item.materialId}</td>
                    <td className="py-3 px-3" style={{ color: '#E8EDF4' }}>{item.material}</td>
                    <td className="py-3 px-3" style={{ color: '#7A8BA8' }}>{item.storageLocation}</td>
                    <td className="py-3 px-3 font-mono" style={{ color: '#445568' }}>{item.storageBin}</td>
                    <td className="py-3 px-3 font-mono" style={{ color: '#445568' }}>{item.batchNo}</td>
                    <td className="py-3 px-3 text-right font-medium" style={{ color: '#E8EDF4' }}>
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-xs px-2 py-1 rounded" style={{ background: badge.bg, color: badge.color }}>
                        {badge.text}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Button variant="ghost" size="xs">详情</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default InventoryPage;
