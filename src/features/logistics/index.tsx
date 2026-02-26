import React from 'react';
import { Truck, MapPin, Package, DollarSign, Clock } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * 物流在途页面
 * 
 * 功能：地图追踪、ETA 预测、发货状态
 */
const LogisticsPage = () => {
  const shipments = [
    { id: 'SHP-001', dest: '上海仓', status: '在途', eta: '2026-02-16', progress: 60, driver: '张师傅' },
    { id: 'SHP-002', dest: '北京仓', status: '派送中', eta: '2026-02-15', progress: 90, driver: '李师傅' },
    { id: 'SHP-003', dest: '广州仓', status: '已发货', eta: '2026-02-17', progress: 30, driver: '王师傅' },
  ];

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          🗺️ 物流在途
        </h1>
        <Button size="sm">
          <Truck className="w-4 h-4 mr-1" />
          新建发货
        </Button>
      </div>

      {/* 物流概览 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4" style={{ color: '#2D7DD2' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>在途单数</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#2D7DD2' }}>12</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>今日新增 3</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" style={{ color: '#F57C00' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>预计超时</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>2</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>需要关注</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4" style={{ color: '#00897B' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>今日送达</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>8</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>完成率 100%</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4" style={{ color: '#445568' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>本月运费</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>¥45.2K</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>预算内</div>
        </Card>
      </div>

      {/* 地图占位 */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium" style={{ color: '#E8EDF4' }}>物流地图</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">实时</Button>
            <Button variant="ghost" size="sm">历史轨迹</Button>
          </div>
        </div>
        <div className="h-64 rounded flex items-center justify-center"
          style={{ background: 'rgba(45,125,210,0.05)', border: '1px dashed #1E2D45' }}>
          <div className="text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2" style={{ color: '#2D7DD2' }} />
            <p className="text-sm" style={{ color: '#7A8BA8' }}>地图组件占位</p>
            <p className="text-xs mt-1" style={{ color: '#445568' }}>集成高德/百度地图 API</p>
          </div>
        </div>
      </Card>

      {/* 发货列表 */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>发货单列表</h3>
        <div className="space-y-2">
          {shipments.map((ship, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded border"
              style={{ background: '#131926', borderColor: '#1E2D45' }}>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm" style={{ color: '#2D7DD2' }}>{ship.id}</span>
                <div>
                  <div className="text-sm" style={{ color: '#E8EDF4' }}>→ {ship.dest}</div>
                  <div className="text-xs" style={{ color: '#445568' }}>{ship.driver}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#7A8BA8' }}>{ship.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded bg-slate-800">
                    <div className="h-full rounded" style={{ width: `${ship.progress}%`, background: '#2D7DD2' }} />
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded"
                  style={{ 
                    background: ship.status === '派送中' ? 'rgba(0,137,123,0.1)' : 'rgba(45,125,210,0.1)',
                    color: ship.status === '派送中' ? '#00897B' : '#2D7DD2'
                  }}>
                  {ship.status}
                </span>
                <span className="text-xs" style={{ color: '#7A8BA8' }}>ETA: {ship.eta}</span>
                <Button variant="ghost" size="sm">详情</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LogisticsPage;
