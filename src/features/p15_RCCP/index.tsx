import React from 'react';
import { Factory, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';
import { Card } from '@/ui/Card';

const capacity = [
  { name: '青岛A线', util: 112, status: 'overload', product: 'HJ-LA23 线性推杆' },
  { name: '青岛B线', util: 78, status: 'normal', product: 'HJ-LA15 线性推杆' },
  { name: '泰国线', util: 43, status: 'under', product: 'HJ-LA23 爬坡中' }
];

const RCCP: React.FC = () => (
  <div className="page-enter">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-display flex items-center gap-2" style={{ color: '#E8EDF4' }}>
        <Factory className="w-6 h-6" style={{ color: '#F57C00' }} />
        RCCP 粗能力核查
      </h1>
      <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(45,125,210,0.1)', color: '#3D9BE9' }}>
        数据更新: 2026-02-14
      </span>
    </div>

    <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
      {/* 产能利用率 */}
      <div className="card p-4">
        <h3 className="text-sm font-medium mb-4" style={{ color: '#7A8BA8' }}>各产线产能利用率</h3>
        <div className="space-y-4">
          {capacity.map(c => (
            <div key={c.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{c.name}</span>
                  {c.status === 'overload' && (
                    <span className="text-xs px-2 py-0.5 rounded bg-red-900 text-red-400">超负荷</span>
                  )}
                  {c.status === 'under' && (
                    <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-400">利用不足</span>
                  )}
                </div>
                <span className="text-sm font-bold"
                  style={{ color: c.util > 100 ? '#E53935' : c.util < 60 ? '#F57C00' : '#00897B' }}>
                  {c.util}%
                </span>
              </div>
              <div className="h-3 rounded bg-slate-800 overflow-hidden">
                <div className="h-full rounded transition-all duration-500"
                  style={{ 
                    width: `${c.util}%`,
                    background: c.util > 100 ? 'linear-gradient(90deg, #E53935, #EF5350)' : 
                               c.util < 60 ? 'linear-gradient(90deg, #F57C00, #FFB74D)' : 
                               'linear-gradient(90deg, #00897B, #4DB6AC)'
                  }} 
                />
              </div>
              <p className="text-xs mt-1" style={{ color: '#445568' }}>{c.product}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 产能预警 */}
      <div className="card p-4" style={{ background: 'rgba(229,57,53,0.05)', borderColor: 'rgba(229,57,53,0.2)' }}>
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#EF9A9A' }}>
          <AlertTriangle className="w-4 h-4" /> 产能瓶颈预警
        </h3>
        <div className="space-y-3">
          <div className="p-3 rounded bg-slate-900">
            <p className="text-sm mb-1" style={{ color: '#E8EDF4' }}>青岛A线 12% 超负荷</p>
            <p className="text-xs" style={{ color: '#7A8BA8' }}>HJ-LA23 订单积压 2,000 件</p>
          </div>
          <div className="p-3 rounded bg-slate-900">
            <p className="text-sm mb-1" style={{ color: '#E8EDF4' }}>泰国线产能利用率仅 43%</p>
            <p className="text-xs" style={{ color: '#7A8BA8' }}>爬坡期产能未充分利用</p>
          </div>
        </div>
      </div>
    </div>

    {/* AI 建议 */}
    <Card className="p-4" style={{ background: 'rgba(0,137,123,0.06)', borderColor: 'rgba(0,137,123,0.2)' }}>
      <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#4DB6AC' }}>
        <Lightbulb className="w-4 h-4" /> AI 产能优化建议
      </h3>
      <div className="flex items-start gap-4">
        <div className="flex-1 p-4 rounded bg-slate-900">
          <p className="text-sm mb-3" style={{ color: '#E8EDF4' }}>
            <strong style={{ color: '#4DB6AC' }}>青岛A线超负荷12%</strong>，建议将 2,000 件 
            HJ-LA23 转产泰国工厂，预计可：
          </p>
          <ul className="text-xs space-y-1" style={{ color: '#7A8BA8' }}>
            <li className="flex items-center gap-2">
              <span>✓</span> 节省产能瓶颈损失 <strong style={{ color: '#EF9A9A' }}>¥95万</strong>
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span> 提升泰国线利用率至 <strong style={{ color: '#4DB6AC' }}>68%</strong>
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span> 缩短交货周期 <strong style={{ color: '#4DB6AC' }}>3 天</strong>
            </li>
          </ul>
        </div>
        <button className="px-4 py-2 rounded text-sm flex items-center gap-2 whitespace-nowrap"
          style={{ background: '#00897B', color: '#fff' }}>
          应用此方案 <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Card>
  </div>
);

export default RCCP;
