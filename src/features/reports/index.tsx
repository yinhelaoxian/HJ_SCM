import React, { useState } from 'react';
import { FileText, Download, Search, Filter, Settings, TrendingUp, Target } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('templates');

  // 报表模板数据
  const reportTemplates = [
    { id: 'TMP001', name: '销售业绩报表', category: '销售', format: 'Excel', frequency: '每日', views: 1254 },
    { id: 'TMP002', name: '库存周转率分析', category: '库存', format: 'PDF', frequency: '每周', views: 892 },
    { id: 'TMP003', name: '生产成本核算', category: '生产', format: 'Excel', frequency: '每月', views: 678 },
    { id: 'TMP004', name: '采购订单分析', category: '采购', format: 'Excel', frequency: '每日', views: 1567 },
    { id: 'TMP005', name: '客户满意度报告', category: '质量', format: 'PDF', frequency: '季度', views: 432 },
    { id: 'TMP006', name: '供应链风险评估', category: '风险', format: 'PPT', frequency: '月度', views: 234 }
  ];

  // 自定义查询数据
  const customQueries = [
    { id: 'QRY001', name: '热销产品销售分析', description: '按地区、产品类型分析热销产品销售趋势', lastRun: '2024-12-20 10:30', status: 'success' },
    { id: 'QRY002', name: '库存呆滞预警', description: '查询超过90天未移动的库存产品', lastRun: '2024-12-19 16:45', status: 'warning' },
    { id: 'QRY003', name: '供应商交付准时率', description: '分析主要供应商的订单交付准时情况', lastRun: '2024-12-18 09:20', status: 'success' },
    { id: 'QRY004', name: '生产效率对比', description: '对比不同生产线的生产效率和产出', lastRun: '2024-12-17 14:15', status: 'error' }
  ];

  // 数据导出记录
  const exportRecords = [
    { id: 'EXP001', filename: 'sales_report_202412.xlsx', format: 'Excel', size: '2.3MB', time: '2024-12-20 10:30', status: '完成' },
    { id: 'EXP002', filename: 'inventory_analysis.pdf', format: 'PDF', size: '1.8MB', time: '2024-12-20 09:15', status: '完成' },
    { id: 'EXP003', filename: 'production_costs.csv', format: 'CSV', size: '856KB', time: '2024-12-19 16:45', status: '完成' },
    { id: 'EXP004', filename: 'supplier_risk_2024.xlsx', format: 'Excel', size: '4.2MB', time: '2024-12-18 09:20', status: '失败' }
  ];

  // 报表使用趋势图表
  const reportUsageTrend = {
    tooltip: { trigger: 'axis', backgroundColor: '#1A2235', borderColor: '#2D7DD2', textStyle: { color: '#E8EDF4' } },
    xAxis: { type: 'category', data: ['12/15', '12/16', '12/17', '12/18', '12/19', '12/20'], axisLabel: { color: '#7A8BA8' } },
    yAxis: { type: 'value', axisLabel: { color: '#7A8BA8' }, splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } } },
    series: [
      { name: '报表查看', type: 'line', data: [890, 950, 880, 1020, 1100, 1254], smooth: true, lineStyle: { color: '#2D7DD2', width: 2 }, itemStyle: { color: '#2D7DD2' } },
      { name: '数据导出', type: 'bar', data: [450, 480, 420, 510, 550, 620], itemStyle: { color: '#00897B' } }
    ]
  };

  // 报表类别分布图表
  const reportCategoryChart = {
    tooltip: { trigger: 'item', backgroundColor: '#1A2235', borderColor: '#2D7DD2', textStyle: { color: '#E8EDF4' } },
    series: [
      {
        name: '报表类别',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
        data: [
          { value: 35, name: '销售报表', itemStyle: { color: '#2D7DD2' } },
          { value: 25, name: '库存报表', itemStyle: { color: '#00897B' } },
          { value: 20, name: '生产报表', itemStyle: { color: '#F57C00' } },
          { value: 15, name: '采购报表', itemStyle: { color: '#E53935' } },
          { value: 5, name: '其他报表', itemStyle: { color: '#7A8BA8' } }
        ],
        label: { show: true, color: '#E8EDF4', formatter: '{b}: {d}%' }
      }
    ]
  };

  return (
    <div className="page-enter" style={{ background: '#0a1628', minHeight: '100%' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>自助报表</h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>报表模板 · 自定义查询 · 数据导出</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'templates' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('templates')}
          >
            报表模板
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'custom' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('custom')}
          >
            自定义查询
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'export' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('export')}
          >
            数据导出
          </button>
        </div>
      </div>

      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
                <TrendingUp className="w-4 h-4" style={{ color: '#2D7DD2' }} />
                报表使用趋势
              </h2>
              <div className="h-48">
                <ReactECharts option={reportUsageTrend} style={{ height: '100%' }} />
              </div>
            </div>

            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
                <Target className="w-4 h-4" style={{ color: '#00897B' }} />
                报表类别分布
              </h2>
              <div className="h-48">
                <ReactECharts option={reportCategoryChart} style={{ height: '100%' }} />
              </div>
            </div>
          </div>

          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-medium" style={{ color: '#E8EDF4' }}>报表模板列表</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2.5 top-2.5" style={{ color: '#7A8BA8' }} />
                  <input
                    type="text"
                    placeholder="搜索报表名称..."
                    className="pl-9 pr-3 py-1.5 rounded text-sm w-64"
                    style={{ background: '#0B0F17', borderColor: '#1E2D45', color: '#E8EDF4' }}
                  />
                </div>
                <button
                  className="px-3 py-1.5 rounded text-sm"
                  style={{
                    background: 'rgba(45,125,210,0.1)',
                    borderColor: '#2D7DD2',
                    color: '#2D7DD2'
                  }}
                >
                  <Filter className="w-4 h-4 inline mr-1" />
                  筛选
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e2d45' }}>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>模板编号</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>报表名称</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>类别</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>格式</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>生成频率</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>查看次数</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {reportTemplates.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #1e2d45' }}>
                      <td className="py-3 px-4 text-sm" style={{ color: '#2D7DD2' }}>{item.id}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#E8EDF4' }}>{item.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            background: item.category === '销售'
                              ? 'rgba(45,125,210,0.1)'
                              : item.category === '库存'
                              ? 'rgba(0,137,123,0.1)'
                              : item.category === '生产'
                              ? 'rgba(245,124,0.1)'
                              : 'rgba(229,57,53,0.1)',
                            borderColor: item.category === '销售'
                              ? '#2D7DD2'
                              : item.category === '库存'
                              ? '#00897B'
                              : item.category === '生产'
                              ? '#F57C00'
                              : '#E53935',
                            color: item.category === '销售'
                              ? '#2D7DD2'
                              : item.category === '库存'
                              ? '#00897B'
                              : item.category === '生产'
                              ? '#F57C00'
                              : '#E53935'
                          }}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.format}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.frequency}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.views}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              background: 'rgba(45,125,210,0.1)',
                              borderColor: '#2D7DD2',
                              color: '#2D7DD2'
                            }}
                          >
                            预览
                          </button>
                          <button
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              background: 'rgba(0,137,123,0.1)',
                              borderColor: '#00897B',
                              color: '#00897B'
                            }}
                          >
                            下载
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>快速创建查询</h2>
              <div className="space-y-3">
                <div className="p-3 rounded" style={{ background: 'rgba(45,125,210,0.06)', border: '1px solid #2D7DD2' }}>
                  <p className="text-sm" style={{ color: '#E8EDF4' }}>
                    <Search className="w-4 h-4 inline mr-1" style={{ color: '#2D7DD2' }} />
                    销售数据分析
                  </p>
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>按地区、产品类型查询销售数据</p>
                </div>
                <div className="p-3 rounded" style={{ background: 'rgba(0,137,123,0.06)', border: '1px solid #00897B' }}>
                  <p className="text-sm" style={{ color: '#E8EDF4' }}>
                    <Filter className="w-4 h-4 inline mr-1" style={{ color: '#00897B' }} />
                    库存查询
                  </p>
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>查询特定产品的库存信息</p>
                </div>
                <div className="p-3 rounded" style={{ background: 'rgba(245,124,0.06)', border: '1px solid #F57C00' }}>
                  <p className="text-sm" style={{ color: '#E8EDF4' }}>
                    <Settings className="w-4 h-4 inline mr-1" style={{ color: '#F57C00' }} />
                    高级查询
                  </p>
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>自定义SQL查询创建报表</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>最近查询记录</h2>
              <div className="space-y-3">
                {customQueries.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className="p-3 rounded"
                    style={{
                      background: item.status === 'success'
                        ? 'rgba(0,137,123,0.1)'
                        : item.status === 'warning'
                        ? 'rgba(245,124,0.1)'
                        : 'rgba(229,57,53,0.1)',
                      border: item.status === 'success'
                        ? '1px solid #00897B'
                        : item.status === 'warning'
                        ? '1px solid #F57C00'
                        : '1px solid #E53935'
                    }}
                  >
                    <p className="text-sm" style={{ color: '#E8EDF4' }}>{item.name}</p>
                    <p className="text-xs" style={{ color: '#7A8BA8' }}>最后运行: {item.lastRun}</p>
                    <button
                      className="px-2 py-1 rounded text-xs mt-2"
                      style={{
                        background: 'rgba(45,125,210,0.1)',
                        borderColor: '#2D7DD2',
                        color: '#2D7DD2'
                      }}
                    >
                      再次运行
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>所有查询</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e2d45' }}>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>查询编号</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>查询名称</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>描述</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>最后运行时间</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>状态</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {customQueries.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #1e2d45' }}>
                      <td className="py-3 px-4 text-sm" style={{ color: '#2D7DD2' }}>{item.id}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#E8EDF4' }}>{item.name}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.description}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.lastRun}</td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            background: item.status === 'success'
                              ? 'rgba(0,137,123,0.2)'
                              : item.status === 'warning'
                              ? 'rgba(245,124,0.2)'
                              : 'rgba(229,57,53,0.2)',
                            color: item.status === 'success' ? '#00897B' : item.status === 'warning' ? '#F57C00' : '#E53935'
                          }}
                        >
                          {item.status === 'success' ? '成功' : item.status === 'warning' ? '警告' : '失败'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              background: 'rgba(45,125,210,0.1)',
                              borderColor: '#2D7DD2',
                              color: '#2D7DD2'
                            }}
                          >
                            运行
                          </button>
                          <button
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              background: 'rgba(0,137,123,0.1)',
                              borderColor: '#00897B',
                              color: '#00897B'
                            }}
                          >
                            编辑
                          </button>
                          <button
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              background: 'rgba(229,57,53,0.1)',
                              borderColor: '#E53935',
                              color: '#E53935'
                            }}
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'export' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: '#2D7DD2' }}>24</div>
                <div className="text-xs" style={{ color: '#7A8BA8' }}>今日导出次数</div>
              </div>
            </div>
            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: '#00897B' }}>128</div>
                <div className="text-xs" style={{ color: '#7A8BA8' }}>本周导出次数</div>
              </div>
            </div>
            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: '#F57C00' }}>1.2GB</div>
                <div className="text-xs" style={{ color: '#7A8BA8' }}>导出数据总量</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-medium" style={{ color: '#E8EDF4' }}>数据导出记录</h2>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 rounded text-sm"
                  style={{
                    background: 'rgba(45,125,210,0.1)',
                    borderColor: '#2D7DD2',
                    color: '#2D7DD2'
                  }}
                >
                  <Download className="w-4 h-4 inline mr-1" />
                  新导出
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e2d45' }}>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>导出编号</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>文件名</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>格式</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>文件大小</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>导出时间</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>状态</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {exportRecords.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #1e2d45' }}>
                      <td className="py-3 px-4 text-sm" style={{ color: '#2D7DD2' }}>{item.id}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#E8EDF4' }}>{item.filename}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.format}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.size}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.time}</td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            background: item.status === '完成'
                              ? 'rgba(0,137,123,0.2)'
                              : 'rgba(229,57,53,0.2)',
                            color: item.status === '完成' ? '#00897B' : '#E53935'
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {item.status === '完成' ? (
                          <button
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              background: 'rgba(0,137,123,0.1)',
                              borderColor: '#00897B',
                              color: '#00897B'
                            }}
                          >
                            下载
                          </button>
                        ) : (
                          <button
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              background: 'rgba(229,57,53,0.1)',
                              borderColor: '#E53935',
                              color: '#E53935'
                            }}
                          >
                            重试
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>导出格式支持</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded text-center" style={{ background: 'rgba(45,125,210,0.1)', border: '1px solid #2D7DD2' }}>
                  <p className="text-sm" style={{ color: '#2D7DD2' }}>Excel</p>
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>.xlsx</p>
                </div>
                <div className="p-2 rounded text-center" style={{ background: 'rgba(45,125,210,0.1)', border: '1px solid #2D7DD2' }}>
                  <p className="text-sm" style={{ color: '#2D7DD2' }}>PDF</p>
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>.pdf</p>
                </div>
                <div className="p-2 rounded text-center" style={{ background: 'rgba(45,125,210,0.1)', border: '1px solid #2D7DD2' }}>
                  <p className="text-sm" style={{ color: '#2D7DD2' }}>CSV</p>
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>.csv</p>
                </div>
                <div className="p-2 rounded text-center" style={{ background: 'rgba(45,125,210,0.1)', border: '1px solid #2D7DD2' }}>
                  <p className="text-sm" style={{ color: '#2D7DD2' }}>PPT</p>
                  <p className="text-xs" style={{ color: '#7A8BA8' }}>.pptx</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>导出设置</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>自动压缩文件</span>
                  <input type="checkbox" checked className="rounded" style={{ background: '#2D7DD2' }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>发送导出通知</span>
                  <input type="checkbox" checked className="rounded" style={{ background: '#2D7DD2' }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>数据加密</span>
                  <input type="checkbox" className="rounded" style={{ background: '#1E2D45' }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>导出历史保留</span>
                  <select
                    className="px-2 py-1 rounded text-sm"
                    style={{ background: '#0B0F17', borderColor: '#1E2D45', color: '#E8EDF4' }}
                  >
                    <option>7天</option>
                    <option>30天</option>
                    <option>90天</option>
                    <option>永久</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
