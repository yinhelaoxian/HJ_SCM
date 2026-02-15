import React from 'react';
import { Percent, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * 促销管理页面
 * 
 * 功能：活动日历、促销计划、需求冲击分析
 */
const PromotionsPage = () => {
  const promotions = [
    { name: '618 大促', impact: '+35%', status: '已生效', date: '06.01-06.20' },
    { name: '双11 预售', impact: '+50%', status: '规划中', date: '11.01-11.15' },
    { name: '国庆促销', impact: '+20%', status: '已完成', date: '10.01-10.07' },
  ];

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          📅 促销管理
        </h1>
        <Button>
          <Percent className="w-4 h-4 mr-1" />
          新建促销
        </Button>
      </div>

      {/* 促销概览 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4" style={{ color: '#2D7DD2' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>活动数量</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>8</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>本季度</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#00897B' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>平均冲击</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>+28%</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>需求提升</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" style={{ color: '#F57C00' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>预警活动</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>1</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>库存不足</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>计划覆盖</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>85%</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>促销预测</div>
        </Card>
      </div>

      {/* 促销列表 */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>促销活动列表</h3>
        <div className="space-y-3">
          {promotions.map((promo, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded border"
              style={{ background: '#131926', borderColor: '#1E2D45' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded flex items-center justify-center text-xl"
                  style={{ background: 'rgba(45,125,210,0.1)' }}>
                  🎯
                </div>
                <div>
                  <div className="font-medium" style={{ color: '#E8EDF4' }}>{promo.name}</div>
                  <div className="text-xs mt-1" style={{ color: '#445568' }}>{promo.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-sm font-medium" style={{ color: '#00897B' }}>{promo.impact}</div>
                  <div className="text-xs" style={{ color: '#445568' }}>需求冲击</div>
                </div>
                <span className="text-xs px-2 py-1 rounded"
                  style={{ 
                    background: promo.status === '已生效' ? 'rgba(0,137,123,0.1)' : 
                               promo.status === '规划中' ? 'rgba(45,125,210,0.1)' : 'rgba(245,124,0,0.1)',
                    color: promo.status === '已生效' ? '#00897B' : 
                           promo.status === '规划中' ? '#2D7DD2' : '#F57C00'
                  }}>
                  {promo.status}
                </span>
                <Button variant="ghost" size="sm">详情</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PromotionsPage;
