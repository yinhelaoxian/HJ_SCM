import React, { useState } from 'react';
import { 
  FileText, Download, Filter, TrendingUp,
  TrendingDown, Calendar, DollarSign
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

/**
 * 采购执行报表
 */
export default function ProcurementReport() {
  const [activeTab, setActiveTab] = useState('execution');
  
  const mockData = {
    poMetrics: { total: 156, amount: 1280, onTime: 94, quality: 98 },
    supplierMetrics: { a: 45, b: 120, c: 35 },
    priceMetrics: { avg: 85, trend: '-2.3%' }
  };
  
  const poList = [
    { id: 'PO-2026-001', supplier: '青岛电机', amount: 128500, status: '已完成', onTime: true },
    { id: 'PO-2026-002', supplier: '中晶科技', amount: 85600, status: '执行中', onTime: false }
  ];
  
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-white">采购报表</h1>
      
      {/* 指标卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-500/20 border-blue-500/30">
          <DollarSign className="w-8 h-8 text-blue-400 mb-4"/>
          <p className="text-gray-400 text-sm">本月采购额</p>
          <p className="text-3xl font-bold text-white">¥{mockData.poMetrics.amount}万</p>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-green-500/20 border-green-500/30">
          <CheckCircle className="w-8 h-8 text-green-400 mb-4"/>
          <p className="text-gray-400 text-sm">准时率</p>
          <p className="text-3xl font-bold text-white">{mockData.poMetrics.onTime}%</p>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-amber-500/20 border-amber-500/30">
          <TrendingDown className="w-8 h-8 text-amber-400 mb-4"/>
          <p className="text-gray-400 text-sm">价格指数</p>
          <p className="text-3xl font-bold text-white">{mockData.priceMetrics.avg}</p>
          <p className="text-green-400 text-sm">{mockData.priceMetrics.trend}</p>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-500/20 border-purple-500/30">
          <FileText className="w-8 h-8 text-purple-400 mb-4"/>
          <p className="text-gray-400 text-sm">PO数量</p>
          <p className="text-3xl font-bold text-white">{mockData.poMetrics.total}</p>
        </Card>
      </div>
      
      {/* PO列表 */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between">
          <h3 className="text-white font-medium">采购订单明细</h3>
          <Button size="sm"><Download className="w-4 h-4 mr-2"/>导出</Button>
        </div>
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-gray-400">PO编号</th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">供应商</th>
              <th className="px-4 py-3 text-right text-xs text-gray-400">金额</th>
              <th className="px-4 py-3 text-center text-xs text-gray-400">状态</th>
              <th className="px-4 py-3 text-center text-xs text-gray-400">准时</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {poList.map((po, i) => (
              <tr key={i} className="hover:bg-gray-800/30">
                <td className="px-4 py-3 text-blue-400 font-mono">{po.id}</td>
                <td className="px-4 py-3 text-white">{po.supplier}</td>
                <td className="px-4 py-3 text-right text-white">¥{po.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={po.status === '已完成' ? 'success' : 'default'}>
                    {po.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={po.onTime ? 'text-green-400' : 'text-red-400'}>
                    {po.onTime ? '✓' : '✗'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
