import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Package, Factory, FileText, Search } from 'lucide-react';

const ProductionCompletionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('completion');

  // 完工列表数据
  const completionList = [
    { id: 'WO202412001', product: '智能手表 X1', quantity: 500, completed: 450, status: 'processing' },
    { id: 'WO202412002', product: '蓝牙耳机 A2', quantity: 1000, completed: 1000, status: 'inspection' },
    { id: 'WO202412003', product: '智能手环 B3', quantity: 750, completed: 750, status: 'warehouse' },
    { id: 'WO202412004', product: '无线充电器 C4', quantity: 1200, completed: 800, status: 'processing' },
    { id: 'WO202412005', product: '运动耳机 D5', quantity: 900, completed: 900, status: 'completed' },
  ];

  // 质检数据
  const qualityChecks = [
    { id: 'QC202412001', order: 'WO202412002', product: '蓝牙耳机 A2', passRate: 98.5, defect: 15 },
    { id: 'QC202412002', order: 'WO202412003', product: '智能手环 B3', passRate: 99.2, defect: 6 },
    { id: 'QC202412003', order: 'WO202412001', product: '智能手表 X1', passRate: 97.8, defect: 10 },
  ];

  // 入库记录
  const warehouseRecords = [
    { id: 'WH202412001', order: 'WO202412003', product: '智能手环 B3', quantity: 744, time: '2024-12-20 10:30' },
    { id: 'WH202412002', order: 'WO202412005', product: '运动耳机 D5', quantity: 891, time: '2024-12-19 16:45' },
    { id: 'WH202412003', order: 'WO202412002', product: '蓝牙耳机 A2', quantity: 985, time: '2024-12-18 09:20' },
  ];

  return (
    <div className="page-enter" style={{ background: '#0a1628', minHeight: '100%' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>完工汇报</h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>完工录入 · 质量检查 · 成品入库</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'completion' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('completion')}
          >
            完工录入
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'quality' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('quality')}
          >
            质检管理
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm ${activeTab === 'warehouse' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300'}`}
            onClick={() => setActiveTab('warehouse')}
          >
            入库记录
          </button>
        </div>
      </div>

      {activeTab === 'completion' && (
        <div className="space-y-6">
          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
              <CheckCircle className="w-4 h-4" style={{ color: '#00897B' }} />
              完工任务列表
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e2d45' }}>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>工单编号</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>产品名称</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>计划数量</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>已完成</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>进度</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>状态</th>
                  </tr>
                </thead>
                <tbody>
                  {completionList.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #1e2d45' }}>
                      <td className="py-3 px-4 text-sm" style={{ color: '#2D7DD2' }}>{item.id}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#E8EDF4' }}>{item.product}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.quantity}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.completed}</td>
                      <td className="py-3 px-4">
                        <div className="w-24 h-2 rounded bg-gray-800 overflow-hidden">
                          <div
                            className="h-full"
                            style={{
                              width: `${(item.completed / item.quantity) * 100}%`,
                              background: (item.completed / item.quantity) >= 1 ? '#00897B' : '#2D7DD2'
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            background: item.status === 'completed'
                              ? 'rgba(0,137,123,0.15)'
                              : item.status === 'processing'
                              ? 'rgba(45,125,210,0.15)'
                              : 'rgba(245,124,0,0.15)',
                            borderColor: item.status === 'completed'
                              ? '#00897B'
                              : item.status === 'processing'
                              ? '#2D7DD2'
                              : '#F57C00',
                            color: item.status === 'completed'
                              ? '#00897B'
                              : item.status === 'processing'
                              ? '#2D7DD2'
                              : '#F57C00'
                          }}
                        >
                          {item.status === 'processing' && '生产中'}
                          {item.status === 'inspection' && '质检中'}
                          {item.status === 'warehouse' && '待入库'}
                          {item.status === 'completed' && '已完成'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>完工统计</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>今日完工</span>
                  <span className="text-sm font-bold" style={{ color: '#00897B' }}>2,579</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>本周累计</span>
                  <span className="text-sm font-bold" style={{ color: '#2D7DD2' }}>12,458</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>本月目标</span>
                  <span className="text-sm font-bold" style={{ color: '#F57C00' }}>50,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>完成率</span>
                  <span className="text-sm font-bold" style={{ color: '#00897B' }}>68.5%</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>快速操作</h2>
              <div className="space-y-3">
                <button
                  className="w-full py-2 rounded border text-sm"
                  style={{
                    background: 'rgba(45,125,210,0.06)',
                    borderColor: '#2D7DD2',
                    color: '#2D7DD2'
                  }}
                >
                  新建完工单
                </button>
                <button
                  className="w-full py-2 rounded border text-sm"
                  style={{
                    background: 'rgba(245,124,0,0.06)',
                    borderColor: '#F57C00',
                    color: '#F57C00'
                  }}
                >
                  批量导入
                </button>
                <button
                  className="w-full py-2 rounded border text-sm"
                  style={{
                    background: 'rgba(0,137,123,0.06)',
                    borderColor: '#00897B',
                    color: '#00897B'
                  }}
                >
                  导出报表
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'quality' && (
        <div className="space-y-6">
          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
              <AlertCircle className="w-4 h-4" style={{ color: '#F57C00' }} />
              质检结果记录
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e2d45' }}>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>质检编号</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>工单编号</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>产品名称</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>合格率</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>缺陷数</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>状态</th>
                  </tr>
                </thead>
                <tbody>
                  {qualityChecks.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #1e2d45' }}>
                      <td className="py-3 px-4 text-sm" style={{ color: '#2D7DD2' }}>{item.id}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#E8EDF4' }}>{item.order}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.product}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm"
                            style={{ color: item.passRate >= 98 ? '#00897B' : item.passRate >= 95 ? '#F57C00' : '#E53935' }}
                          >
                            {item.passRate}%
                          </span>
                          <div className="w-20 h-1.5 rounded bg-gray-800 overflow-hidden">
                            <div
                              className="h-full"
                              style={{
                                width: `${item.passRate}%`,
                                background: item.passRate >= 98 ? '#00897B' : item.passRate >= 95 ? '#F57C00' : '#E53935'
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#E53935' }}>{item.defect}</td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            background: item.passRate >= 98
                              ? 'rgba(0,137,123,0.15)'
                              : item.passRate >= 95
                              ? 'rgba(245,124,0,0.15)'
                              : 'rgba(229,57,53,0.15)',
                            borderColor: item.passRate >= 98
                              ? '#00897B'
                              : item.passRate >= 95
                              ? '#F57C00'
                              : '#E53935',
                            color: item.passRate >= 98
                              ? '#00897B'
                              : item.passRate >= 95
                              ? '#F57C00'
                              : '#E53935'
                          }}
                        >
                          {item.passRate >= 98 ? '优秀' : item.passRate >= 95 ? '良好' : '待改善'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: '#00897B' }}>98.5%</div>
                <div className="text-xs" style={{ color: '#7A8BA8' }}>平均合格率</div>
              </div>
            </div>

            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: '#E53935' }}>31</div>
                <div className="text-xs" style={{ color: '#7A8BA8' }}>缺陷总数</div>
              </div>
            </div>

            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: '#F57C00' }}>3</div>
                <div className="text-xs" style={{ color: '#7A8BA8' }}>质检任务</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'warehouse' && (
        <div className="space-y-6">
          <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
            <h2 className="text-base font-medium mb-4 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
              <Package className="w-4 h-4" style={{ color: '#2D7DD2' }} />
              入库记录
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e2d45' }}>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>入库编号</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>工单编号</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>产品名称</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>入库数量</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>入库时间</th>
                    <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouseRecords.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #1e2d45' }}>
                      <td className="py-3 px-4 text-sm" style={{ color: '#2D7DD2' }}>{item.id}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#E8EDF4' }}>{item.order}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.product}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#00897B' }}>{item.quantity}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#7A8BA8' }}>{item.time}</td>
                      <td className="py-3 px-4">
                        <button
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            background: 'rgba(45,125,210,0.06)',
                            borderColor: '#2D7DD2',
                            color: '#2D7DD2'
                          }}
                        >
                          查看详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>入库统计</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>今日入库</span>
                  <span className="text-sm font-bold" style={{ color: '#00897B' }}>1,733</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>本周累计</span>
                  <span className="text-sm font-bold" style={{ color: '#2D7DD2' }}>8,986</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>本月累计</span>
                  <span className="text-sm font-bold" style={{ color: '#F57C00' }}>42,567</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>本月目标</span>
                  <span className="text-sm font-bold" style={{ color: '#E53935' }}>50,000</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded border" style={{ background: '#0f1d33', borderColor: '#1e2d45' }}>
              <h2 className="text-base font-medium mb-4" style={{ color: '#E8EDF4' }}>存储位置</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 rounded" style={{ background: 'rgba(45,125,210,0.06)', border: '1px solid #2D7DD2' }}>
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>成品库-A区</span>
                  <span className="text-sm" style={{ color: '#00897B' }}>1,234</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded" style={{ background: 'rgba(45,125,210,0.06)', border: '1px solid #2D7DD2' }}>
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>成品库-B区</span>
                  <span className="text-sm" style={{ color: '#00897B' }}>896</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded" style={{ background: 'rgba(45,125,210,0.06)', border: '1px solid #2D7DD2' }}>
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>成品库-C区</span>
                  <span className="text-sm" style={{ color: '#00897B' }}>2,156</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded" style={{ background: 'rgba(45,125,210,0.06)', border: '1px solid #2D7DD2' }}>
                  <span className="text-sm" style={{ color: '#7A8BA8' }}>待检区</span>
                  <span className="text-sm" style={{ color: '#F57C00' }}>345</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionCompletionPage;
