import React, { useState } from 'react';
import { BarChart3, TrendingUp, Target, Users, Factory, Zap } from 'lucide-react';

const KPIBenchmarkPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('industry');

  // 行业基准数据
  const industryBenchmarks = [
    { name: '准时交付率', company: 92.5, industry: 88.2, best: 96.8 },
    { name: '库存周转率', company: 6.2, industry: 5.8, best: 7.5 },
    { name: '订单满足率', company: 89.3, industry: 85.6, best: 94.2 },
    { name: '生产效率', company: 86.7, industry: 82.3, best: 91.5 },
    { name: '成本控制', company: 78.9, industry: 75.4, best: 85.1 },
  ];

  // 竞品对比数据
  const competitorData = [
    { name: '公司A', delivery: 91.2, cost: 82.5, efficiency: 88.3 },
    { name: '公司B', delivery: 87.9, cost: 78.3, efficiency: 84.6 },
    { name: '公司C', delivery: 93.5, cost: 85.2, efficiency: 90.1 },
    { name: '公司D', delivery: 89.7, cost: 80.4, efficiency: 86.8 },
    { name: '本公司', delivery: 92.5, cost: 78.9, efficiency: 86.7 },
  ];

  // 趋势数据
  const trendData = [
    { month: '1月', company: 88, industry: 86 },
    { month: '2月', company: 89, industry: 86 },
    { month: '3月', company: 90, industry: 87 },
    { month: '4月', company: 91, industry: 87 },
    { month: '5月', company: 92, industry: 88 },
    { month: '6月', company: 92.5, industry: 88.2 },
  ];

  return (
    <div className="page-enter" style={{ background: '#0a1628', minHeight: '100%' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>对标分析</h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>行业基准 · 竞品对比 · 趋势洞察</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'industry' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('industry')}
          >
            行业基准
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'competitor' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('competitor')}
          >
            竞品对比
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'trend' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('trend')}
          >
            趋势分析
          </button>
        </div>
      </div>

      {activeTab === 'industry' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
                <Target className="w-4 h-4" style={{ color: '#2D7DD2' }} />
                核心指标对标
              </h2>
              <div className="space-y-4">
                {industryBenchmarks.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#7A8BA8' }}>{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span style={{ color: '#00897B' }}>{item.company}%</span>
                        <span style={{ color: '#7A8BA8' }}>行业{item.industry}%</span>
                        <span style={{ color: '#F57C00' }}>最佳{item.best}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded bg-gray-800 overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${(item.company / item.best) * 100}%`,
                          background: item.company >= item.industry ? '#00897B' : '#F57C00'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
                <TrendingUp className="w-4 h-4" style={{ color: '#2D7DD2' }} />
                竞争优势分析
              </h2>
              <div className="space-y-4">
                <div className="p-3 rounded" style={{ background: 'rgba(0,137,123,0.06)', border: '1px solid #00897B' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm" style={{ color: '#7A8BA8' }}>准时交付率</span>
                    <span className="font-bold" style={{ color: '#00897B' }}>+4.3%</span>
                  </div>
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>优于行业平均水平</p>
                </div>

                <div className="p-3 rounded" style={{ background: 'rgba(245,124,0,0.06)', border: '1px solid #F57C00' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm" style={{ color: '#7A8BA8' }}>成本控制</span>
                    <span className="font-bold" style={{ color: '#F57C00' }}>-6.3%</span>
                  </div>
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>低于行业最佳水平</p>
                </div>

                <div className="p-3 rounded" style={{ background: 'rgba(45,125,210,0.06)', border: '1px solid #2D7DD2' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm" style={{ color: '#7A8BA8' }}>库存周转</span>
                    <span className="font-bold" style={{ color: '#2D7DD2' }}>+0.4</span>
                  </div>
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>略高于行业平均</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
              <BarChart3 className="w-4 h-4" style={{ color: '#2D7DD2' }} />
              行业基准雷达图
            </h2>
            <div className="h-80 flex items-center justify-center">
              <div className="text-center" style={{ color: '#7A8BA8' }}>
                <p className="text-sm mb-2">雷达图可视化</p>
                <p className="text-xs">点击查看详细分析</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'competitor' && (
        <div className="space-y-6">
          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
              <Users className="w-4 h-4" style={{ color: '#2D7DD2' }} />
              主要竞品对比
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e2d45' }}>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>公司</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>准时交付率</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>成本控制</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>生产效率</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorData.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: '1px solid #1e2d45',
                        background: item.name === '本公司' ? 'rgba(45,125,210,0.1)' : 'transparent'
                      }}
                    >
                      <td className="py-3 px-4 text-sm" style={{ color: item.name === '本公司' ? '#2D7DD2' : '#E8EDF4' }}>
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.delivery}%</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.cost}%</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.efficiency}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: '#2D7DD2' }}>2.3</div>
                <div className="text-xs" style={{ color: '#7A8BA8' }}>竞争优势指数</div>
              </div>
            </div>

            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: '#F57C00' }}>89.2</div>
                <div className="text-xs" style={{ color: '#7A8BA8' }}>综合得分</div>
              </div>
            </div>

            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: '#00897B' }}>Top 3</div>
                <div className="text-xs" style={{ color: '#7A8BA8' }}>行业排名</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trend' && (
        <div className="space-y-6">
          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
              <TrendingUp className="w-4 h-4" style={{ color: '#2D7DD2' }} />
              指标趋势对比
            </h2>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center" style={{ color: '#7A8BA8' }}>
                <p className="text-sm mb-2">趋势图表</p>
                <p className="text-xs">本公司与行业平均趋势对比</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>增长预测</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>准时交付率</span>
                  <span className="text-sm" style={{ color: '#00897B' }}>+3.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>库存周转率</span>
                  <span className="text-sm" style={{ color: '#00897B' }}>+12.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>成本控制</span>
                  <span className="text-sm" style={{ color: '#F57C00' }}>-5.3%</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>改进建议</h2>
              <div className="space-y-3">
                <div className="p-2 rounded" style={{ background: 'rgba(245,124,0,0.06)', border: '1px solid #F57C00' }}>
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>
                    <span style={{ color: '#F57C00' }}>⚠</span> 成本控制需加强，差距主要在原材料采购
                  </p>
                </div>
                <div className="p-2 rounded" style={{ background: 'rgba(0,137,123,0.06)', border: '1px solid #00897B' }}>
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>
                    <span style={{ color: '#00897B' }}>✓</span> 准时交付率保持行业领先
                  </p>
                </div>
                <div className="p-2 rounded" style={{ background: 'rgba(45,125,210,0.06)', border: '1px solid #2D7DD2' }}>
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>
                    <span style={{ color: '#2D7DD2' }}>→</span> 生产效率提升空间较大
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KPIBenchmarkPage;
