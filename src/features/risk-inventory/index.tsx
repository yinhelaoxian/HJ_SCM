import React, { useState } from 'react';
import { Package, AlertTriangle, TrendingUp, TrendingDown, BarChart3, Target } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const RiskInventoryPage = () => {
  const [activeTab, setActiveTab] = useState('stock');

  // 库存风险数据
  const stockRisk = [
    { product: '智能手表 X1', current: 1200, safety: 800, max: 1500, risk: 'low' },
    { product: '蓝牙耳机 A2', current: 950, safety: 1000, max: 1800, risk: 'medium' },
    { product: '智能手环 B3', current: 450, safety: 600, max: 1200, risk: 'high' },
    { product: '无线充电器 C4', current: 1800, safety: 800, max: 1500, risk: 'high' },
    { product: '运动耳机 D5', current: 750, safety: 500, max: 1000, risk: 'low' }
  ];

  // 库存周转率数据
  const turnoverRate = [
    { month: '10月', rate: 4.2 },
    { month: '11月', rate: 3.8 },
    { month: '12月', rate: 3.5 },
    { month: '1月', rate: 3.2 },
    { month: '2月', rate: 2.8 }
  ];

  // 缺货风险数据
  const stockoutRisk = [
    { product: '智能手环 B3', demand: 850, supply: 450, gap: -400, risk: 'high' },
    { product: '蓝牙耳机 A2', demand: 1100, supply: 950, gap: -150, risk: 'medium' },
    { product: '智能手表 X1', demand: 1000, supply: 1200, gap: +200, risk: 'low' },
    { product: '运动耳机 D5', demand: 600, supply: 750, gap: +150, risk: 'low' }
  ];

  // 库存水平图表
  const inventoryLevelChart = {
    tooltip: { trigger: 'axis', backgroundColor: '#1A2235', borderColor: '#2D7DD2', textStyle: { color: '#E8EDF4' } },
    xAxis: { type: 'category', data: stockRisk.map(d => d.product), axisLabel: { color: '#7A8BA8', rotate: 30 } },
    yAxis: { type: 'value', axisLabel: { color: '#7A8BA8' }, splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } } },
    series: [
      { name: '安全库存', type: 'line', data: stockRisk.map(d => d.safety), itemStyle: { color: '#00897B' }, lineStyle: { type: 'dashed' } },
      { name: '当前库存', type: 'bar', data: stockRisk.map(d => d.current), itemStyle: { color: params => {
        const product = stockRisk[params.dataIndex];
        return product.risk === 'high' ? '#E53935' : product.risk === 'medium' ? '#F57C00' : '#2D7DD2';
      } } },
      { name: '最大库存', type: 'line', data: stockRisk.map(d => d.max), itemStyle: { color: '#7A8BA8' }, lineStyle: { type: 'dashed' } }
    ]
  };

  // 库存周转率图表
  const turnoverRateChart = {
    tooltip: { trigger: 'axis', backgroundColor: '#1A2235', borderColor: '#2D7DD2', textStyle: { color: '#E8EDF4' } },
    xAxis: { type: 'category', data: turnoverRate.map(d => d.month), axisLabel: { color: '#7A8BA8' } },
    yAxis: { type: 'value', axisLabel: { color: '#7A8BA8' }, splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } } },
    series: [
      { name: '库存周转率', type: 'line', data: turnoverRate.map(d => d.rate), smooth: true, lineStyle: { color: '#E53935', width: 2 }, itemStyle: { color: '#E53935' } }
    ]
  };

  // 缺货风险图表
  const stockoutRiskChart = {
    tooltip: { trigger: 'item', backgroundColor: '#1A2235', borderColor: '#2D7DD2', textStyle: { color: '#E8EDF4' } },
    series: [
      {
        name: '缺货风险',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
        data: [
          { value: 35, name: '高风险', itemStyle: { color: '#E53935' } },
          { value: 25, name: '中风险', itemStyle: { color: '#F57C00' } },
          { value: 40, name: '低风险', itemStyle: { color: '#00897B' } }
        ],
        label: { show: true, color: '#E8EDF4', formatter: '{b}: {d}%' }
      }
    ]
  };

  return (
    <div className="page-enter" style={{ background: '#0a1628', minHeight: '100%' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>库存风险</h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>库存水平 · 周转率 · 缺货风险</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'stock' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('stock')}
          >
            库存水平
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'turnover' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('turnover')}
          >
            周转率
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'stockout' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('stockout')}
          >
            缺货风险
          </button>
        </div>
      </div>

      {activeTab === 'stock' && (
        <div className="space-y-6">
          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
              <Package className="w-4 h-4" style={{ color: '#2D7DD2' }} />
              库存水平分析
            </h2>
            <div className="h-64">
              <ReactECharts option={inventoryLevelChart} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>风险产品列表</h2>
              <div className="space-y-3">
                {stockRisk.filter(r => r.risk === 'high').map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded" style={{ background: 'rgba(229,57,53,0.1)', border: '1px solid #E53935' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{item.product}</p>
                      <p className="text-xs" style={{ color: '#7A8BA8' }}>当前库存: {item.current} | 安全库存: {item.safety}</p>
                    </div>
                    <span className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(229,57,53,0.2)', color: '#E53935' }}>高风险</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>库存统计</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>平均库存水平</span>
                  <span className="text-sm font-bold" style={{ color: '#2D7DD2' }}>950</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>高风险产品</span>
                  <span className="text-sm font-bold" style={{ color: '#E53935' }}>2个</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>库存超出预警</span>
                  <span className="text-sm font-bold" style={{ color: '#F57C00' }}>1个</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>库存不足预警</span>
                  <span className="text-sm font-bold" style={{ color: '#E53935' }}>1个</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'turnover' && (
        <div className="space-y-6">
          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
              <TrendingDown className="w-4 h-4" style={{ color: '#2D7DD2' }} />
              库存周转率趋势
            </h2>
            <div className="h-64">
              <ReactECharts option={turnoverRateChart} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>周转率分析</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded" style={{ background: 'rgba(229,57,53,0.1)', border: '1px solid #E53935' }}>
                <p className="text-xs" style={{ color: '#7A8BA8' }}>当前周转率</p>
                <p className="text-2xl font-bold" style={{ color: '#E53935' }}>2.8</p>
                <p className="text-xs" style={{ color: '#E53935' }}>↘ 14% (较上月)</p>
              </div>
              <div className="p-3 rounded" style={{ background: 'rgba(245,124,0.1)', border: '1px solid #F57C00' }}>
                <p className="text-xs" style={{ color: '#7A8BA8' }}>平均周转率</p>
                <p className="text-2xl font-bold" style={{ color: '#F57C00' }}>3.5</p>
              </div>
              <div className="p-3 rounded" style={{ background: 'rgba(0,137,123,0.1)', border: '1px solid #00897B' }}>
                <p className="text-xs" style={{ color: '#7A8BA8' }}>目标周转率</p>
                <p className="text-2xl font-bold" style={{ color: '#00897B' }}>4.0</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stockout' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
                <AlertTriangle className="w-4 h-4" style={{ color: '#2D7DD2' }} />
                缺货风险分布
              </h2>
              <div className="h-64">
                <ReactECharts option={stockoutRiskChart} style={{ height: '100%' }} />
              </div>
            </div>

            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>缺货风险详情</h2>
              <div className="space-y-3">
                {stockoutRisk.map((item, index) => (
                  <div key={index} className="p-3 rounded" style={{
                    background: item.risk === 'high' ? 'rgba(229,57,53,0.1)' : 'rgba(245,124,0.1)',
                    border: `1px solid ${item.risk === 'high' ? '#E53935' : '#F57C00'}`
                  }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{item.product}</span>
                      <span className="text-xs" style={{ color: item.risk === 'high' ? '#E53935' : '#F57C00' }}>
                        {item.gap > 0 ? `+${item.gap}` : item.gap}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: '#7A8BA8' }}>需求: {item.demand} | 供应: {item.supply}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>缺货风险分析</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e2d45' }}>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>产品名称</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>市场需求</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>可用库存</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>缺口</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>风险等级</th>
                  </tr>
                </thead>
                <tbody>
                  {stockoutRisk.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #1e2d45' }}>
                      <td className="py-3 px-4 text-sm" style={{ color: '#E8EDF4' }}>{item.product}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.demand}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#2D7DD2' }}>{item.supply}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: item.gap < 0 ? '#E53935' : '#00897B' }}>
                        {item.gap > 0 ? `+${item.gap}` : item.gap}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            background: item.risk === 'high'
                              ? 'rgba(229,57,53,0.2)'
                              : item.risk === 'medium'
                              ? 'rgba(245,124,0.2)'
                              : 'rgba(0,137,123,0.2)',
                            color: item.risk === 'high' ? '#E53935' : item.risk === 'medium' ? '#F57C00' : '#00897B'
                          }}
                        >
                          {item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskInventoryPage;