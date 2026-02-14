import React, { useState, useCallback, useEffect } from 'react';
import {
  Package, CheckCircle, Clock, Upload, TrendingUp,
  Search, Filter, ChevronDown, Bell, User, LogOut,
  BarChart3, FileText, Truck, AlertCircle
} from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';

/**
 * 供应商协同门户
 *
 * 功能：
 * - 订单管理（PO查看/确认）
 * - ASN上传（送货通知）
 * - 绩效看板（OTD/质量）
 * - 消息通知
 */
export default function SupplierPortal() {
  const [activeTab, setActiveTab] = useState('orders');
  const [supplierInfo, setSupplierInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // 模拟供应商信息
  const mockSupplierInfo = {
    id: 'SUP-001',
    name: '青岛电机有限公司',
    code: 'QDDJ',
    level: 'A',
    avatar: null
  };

  // 模拟PO列表
  const mockPOList = [
    {
      id: 'PO-2026-001',
      materialId: 'MED-MOTOR-001',
      materialName: '医养电机',
      quantity: 500,
      unit: 'PCS',
      price: 85.00,
      currency: 'CNY',
      requestedDate: '2026-02-28',
      status: 'SENT',
      canConfirm: true
    },
    {
      id: 'PO-2026-002',
      materialId: 'MED-MOTOR-001',
      materialName: '医养电机',
      quantity: 300,
      unit: 'PCS',
      price: 85.00,
      currency: 'CNY',
      requestedDate: '2026-03-05',
      status: 'ACKNOWLEDGED',
      canConfirm: false
    },
    {
      id: 'PO-2026-003',
      materialId: 'MED-CONTROL-001',
      materialName: '控制模块',
      quantity: 200,
      unit: 'PCS',
      price: 120.00,
      currency: 'CNY',
      requestedDate: '2026-03-10',
      status: 'DRAFT',
      canConfirm: false
    }
  ];

  // 模拟绩效数据
  const mockPerformance = {
    otdRate: 96.5,
    qualityRate: 98.2,
    responseScore: 4.5,
    totalOrders: 156,
    totalAmount: 1285000.00
  };

  // 模拟ASN列表
  const mockASNList = [
    {
      id: 'ASN-2026-001',
      poId: 'PO-2026-001',
      status: 'SUBMITTED',
      submittedAt: '2026-02-14',
      estimatedArrival: '2026-02-20'
    }
  ];

  // 模拟消息列表
  const mockMessages = [
    {
      id: 1,
      type: 'order',
      title: '新订单待确认',
      content: 'PO-2026-001 已发布，请尽快确认交期',
      time: '2小时前',
      read: false
    },
    {
      id: 2,
      type: 'system',
      title: '绩效报告',
      content: '1月绩效报告已发布，OTD率96.5%',
      time: '1天前',
      read: true
    }
  ];

  const handleConfirmPO = useCallback(async (poId) => {
    setLoading(true);
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  }, []);

  const handleUploadASN = useCallback((poId) => {
    // 跳转到ASN上传页面
    console.log('上传ASN:', poId);
  }, []);

  const getStatusBadge = (status) => {
    const config = {
      'DRAFT': { label: '草稿', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
      'SENT': { label: '待确认', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      'ACKNOWLEDGED': { label: '已确认', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
      'IN_TRANSIT': { label: '发货中', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
      'SUBMITTED': { label: '已提交', className: 'bg-green-500/20 text-green-400 border-green-500/30' }
    };
    return config[status] || config['DRAFT'];
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 顶部导航 */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">供应商协同门户</h1>
                <p className="text-gray-400 text-sm">豪江智能供应链协同平台</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* 消息通知 */}
              <button className="relative p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
                {mockMessages.filter(m => !m.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              
              {/* 用户信息 */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{mockSupplierInfo.name}</p>
                  <p className="text-gray-400 text-xs">A级供应商</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab导航 */}
        <div className="flex gap-2 mb-8">
          {[
            { key: 'orders', label: '订单管理', icon: FileText },
            { key: 'asn', label: 'ASN管理', icon: Truck },
            { key: 'performance', label: '绩效看板', icon: BarChart3 },
            { key: 'messages', label: '消息通知', icon: Bell },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {tab.key === 'orders' && mockPOList.filter(p => p.canConfirm).length > 0 && (
                <Badge variant="danger" className="ml-1">
                  {mockPOList.filter(p => p.canConfirm).length}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Tab内容 */}
        {activeTab === 'orders' && (
          <OrdersTab
            orders={mockPOList}
            onConfirm={handleConfirmPO}
            onUploadASN={handleUploadASN}
            loading={loading}
            getStatusBadge={getStatusBadge}
          />
        )}

        {activeTab === 'asn' && (
          <ASNTab asnList={mockASNList} />
        )}

        {activeTab === 'performance' && (
          <PerformanceTab data={mockPerformance} />
        )}

        {activeTab === 'messages' && (
          <MessagesTab messages={mockMessages} />
        )}
      </main>
    </div>
  );
}

/**
 * 订单管理Tab
 */
function OrdersTab({ orders, onConfirm, onUploadASN, loading, getStatusBadge }) {
  const [selectedOrders, setSelectedOrders] = useState([]);

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(o => o.id));
    }
  };

  const handleSelectOne = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handleBatchConfirm = () => {
    selectedOrders.forEach(orderId => {
      onConfirm(orderId);
    });
  };

  return (
    <div className="space-y-6">
      {/* 操作栏 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索订单号/物料..."
              className="pl-10 pr-4 py-2 w-64 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </Button>
        </div>
        
        {selectedOrders.length > 0 && (
          <Button onClick={handleBatchConfirm} disabled={loading}>
            <CheckCircle className="w-4 h-4 mr-2" />
            批量确认 ({selectedOrders.length})
          </Button>
        )}
      </div>

      {/* 订单表格 */}
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-600"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">订单号</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">物料</th>
              <th className="px-4 py-3 right text-xs font-medium text-gray-400 uppercase">数量</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">单价</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">要求交期</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">状态</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {orders.map(order => {
              const statusConfig = getStatusBadge(order.status);
              return (
                <tr key={order.id} className="hover:bg-gray-800/30">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOne(order.id)}
                      disabled={!order.canConfirm}
                      className="rounded border-gray-600"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-blue-400 text-sm">{order.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white text-sm">{order.materialName}</p>
                      <p className="font-mono text-gray-500 text-xs">{order.materialId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">
                    {order.quantity.toLocaleString()} {order.unit}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">
                    ¥{order.price.toFixed(2)}/{order.unit}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {order.requestedDate}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.className}`}>
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      {order.canConfirm && (
                        <Button variant="ghost" size="sm" onClick={() => onConfirm(order.id)}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          确认
                        </Button>
                      )}
                      {order.status === 'ACKNOWLEDGED' && (
                        <Button variant="outline" size="sm" onClick={() => onUploadASN(order.id)}>
                          <Upload className="w-4 h-4 mr-1" />
                          上传ASN
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/**
 * ASN管理Tab
 */
function ASNTab({ asnList }) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">ASN管理</h3>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          新建ASN
        </Button>
      </div>
      
      {asnList.length === 0 ? (
        <div className="text-center py-12">
          <Truck className="w-12 h-12 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">暂无ASN记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {asnList.map(asn => (
            <div key={asn.id} className="p-4 bg-gray-800 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-blue-400">{asn.id}</p>
                  <p className="text-gray-400 text-sm mt-1">关联订单: {asn.poId}</p>
                </div>
                <Badge variant="success">已提交</Badge>
              </div>
              <div className="mt-4 flex gap-6 text-sm">
                <div>
                  <p className="text-gray-500">预计到货</p>
                  <p className="text-white">{asn.estimatedArrival}</p>
                </div>
                <div>
                  <p className="text-gray-500">提交时间</p>
                  <p className="text-white">{asn.submittedAt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/**
 * 绩效看板Tab
 */
function PerformanceTab({ data }) {
  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">准时交货率</p>
              <p className="text-3xl font-bold text-white">{data.otdRate}%</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">来料合格率</p>
              <p className="text-3xl font-bold text-white">{data.qualityRate}%</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">响应速度</p>
              <p className="text-3xl font-bold text-white">{data.responseScore}/5</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">累计订单</p>
              <p className="text-3xl font-bold text-white">{data.totalOrders}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 综合评分 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">综合绩效评分</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">4.8</span>
            </div>
            <p className="text-gray-400 mt-2">A级供应商</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * 消息通知Tab
 */
function MessagesTab({ messages }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">消息通知</h3>
      </div>
      <div className="divide-y divide-gray-700">
        {messages.map(msg => (
          <div key={msg.id} className={`p-4 hover:bg-gray-800/50 ${!msg.read ? 'bg-blue-500/5' : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                msg.type === 'order' ? 'bg-blue-500/20' : 'bg-gray-700'
              }`}>
                {msg.type === 'order' ? (
                  <FileText className="w-5 h-5 text-blue-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className={`text-sm ${!msg.read ? 'text-white font-medium' : 'text-gray-300'}`}>
                    {msg.title}
                  </p>
                  <span className="text-gray-500 text-xs">{msg.time}</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{msg.content}</p>
              </div>
              {!msg.read && (
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
