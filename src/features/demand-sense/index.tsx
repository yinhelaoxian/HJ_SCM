import React from 'react';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * 需求感知页面
 * 
 * 功能：短期需求修正、信号识别、异常检测
 */
const DemandSensePage = () => {
  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          ⚡ 需求感知
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            刷新
          </Button>
        </div>
      </div>

      {/* 异常信号概览 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>异常信号</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E53935' }}>3</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>待处理信号</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>需求偏移</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>+12%</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>较预测值</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>突发订单</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#2D7DD2' }}>5</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>本周新增</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>渠道差异</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>2</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>渠道冲突</div>
        </Card>
      </div>

      {/* 信号列表 */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium" style={{ color: '#E8EDF4' }}>异常信号列表</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#445568' }} />
              <input 
                type="text"
                placeholder="搜索信号..."
                className="pl-9 pr-4 py-1.5 text-sm rounded border"
                style={{ 
                  background: '#131926', 
                  borderColor: '#1E2D45',
                  color: '#E8EDF4'
                }}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { type: 'urgent', title: '突发大单：客户 A 追加 5000 套', time: '10:30', status: '待处理' },
            { type: 'warning', title: '渠道库存差异：SKU-1234 偏差 15%', time: '09:15', status: '处理中' },
            { type: 'info', title: '促销提前：电商渠道销量激增', time: '08:45', status: '已确认' },
          ].map((signal, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded border-l-2"
              style={{ 
                background: '#131926',
                borderColor: signal.type === 'urgent' ? '#E53935' : signal.type === 'warning' ? '#F57C00' : '#2D7DD2'
              }}>
              <div>
                <div className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{signal.title}</div>
                <div className="text-xs mt-1" style={{ color: '#445568' }}>{signal.time}</div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded"
                style={{ 
                  background: signal.status === '待处理' ? 'rgba(229,57,53,0.1)' : 
                             signal.status === '处理中' ? 'rgba(245,124,0,0.1)' : 'rgba(0,137,123,0.1)',
                  color: signal.status === '待处理' ? '#E53935' : 
                         signal.status === '处理中' ? '#F57C00' : '#00897B'
                }}>
                {signal.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DemandSensePage;
