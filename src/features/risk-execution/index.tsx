import React, { useState } from 'react';
import { AlertTriangle, Factory, Truck, Users, Activity, BarChart3, Target } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const RiskExecutionPage = () => {
  const [activeTab, setActiveTab] = useState('capacity');

  // 产能风险数据
  const capacityRisk = [
    { factory: '青岛总部', capacity: 95, utilization: 105, risk: 'high' },
    { factory: '苏州华东', capacity: 88, utilization: 85, risk: 'medium' },
    { factory: '泰国曼谷', capacity: 75, utilization: 60, risk: 'low' },
    { factory: '越南河内', capacity: 90, utilization: 92, risk: 'high' }
  ];

  // 供应商风险数据
  const supplierRisk = [
    { name: 'Bühler 精密部件', level: 'high', supplyChain: '电子', riskFactors: ['供应中断', '价格波动'], score: 35 },
    { name: 'Foxconn 代工厂', level: 'medium', supplyChain: '制造', riskFactors: ['地缘政治', '交货延迟'], score: 65 },
    { name: 'Samsung 电子', level: 'low', supplyChain: '电子', riskFactors: ['汇率风险'], score: 85 },
    { name: 'Bosch 传感器', level: 'medium', supplyChain: '电子', riskFactors: ['质量问题'], score: 70 }
  ];

  // 交付风险数据
  const deliveryRisk = [
    { orderId: 'SO-20261001', customer: 'IKEA', product: '智能咖啡机 X1', planDate: '2026-10-15', actualDate: '2026-10-20', delayDays: 5, risk: 'high' },
    { orderId: 'SO-20261002', customer: '沃尔玛', product: '空气净化器 Pro', planDate: '2026-10-20', actualDate: '2026-10-22', delayDays: 2, risk: 'medium' },
    { orderId: 'SO-20261003', customer: 'Amazon', product: '智能音箱 Mini', planDate: '2026-10-18', actualDate: '2026-10-17', delayDays: -1, risk: 'low' },
    { orderId: 'SO-20261004', customer: 'Best Buy', product: '智能门锁 V2', planDate: '2026-10-25', actualDate: '2026-10-28', delayDays: 3, risk: 'medium' }
  ];

  // 产能利用率图表
  const capacityUtilizationChart = {
    tooltip: { trigger: 'axis', backgroundColor: '#1A2235', borderColor: '#2D7DD2', textStyle: { color: '#E8EDF4' } },
    xAxis: { type: 'category', data: capacityRisk.map(d => d.factory), axisLabel: { color: '#7A8BA8' } },
    yAxis: { type: 'value', min: 0, max: 120, axisLabel: { color: '#7A8BA8' }, splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } } },
    series: [
      { name: '设计产能', type: 'bar', data: capacityRisk.map(d => d.capacity), itemStyle: { color: '#7A8BA8' } },
      { name: '实际利用率', type: 'bar', data: capacityRisk.map(d => d.utilization), itemStyle: { color: params => params.value > 100 ? '#E53935' : params.value > 90 ? '#F57C00' : '#2D7DD2' } }
    ]
  };

  // 供应商风险评分图表
  const supplierRiskChart = {
    tooltip: { trigger: 'axis', backgroundColor: '#1A2235', borderColor: '#2D7DD2', textStyle: { color: '#E8EDF4' } },
    xAxis: { type: 'category', data: supplierRisk.map(d => d.name), axisLabel: { color: '#7A8BA8', rotate: 30 } },
    yAxis: { type: 'value', min: 0, max: 100, axisLabel: { color: '#7A8BA8' }, splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } } },
    series: [
      {
        name: '风险评分',
        type: 'bar',
        data: supplierRisk.map(d => d.score),
        itemStyle: {
          color: params => {
            const value = params.value;
            return value < 40 ? '#E53935' : value < 70 ? '#F57C00' : '#00897B';
          },
          borderRadius: [4, 4, 0, 0]
        },
        label: { show: true, position: 'top', color: '#E8EDF4' }
      }
    ]
  };

  // 交付准时率图表
  const deliveryOnTimeChart = {
    tooltip: { trigger: 'item', backgroundColor: '#1A2235', borderColor: '#2D7DD2', textStyle: { color: '#E8EDF4' } },
    series: [
      {
        name: '交付状态',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
        data: [
          { value: 75, name: '准时交付', itemStyle: { color: '#00897B' } },
          { value: 15, name: '延迟1-3天', itemStyle: { color: '#F57C00' } },
          { value: 10, name: '延迟>3天', itemStyle: { color: '#E53935' } }
        ],
        label: { show: true, color: '#E8EDF4', formatter: '{b}: {d}%' }
      }
    ]
  };

  return (
    <div className="page-enter" style={{ background: '#0a1628', minHeight: '100%' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>执行风险</h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>产能风险 · 供应商风险 · 交付风险</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'capacity' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('capacity')}
          >
            产能风险
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'supplier' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('supplier')}
          >
            供应商风险
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'delivery' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('delivery')}
          >
            交付风险
          </button>
        </div>
      </div>

      {activeTab === 'capacity' && (
        <div className="space-y-6">
          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
              <Factory className="w-4 h-4" style={{ color: '#2D7DD2' }} />
              产能利用率分析
            </h2>
            <div className="h-64">
              <ReactECharts option={capacityUtilizationChart} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>风险工厂列表</h2>
              <div className="space-y-3">
                {capacityRisk.filter(r => r.risk === 'high').map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded" style={{ background: 'rgba(229,57,53,0.1)', border: '1px solid #E53935' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{item.factory}</p>
                      <p className="text-xs" style={{ color: '#7A8BA8' }}>产能利用率: {item.utilization}%</p>
                    </div>
                    <span className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(229,57,53,0.2)', color: '#E53935' }}>高风险</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>产能统计</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>平均利用率</span>
                  <span className="text-sm font-bold" style={{ color: '#F57C00' }}>85.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>高风险工厂</span>
                  <span className="text-sm font-bold" style={{ color: '#E53935' }}>2个</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>超负荷运行</span>
                  <span className="text-sm font-bold" style={{ color: '#E53935' }}>105%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>闲置产能</span>
                  <span className="text-sm font-bold" style={{ color: '#00897B' }}>15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'supplier' && (
        <div className="space-y-6">
          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
              <Users className="w-4 h-4" style={{ color: '#2D7DD2' }} />
              供应商风险评分
            </h2>
            <div className="h-64">
              <ReactECharts option={supplierRiskChart} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>风险供应商详情</h2>
            <div className="space-y-3">
              {supplierRisk.map((item, index) => (
                <div
                  key={index}
                  className="p-3 rounded border"
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
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className="w-5 h-5 mt-0.5"
                        style={{
                          color: item.level === 'high' ? '#E53935' : item.level === 'medium' ? '#F57C00' : '#00897B'
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{item.name}</p>
                        <p className="text-xs" style={{ color: '#7A8BA8' }}>供应链类别: {item.supplyChain}</p>
                        <div className="flex gap-1 mt-2">
                          {item.riskFactors.map((factor, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-xs"
                              style={{
                                background: 'rgba(45,125,210,0.1)',
                                color: '#2D7DD2'
                              }}
                            >
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: item.level === 'high' ? '#E53935' : item.level === 'medium' ? '#F57C00' : '#00897B' }}>{item.score}</div>
                      <div className="text-xs" style={{ color: '#7A8BA8' }}>风险评分</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'delivery' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
                <Truck className="w-4 h-4" style={{ color: '#2D7DD2' }} />
                交付准时率
              </h2>
              <div className="h-64">
                <ReactECharts option={deliveryOnTimeChart} style={{ height: '100%' }} />
              </div>
            </div>

            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>延迟订单详情</h2>
              <div className="space-y-3">
                {deliveryRisk.filter(r => r.delayDays > 0).map((item, index) => (
                  <div key={index} className="p-3 rounded" style={{ background: 'rgba(245,124,0.1)', border: '1px solid #F57C00' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{item.customer}</span>
                      <span className="text-xs" style={{ color: '#E53935' }}>延迟 {item.delayDays} 天</span>
                    </div>
                    <p className="text-xs" style={{ color: '#7A8BA8' }}>{item.product}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs" style={{ color: '#7A8BA8' }}>计划: {item.planDate}</span>
                      <span className="text-xs" style={{ color: '#E8EDF4' }}>实际: {item.actualDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>所有订单交付状态</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e2d45' }}>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>订单编号</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>客户名称</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>产品</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>计划交付</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>实际交付</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>延迟天数</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>风险等级</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryRisk.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #1e2d45' }}>
                      <td className="py-3 px-4 text-sm" style={{ color: '#2D7DD2' }}>{item.orderId}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#E8EDF4' }}>{item.customer}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.product}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.planDate}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: item.delayDays > 0 ? '#E53935' : '#00897B' }}>{item.actualDate}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: item.delayDays > 0 ? '#E53935' : '#00897B' }}>
                        {item.delayDays > 0 ? `+${item.delayDays}` : item.delayDays < 0 ? `${item.delayDays}` : '准时'}
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

export default RiskExecutionPage;
