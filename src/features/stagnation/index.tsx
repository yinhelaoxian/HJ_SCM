import React from 'react';
import { AlertTriangle, Clock, TrendingDown, DollarSign } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * 呆滞预警页面
 * 
 * 功能：长库龄识别、减值建议、处置跟踪
 */
const StagnationPage = () => {
  const items = [
    { sku: 'OLD-001', name: '旧型号外壳', qty: 500, age: 180, value: '¥25K', action: '降价', risk: 'high' },
    { sku: 'OLD-002', name: '淘汰配件', qty: 200, age: 365, value: '¥40K', action: '报废', risk: 'critical' },
    { sku: 'OLD-003', name: '尾货轴承', qty: 1000, age: 90, value: '¥12K', action: '调拨', risk: 'medium' },
  ];

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          ⚡ 呆滞预警
        </h1>
        <Button variant="outline" size="sm">
          导出报告
        </Button>
      </div>

      {/* 呆滞概览 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" style={{ color: '#7A8BA8' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>90天以上</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>28</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>SKU 数</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" style={{ color: '#F57C00' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>180天以上</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>12</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>需关注</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4" style={{ color: '#E53935' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>365天以上</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E53935' }}>5</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>建议报废</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4" style={{ color: '#445568' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>呆滞金额</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>¥156K</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>占用资金</div>
        </Card>
      </div>

      {/* 呆滞列表 */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>呆滞物料清单</h3>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded border-l-2"
              style={{ 
                background: '#131926', 
                borderColor: item.risk === 'critical' ? '#E53935' : item.risk === 'high' ? '#F57C00' : '#2D7DD2'
              }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded flex items-center justify-center text-lg"
                  style={{ background: 'rgba(245,124,0,0.1)' }}>
                  📦
                </div>
                <div>
                  <div className="font-medium" style={{ color: '#E8EDF4' }}>{item.name}</div>
                  <div className="text-xs mt-1" style={{ color: '#445568' }}>
                    <span className="font-mono" style={{ color: '#2D7DD2' }}>{item.sku}</span>
                    <span className="mx-2">|</span>
                    库龄 {item.age} 天
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm" style={{ color: '#E8EDF4' }}>{item.qty} 件</div>
                  <div className="text-xs" style={{ color: '#445568' }}>{item.value}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded"
                  style={{ 
                    background: item.action === '报废' ? 'rgba(229,57,53,0.1)' : 
                               item.action === '降价' ? 'rgba(245,124,0,0.1)' : 'rgba(45,125,210,0.1)',
                    color: item.action === '报废' ? '#E53935' : 
                           item.action === '降价' ? '#F57C00' : '#2D7DD2'
                  }}>
                  {item.action}
                </span>
                <Button variant="outline" size="sm">处理</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StagnationPage;
