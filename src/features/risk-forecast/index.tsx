import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, BarChart3, Target, Zap } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const RiskForecastPage = () => {
  const [activeTab, setActiveTab] = useState('demand');

  // 需求波动数据
  const demandFluctuation = [
    { period: 'Q1', forecast: 1200, actual: 1150, variance: -4.2 },
    { period: 'Q2', forecast: 1300, actual: 1450, variance: +11.5 },
    { period: 'Q3', forecast: 1400, actual: 1280, variance: -8.6 },
    { period: 'Q4', forecast: 1500, actual: 1620, variance: +8.0 },
    { period: 'Q1(下)', forecast: 1600, actual: null, variance: null }
  ];

  // 预测偏差数据
  const forecastBias = [
    { product: '智能手表 X1', forecast: 850, actual: 890, bias: +4.7 },
    { product: '蓝牙耳机 A2', forecast: 1200, actual: 1150, bias: -4.2 },
    { product: '智能手环 B3', forecast: 600, actual: 720, bias: +20.0 },
    { product: '无线充电器 C4', forecast: 950, actual: 900, bias: -5.3 },
    { product: '运动耳机 D5', forecast: 750, actual: 780, bias: +4.0 }
  ];

  // 风险预警数据
  const riskAlerts = [
    { id: 'RA20241201', category: '需求波动', product: '智能手环 B3', level: 'high', description: 'Q1需求预测偏差20%', date: '2024-12-20' },
    { id: 'RA20241202', category: '预测偏差', product: '无线充电器 C4', level: 'medium', description: '连续3个月预测偏差超过5%', date: '2024-12-19' },
    { id: 'RA20241203', category: '需求波动', product: '蓝牙耳机 A2', level: 'low', description: '季节性需求波动预警', date: '2024-12-18' },
    { id: 'RA20241204', category: '预测偏差', product: '智能手表 X1', level: 'medium', description: '新品上市预测偏差15%', date: '2024-12-17' }
  ];

  // 需求波动图表
  const demandFluctuationChart = {
    tooltip: { trigger: 'axis', backgroundColor: '#1A2235', borderColor: '#2D7DD2', textStyle: { color: '#E8EDF4' } },
    xAxis: { type: 'category', data: demandFluctuation.map(d => d.period), axisLabel: { color: '#7A8BA8' } },
    yAxis: { type: 'value', axisLabel: { color: '#7A8BA8' }, splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } } },
    series: [
      { name: '预测值', type: 'bar', data: demandFluctuation.map(d => d.forecast), itemStyle: { color: '#7A8BA8' } },
      { name: '实际值', type: 'bar', data: demandFluctuation.map(d => d.actual), itemStyle: { color: '#2D7DD2' } },
      { name: '偏差率', type: 'line', yAxisIndex: 1, data: demandFluctuation.map(d => d.variance), smooth: true, lineStyle: { color: '#E53935', width: 2 }, itemStyle: { color: '#E53935' } }
    ],
    yAxis: [
      { type: 'value', axisLabel: { color: '#7A8BA8' }, splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } } },
      { type: 'value', name: '偏差率(%)', position: 'right', axisLabel: { color: '#7A8BA8' }, splitLine: { show: false } }
    ]
  };

  // 预测偏差图表
  const forecastBiasChart = {
    tooltip: { trigger: 'item', backgroundColor: '#1A2235', borderColor: '#2D7DD2', textStyle: { color: '#E8EDF4' } },
    polar: { radius: ['30%', '70%'] },
    angleAxis: { type: 'category', data: forecastBias.map(d => d.product), axisLabel: { color: '#7A8BA8' } },
    radiusAxis: { min: -20, max: 20, axisLabel: { color: '#7A8BA8' }, splitLine: { lineStyle: { color: '#1E2D45' } } },
    series: [
      {
        name: '预测偏差',
        type: 'bar',
        data: forecastBias.map(d => d.bias),
        coordinateSystem: 'polar',
        itemStyle: {
          color: params => {
            const value = params.value;
            return value > 0 ? '#E53935' : '#00897B';
          }
        }
      }
    ]
  };

  return (
    <div className="page-enter" style={{ background: '#0a1628', minHeight: '100%' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>预测风险</h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>需求波动 · 预测偏差 · 风险预警</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'demand' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('demand')}
          >
            需求波动
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'bias' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('bias')}
          >
            预测偏差
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'alert' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('alert')}
          >
            风险预警
          </button>
        </div>
      </div>

      {activeTab === 'demand' && (
        <div className="space-y-6">
          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
              <TrendingUp className="w-4 h-4" style={{ color: '#2D7DD2' }} />
              需求波动分析
            </h2>
            <div className="h-64">
              <ReactECharts option={demandFluctuationChart} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>波动统计</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>最大波动</span>
                  <span className="text-sm font-bold" style={{ color: '#E53935' }}>+11.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>最小波动</span>
                  <span className="text-sm font-bold" style={{ color: '#00897B' }}>-4.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>平均波动</span>
                  <span className="text-sm font-bold" style={{ color: '#F57C00' }}>5.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>波动标准差</span>
                  <span className="text-sm font-bold" style={{ color: '#2D7DD2' }}>6.3%</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>风险等级分布</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 rounded" style={{ background: 'rgba(229,57,53,0.1)', border: '1px solid #E53935' }}>
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>高风险</span>
                  <span className="text-sm font-bold" style={{ color: '#E53935' }}>2</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded" style={{ background: 'rgba(245,124,0.1)', border: '1px solid #F57C00' }}>
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>中风险</span>
                  <span className="text-sm font-bold" style={{ color: '#F57C00' }}>3</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded" style={{ background: 'rgba(0,137,123,0.1)', border: '1px solid #00897B' }}>
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>低风险</span>
                  <span className="text-sm font-bold" style={{ color: '#00897B' }}>5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bias' && (
        <div className="space-y-6">
          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
              <Target className="w-4 h-4" style={{ color: '#F57C00' }} />
              预测偏差分析
            </h2>
            <div className="h-64">
              <ReactECharts option={forecastBiasChart} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>偏差详情</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e2d45' }}>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>产品名称</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>预测值</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>实际值</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>偏差值</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>偏差率</th>
                  </tr>
                </thead>
                <tbody>
                  {forecastBias.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #1e2d45' }}>
                      <td className="py-3 px-4 text-sm" style={{ color: '#E8EDF4' }}>{item.product}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.forecast}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#2D7DD2' }}>{item.actual}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: item.bias > 0 ? '#E53935' : '#00897B' }}>
                        {item.bias > 0 ? `+${item.bias}` : item.bias}
                      </td>
                      <td className="py-3 px-4 text-sm" style={{ color: item.bias > 0 ? '#E53935' : '#00897B' }}>
                        {item.bias > 0 ? `+${item.bias}%` : `${item.bias}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'alert' && (
        <div className="space-y-6">
          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>风险预警列表</h2>
            <div className="space-y-3">
              {riskAlerts.map((item, index) => (
                <div
                  key={index}
                  className="p-3 rounded border flex items-start justify-between"
                  style={{
                    background: item.level === 'high'
                      ? 'rgba(229,57,53,0.1)'
                      : item.level === 'medium'
                      ? 'rgba(245,124,0.1)'
                      : 'rgba(0,137,123,0.1)',
                    borderColor: item.level === 'high'
                      ? '#E53935'
                      : item.level === 'medium'
                      ? '#F57C00'
                      : '#00897B'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className="w-5 h-5 mt-0.5"
                      style={{
                        color: item.level === 'high' ? '#E53935' : item.level === 'medium' ? '#F57C00' : '#00897B'
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{item.product}</span>
                        <span
                          className="px-2 py-0.5 rounded text-xs"
                          style={{
                            background: item.level === 'high'
                              ? 'rgba(229,57,53,0.2)'
                              : item.level === 'medium'
                              ? 'rgba(245,124,0.2)'
                              : 'rgba(0,137,123,0.2)',
                            color: item.level === 'high' ? '#E53935' : item.level === 'medium' ? '#F57C00' : '#00897B'
                          }}
                        >
                          {item.level === 'high' ? '高风险' : item.level === 'medium' ? '中风险' : '低风险'}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: '#7A8BA8' }}>{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs" style={{ color: '#7A8BA8' }}>类别: {item.category}</span>
                        <span className="text-xs" style={{ color: '#7A8BA8' }}>日期: {item.date}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="px-3 py-1.5 rounded text-xs"
                    style={{
                      background: 'rgba(45,125,210,0.1)',
                      borderColor: '#2D7DD2',
                      color: '#2D7DD2'
                    }}
                  >
                    查看详情
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded border" style={{ background: 'rgba(229,57,53,0.1)', borderColor: '#E53935' }}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: '#E53935' }}>3</div>
                <div className="text-xs" style={{ color: '#7A8BA8' }}>高风险预警</div>
              </div>
            </div>
            <div className="p-4 rounded border" style={{ background: 'rgba(245,124,0.1)', borderColor: '#F57C00' }}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: '#F57C00' }}>5</div>
                <div className="text-xs" style={{ color: '#7A8BA8' }}>中风险预警</div>
              </div>
            </div>
            <div className="p-4 rounded border" style={{ background: 'rgba(0,137,123,0.1)', borderColor: '#00897B' }}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: '#00897B' }}>8</div>
                <div className="text-xs" style={{ color: '#7A8BA8' }}>低风险预警</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskForecastPage;
