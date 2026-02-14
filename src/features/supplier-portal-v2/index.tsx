import React, { useState } from 'react';
import {
  Package, Truck, FileText, Bell,
  CheckCircle, Clock, AlertCircle, Settings
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

/**
 * 供应商门户2.0
 */
export default function SupplierPortalV2() {
  const [activeTab, setActiveTab] = useState('orders');
  
  const mockData = {
    pendingOrders: 12,
    confirmedOrders: 28,
    shippedOrders: 8,
    pendingInvoices: 5
  };
  
  const orders = [
    { id: 'PO-2026-001', items: '电机A-100台', amount: '¥128,500', status: '待确认', date: '2026-02-14' },
    { id: 'PO-2026-002', items: '控制器B-50套', amount: '¥85,600', status: '已确认', date: '2026-02-13' },
    { id: 'PO-2026-003', items: '传感器C-200个', amount: '¥42,000', status: '待发货', date: '2026-02-12' }
  ];
  
  const notifications = [
    { type: 'order', message: '新订单待确认', time: '2小时前' },
    { type: 'delivery', message: '发货提醒', time: '1天前' },
    { type: 'invoice', message: '发票待处理', time: '2天前' }
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white">供应商门户</h1>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-amber-500/20 border-amber-500/30">
          <Clock className="w-8 h-8 text-amber-400 mb-2"/>
          <p className="text-gray-400 text-sm">待确认订单</p>
          <p className="text-3xl font-bold text-white">{mockData.pendingOrders}</p>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-blue-500/20 border-blue-500/30">
          <CheckCircle className="w-8 h-8 text-blue-400 mb-2"/>
          <p className="text-gray-400 text-sm">已确认订单</p>
          <p className="text-3xl font-bold text-white">{mockData.confirmedOrders}</p>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-green-500/20 border-green-500/30">
          <Truck className="w-8 h-8 text-green-400 mb-2"/>
          <p className="text-gray-400 text-sm">待发货</p>
          <p className="text-3xl font-bold text-white">{mockData.shippedOrders}</p>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-500/20 border-purple-500/30">
          <FileText className="w-8 h-8 text-purple-400 mb-2"/>
          <p className="text-gray-400 text-sm">待对账</p>
          <p className="text-3xl font-bold text-white">{mockData.pendingInvoices}</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {/* 订单列表 */}
        <div className="col-span-2">
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex gap-4">
              {['orders', 'shipments', 'invoices'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded ${
                    activeTab === tab 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab === 'orders' ? '订单' : tab === 'shipments' ? '发货' : '对账'}
                </button>
              ))}
            </div>
            
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">订单号</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">物料</th>
                  <th className="px-4 py-3 text-right text-xs text-gray-400">金额</th>
                  <th className="px-4 py-3 text-center text-xs text-gray-400">状态</th>
                  <th className="px-4 py-3 text-center text-xs text-gray-400">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders.map((order, i) => (
                  <tr key={i} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-blue-400 font-mono">{order.id}</td>
                    <td className="px-4 py-3 text-white">{order.items}</td>
                    <td className="px-4 py-3 text-right text-white">{order.amount}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={
                        order.status === '待确认' ? 'warning' :
                        order.status === '已确认' ? 'success' : 'default'
                      }>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button size="sm" variant="ghost">
                        {order.status === '待确认' ? '确认' : '查看'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
        
        {/* 通知面板 */}
        <Card className="p-4">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400"/>
            消息通知
          </h3>
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div key={i} className="p-3 bg-gray-800 rounded-lg">
                <p className="text-white text-sm">{n.message}</p>
                <p className="text-gray-500 text-xs mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
