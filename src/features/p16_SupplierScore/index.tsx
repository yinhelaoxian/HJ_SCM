import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

const suppliers = [
  { name: 'Buhler', score: 61, trend: 'down', otd: 61, quality: 78 },
  { name: '宁波天阁', score: 82, trend: 'stable', otd: 88, quality: 85 },
  { name: '苏州联达', score: 79, trend: 'up', otd: 82, quality: 80 }
];

const otdTrendData = [
  { month: '9月', buhler: 91, ningbo: 85, suzhou: 80 },
  { month: '10月', buhler: 87, ningbo: 86, suzhou: 81 },
  { month: '11月', buhler: 79, ningbo: 87, suzhou: 82 },
  { month: '12月', buhler: 72, ningbo: 88, suzhou: 82 },
  { month: '1月', buhler: 65, ningbo: 89, suzhou: 83 },
  { month: '2月', buhler: 61, ningbo: 88, suzhou: 82 },
];

const qualityTrendData = [
  { month: '9月', buhler: 92, ningbo: 84, suzhou: 78 },
  { month: '10月', buhler: 88, ningbo: 85, suzhou: 79 },
  { month: '11月', buhler: 84, ningbo: 85, suzhou: 80 },
  { month: '12月', buhler: 80, ningbo: 86, suzhou: 80 },
  { month: '1月', buhler: 78, ningbo: 85, suzhou: 81 },
  { month: '2月', buhler: 78, ningbo: 85, suzhou: 80 },
];

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-yellow-500" />;
};

const SupplierScore: React.FC = () => (
  <div className="page-enter">
    <h1 className="text-2xl font-display mb-6" style={{ color: '#E8EDF4' }}>供应商绩效管理</h1>
    
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
      {/* 评分排名 */}
      <div className="card p-4">
        <h3 className="text-sm mb-4 flex items-center gap-2" style={{ color: '#7A8BA8' }}>
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          综合评分排名
        </h3>
        {suppliers.map((s, i) => (
          <div key={i} className="flex items-center justify-between p-3 mb-2 rounded transition-colors" 
            style={{ background: i === 0 ? 'rgba(229,57,53,0.1)' : '#131926' }}>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" 
                style={{ background: i === 0 ? '#E53935' : i === 1 ? '#F57C00' : '#00897B', color: '#fff' }}>
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{s.name}</p>
                <p className="text-xs" style={{ color: '#7A8BA8' }}>OTD {s.otd}% · 质量 {s.quality}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendIcon trend={s.trend} />
              <span className="text-lg font-bold" style={{ 
                color: s.score >= 80 ? '#00897B' : s.score >= 60 ? '#F57C00' : '#E53935' 
              }}>{s.score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* OTD 趋势图 */}
      <div className="card p-4">
        <h3 className="text-sm mb-4 flex items-center gap-2" style={{ color: '#7A8BA8' }}>
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          OTD 准时交付趋势
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={otdTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
            <XAxis dataKey="month" stroke="#7A8BA8" fontSize={11} />
            <YAxis stroke="#7A8BA8" fontSize={11} domain={[50, 100]} />
            <Tooltip 
              contentStyle={{ background: '#0B0F17', border: '1px solid #1E2D45' }}
              labelStyle={{ color: '#E8EDF4' }}
            />
            <ReferenceLine y={90} stroke="#F57C00" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="buhler" stroke="#E53935" strokeWidth={2} dot={{ fill: '#E53935', r: 3 }} name="Buhler" />
            <Line type="monotone" dataKey="ningbo" stroke="#00897B" strokeWidth={2} dot={{ fill: '#00897B', r: 3 }} name="宁波天阁" />
            <Line type="monotone" dataKey="suzhou" stroke="#7A8BA8" strokeWidth={2} dot={{ fill: '#7A8BA8', r: 3 }} name="苏州联达" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-4 mt-2 text-xs" style={{ color: '#7A8BA8' }}>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Buhler</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500"></span> 宁波天阁</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-500"></span> 苏州联达</span>
        </div>
      </div>

      {/* 质量趋势图 */}
      <div className="card p-4">
        <h3 className="text-sm mb-4 flex items-center gap-2" style={{ color: '#7A8BA8' }}>
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          来料质量趋势
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={qualityTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
            <XAxis dataKey="month" stroke="#7A8BA8" fontSize={11} />
            <YAxis stroke="#7A8BA8" fontSize={11} domain={[70, 100]} />
            <Tooltip 
              contentStyle={{ background: '#0B0F17', border: '1px solid #1E2D45' }}
              labelStyle={{ color: '#E8EDF4' }}
            />
            <ReferenceLine y={90} stroke="#F57C00" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="buhler" stroke="#E53935" strokeWidth={2} dot={{ fill: '#E53935', r: 3 }} name="Buhler" />
            <Line type="monotone" dataKey="ningbo" stroke="#00897B" strokeWidth={2} dot={{ fill: '#00897B', r: 3 }} name="宁波天阁" />
            <Line type="monotone" dataKey="suzhou" stroke="#7A8BA8" strokeWidth={2} dot={{ fill: '#7A8BA8', r: 3 }} name="苏州联达" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-4 mt-2 text-xs" style={{ color: '#7A8BA8' }}>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> 下降趋势</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500"></span> 稳定达标</span>
        </div>
      </div>
    </div>

    {/* 预警信息 */}
    <div className="mt-4 p-4 rounded border" style={{ background: 'rgba(229,57,53,0.08)', borderColor: 'rgba(229,57,53,0.3)' }}>
      <h4 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: '#EF9A9A' }}>
        ⚠️ 需关注：Buhler OTD 连续 6 个月下滑，已跌破 90% 基准线
      </h4>
      <p className="text-xs" style={{ color: '#7A8BA8' }}>
        建议：启动备选供应商（宁波天阁）认证流程，减少对 Buhler 的依赖度
      </p>
    </div>
  </div>
);

export default SupplierScore;
