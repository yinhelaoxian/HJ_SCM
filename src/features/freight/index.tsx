import React from 'react';
import { DollarSign, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * 运费对账页面
 * 
 * 功能：物流成本核算、差异分析、账单审核
 */
const FreightPage = () => {
  const bills = [
    { id: 'FB-202602', carrier: '顺丰速运', amount: 12500, status: '待对账', diff: '+3.2%', date: '2026-02' },
    { id: 'FB-202601', carrier: '德邦物流', amount: 8920, status: '已对账', diff: '-1.5%', date: '2026-01' },
    { id: 'FB-202601', carrier: '顺丰速运', amount: 11800, status: '已对账', diff: '0%', date: '2026-01' },
  ];

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          💰 运费对账
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <FileText className="w-4 h-4 mr-1" />
            导出账单
          </Button>
          <Button size="sm">
            新建对账
          </Button>
        </div>
      </div>

      {/* 运费概览 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>本月运费</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>¥45.2K</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>预算 ¥48K</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4" style={{ color: '#F57C00' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>待对账</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>¥12.5K</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>3 单待处理</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4" style={{ color: '#00897B' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>已对账</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>¥32.7K</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>15 单完成</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>差异金额</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>+¥1.2K</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>本月累计</div>
        </Card>
      </div>

      {/* 对账列表 */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>运费账单列表</h3>
        <div className="space-y-2">
          {bills.map((bill, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded border"
              style={{ background: '#131926', borderColor: '#1E2D45' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded flex items-center justify-center text-lg"
                  style={{ background: 'rgba(45,125,210,0.1)' }}>
                  🚚
                </div>
                <div>
                  <div className="font-medium" style={{ color: '#E8EDF4' }}>{bill.carrier}</div>
                  <div className="text-xs mt-1" style={{ color: '#445568' }}>
                    <span className="font-mono" style={{ color: '#2D7DD2' }}>{bill.id}</span>
                    <span className="mx-2">|</span>
                    {bill.date}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm font-medium" style={{ color: '#E8EDF4' }}>¥{bill.amount.toLocaleString()}</div>
                  <div className="text-xs" style={{ color: bill.diff.startsWith('+') ? '#E53935' : '#00897B' }}>
                    差异 {bill.diff}
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded"
                  style={{ 
                    background: bill.status === '待对账' ? 'rgba(245,124,0,0.1)' : 'rgba(0,137,123,0.1)',
                    color: bill.status === '待对账' ? '#F57C00' : '#00897B'
                  }}>
                  {bill.status}
                </span>
                <Button variant={bill.status === '待对账' ? 'primary' : 'ghost'} size="sm">
                  {bill.status === '待对账' ? '开始对账' : '查看详情'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FreightPage;
