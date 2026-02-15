import React from 'react';
import { TrendingUp, Grid, AlertTriangle } from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

/**
 * ABC-XYZ 分类页面
 * 
 * 功能：动态分类、矩阵分析、策略建议
 */
const ABCXYZPage = () => {
  const categories = [
    { name: 'AX', count: 45, pct: '28%', color: '#00897B', desc: '高价值、稳定' },
    { name: 'AY', count: 32, pct: '20%', color: '#2D7DD2', desc: '高价值、波动' },
    { name: 'AZ', count: 18, pct: '11%', color: '#F57C00', desc: '高价值、随机' },
    { name: 'BX', count: 67, pct: '18%', color: '#00897B', desc: '中价值、稳定' },
    { name: 'BY', count: 48, pct: '13%', color: '#2D7DD2', desc: '中价值、波动' },
    { name: 'BZ', count: 22, pct: '6%', color: '#F57C00', desc: '中价值、随机' },
    { name: 'CX', count: 85, pct: '2%', color: '#00897B', desc: '低价值、稳定' },
    { name: 'CY', count: 35, pct: '1%', color: '#F57C00', desc: '低价值、波动' },
    { name: 'CZ', count: 12, pct: '1%', color: '#E53935', desc: '低价值、随机' },
  ];

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          📊 ABC-XYZ 分类
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Grid className="w-4 h-4 mr-1" />
            矩阵视图
          </Button>
          <Button size="sm">
            重新计算
          </Button>
        </div>
      </div>

      {/* 分类概览 */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>物料总数</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#E8EDF4' }}>364</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>已分类</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm mb-1" style={{ color: '#7A8BA8' }}>A 类占比</div>
          <div className="text-2xl font-display font-bold" style={{ color: '#00897B' }}>59%</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>价值贡献</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" style={{ color: '#F57C00' }} />
            <span className="text-sm" style={{ color: '#7A8BA8' }}>Z 类物料</span>
          </div>
          <div className="text-2xl font-display font-bold" style={{ color: '#F57C00' }}>30</div>
          <div className="text-xs mt-1" style={{ color: '#445568' }}>需关注</div>
        </Card>
      </div>

      {/* 分类矩阵 */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>ABC-XYZ 分类矩阵</h3>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {categories.map((cat, i) => (
            <div key={i} className="p-3 rounded border cursor-pointer hover:opacity-80 transition-opacity"
              style={{ background: `${cat.color}15`, borderColor: cat.color }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold" style={{ color: cat.color }}>{cat.name}</span>
                <span className="text-xs" style={{ color: '#7A8BA8' }}>{cat.count} 项</span>
              </div>
              <div className="text-xs" style={{ color: '#E8EDF4' }}>{cat.desc}</div>
              <div className="text-xs mt-1" style={{ color: '#445568' }}>占比 {cat.pct}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* 策略建议 */}
      <Card className="p-4 mt-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>分类策略建议</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded"
            style={{ background: 'rgba(0,137,123,0.08)' }}>
            <TrendingUp className="w-4 h-4 mt-0.5" style={{ color: '#00897B' }} />
            <div>
              <div className="text-sm font-medium" style={{ color: '#00897B' }}>AX 类（稳定高价值）</div>
              <div className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                采用定期订购策略，安全库存可适度降低，关注需求趋势变化
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded"
            style={{ background: 'rgba(245,124,0,0.08)' }}>
            <AlertTriangle className="w-4 h-4 mt-0.5" style={{ color: '#F57C00' }} />
            <div>
              <div className="text-sm font-medium" style={{ color: '#F57C00' }}>CZ 类（随机低价值）</div>
              <div className="text-xs mt-1" style={{ color: '#7A8BA8' }}>
                考虑简化管理，两箱法或定量订货，减少库存占用
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ABCXYZPage;
