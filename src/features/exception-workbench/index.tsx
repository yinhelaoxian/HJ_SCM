import React, { useState, useMemo } from 'react';
import {
  AlertTriangle, AlertCircle, Clock, TrendingUp,
  Filter, Search, ChevronRight, User, CheckCircle,
  ArrowUp, MoreHorizontal
} from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';

/**
 * 异常驱动工作台
 *
 * 功能：
 * - 异常列表（动态优先级排序）
 * - 异常详情面板
 * - 处理/升级操作
 * - SLA监控
 */
export default function ExceptionWorkbench() {
  const [selectedException, setSelectedException] = useState(null);
  const [filter, setFilter] = useState('ALL');

  // 模拟异常数据
  const mockExceptions = [
    {
      id: 'EXC-001',
      type: 'SHORTAGE',
      title: 'HJ-LA23 圣诞旺季缺料预警',
      materialId: 'HJ-LA23',
      materialName: '线性推杆 35mm',
      quantity: -500,
      amount: 4250000,
      priorityScore: 95,
      priorityLevel: 'CRITICAL',
      status: 'OPEN',
      slaDeadline: '2026-02-14 12:00',
      createdAt: '2026-02-14 08:00',
      customerLevel: 'A'
    },
    {
      id: 'EXC-002',
      type: 'DELAY',
      title: 'Bühler 延期6周确认',
      supplierId: 'SUP-001',
      supplierName: 'Bühler 德国',
      delayDays: 42,
      amount: 1340000,
      priorityScore: 88,
      priorityLevel: 'HIGH',
      status: 'PROCESSING',
      assignedTo: 'USER-001',
      slaDeadline: '2026-02-16 08:00',
      createdAt: '2026-02-13 16:00',
      customerLevel: 'A'
    },
    {
      id: 'EXC-003',
      type: 'CAPACITY',
      title: '青岛A线产能超负荷112%',
      materialId: 'HJ-LA23',
      materialName: 'A线 35mm产线',
      shortageQty: 850000,
      priorityScore: 78,
      priorityLevel: 'HIGH',
      status: 'OPEN',
      slaDeadline: '2026-02-15 08:00',
      createdAt: '2026-02-14 07:30',
      customerLevel: 'A'
    },
    {
      id: 'EXC-004',
      type: 'QUALITY',
      title: 'HJ-SP03 来料质检不合格',
      materialId: 'HJ-SP03',
      materialName: '精密弹簧件',
      quantity: 480,
      amount: 25000,
      priorityScore: 65,
      priorityLevel: 'MEDIUM',
      status: 'OPEN',
      slaDeadline: '2026-02-17 08:00',
      createdAt: '2026-02-14 09:00',
      customerLevel: 'B'
    },
    {
      id: 'EXC-005',
      type: 'STOCKOUT',
      title: 'HJ-M05 DC电机断供风险',
      materialId: 'HJ-M05',
      materialName: 'Bühler DC电机',
      quantity: -2000,
      amount: 3200000,
      priorityScore: 92,
      priorityLevel: 'CRITICAL',
      status: 'OPEN',
      slaDeadline: '2026-02-14 18:00',
      createdAt: '2026-02-14 10:00',
      customerLevel: 'A'
    },
  ];
      priorityLevel: 'MEDIUM',
      status: 'OPEN',
      slaDeadline: '2026-02-17 08:00',
      createdAt: '2026-02-14 06:00',
      customerLevel: 'C'
    }
  ];

  // 过滤和排序
  const filteredExceptions = useMemo(() => {
    let result = [...mockExceptions];
    
    if (filter !== 'ALL') {
      result = result.filter(e => e.status === filter);
    }
    
    return result.sort((a, b) => b.priorityScore - a.priorityScore);
  }, [filter]);

  // 统计
  const stats = useMemo(() => ({
    total: mockExceptions.length,
    open: mockExceptions.filter(e => e.status === 'OPEN').length,
    critical: mockExceptions.filter(e => e.priorityLevel === 'CRITICAL').length,
    escalated: mockExceptions.filter(e => e.status === 'ESCALATED').length
  }), [mockExceptions]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'SHORTAGE': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'QUALITY': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'DELAY': return <Clock className="w-5 h-5 text-blue-400" />;
      default: return <TrendingUp className="w-5 h-5 text-purple-400" />;
    }
  };

  const getPriorityStyle = (level) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      'OPEN': { label: '待处理', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      'PROCESSING': { label: '处理中', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
      'ESCALATED': { label: '已升级', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      'RESOLVED': { label: '已解决', className: 'bg-green-500/20 text-green-400 border-green-500/30' }
    };
    return config[status] || config['OPEN'];
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 页面标题 */}
      <div className="px-6 py-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">异常驱动工作台</h1>
        <p className="text-gray-400 mt-1">优先级 = 影响度 × 紧急度 × 金额权重 × 客户等级</p>
      </div>

      <div className="p-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">全部异常</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-blue-400" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">待处理</p>
                <p className="text-3xl font-bold text-white">{stats.open}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-400" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">紧急</p>
                <p className="text-3xl font-bold text-white">{stats.critical}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">已升级</p>
                <p className="text-3xl font-bold text-white">{stats.escalated}</p>
              </div>
              <ArrowUp className="w-8 h-8 text-purple-400" />
            </div>
          </Card>
        </div>

        <div className="flex gap-6">
          {/* 异常列表 */}
          <div className="flex-1">
            {/* 筛选栏 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                {[
                  { key: 'ALL', label: '全部' },
                  { key: 'OPEN', label: '待处理' },
                  { key: 'PROCESSING', label: '处理中' },
                  { key: 'RESOLVED', label: '已解决' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === tab.key
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索异常..."
                    className="pl-10 pr-4 py-2 w-64 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 异常列表 */}
            <div className="space-y-3">
              {filteredExceptions.map(exception => (
                <Card
                  key={exception.id}
                  className={`p-4 cursor-pointer transition-all hover:border-blue-500/50 ${
                    selectedException?.id === exception.id ? 'border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedException(exception)}
                >
                  <div className="flex items-start gap-4">
                    {/* 类型图标 */}
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      {getTypeIcon(exception.type)}
                    </div>
                    
                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-sm text-gray-400">{exception.id}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityStyle(exception.priorityLevel)}`}>
                          P{exception.priorityLevel}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusBadge(exception.status).className}`}>
                          {getStatusBadge(exception.status).label}
                        </span>
                      </div>
                      
                      <h3 className="text-white font-medium mb-1">{exception.title}</h3>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{exception.materialName || exception.supplierName}</span>
                        {exception.quantity && (
                          <span>数量: {exception.quantity}</span>
                        )}
                        {exception.delayDays && (
                          <span>延期: {exception.delayDays}天</span>
                        )}
                        <span>¥{exception.amount?.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {/* SLA剩余时间 */}
                    <div className="text-right">
                      <p className="text-xs text-gray-500">SLA剩余</p>
                      <p className="text-sm text-amber-400 font-medium">
                        {exception.slaDeadline.split(' ')[0]}
                      </p>
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* 异常详情 */}
          {selectedException && (
            <div className="w-96">
              <Card className="p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">异常详情</h3>
                  <button 
                    onClick={() => setSelectedException(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                {/* 基本信息 */}
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">优先级分数</p>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{selectedException.priorityScore}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedException.priorityLevel}</p>
                        <p className="text-gray-400 text-sm">影响度 × 紧急度 × 金额 × 客户</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-xs">异常类型</p>
                      <p className="text-white">{selectedException.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">客户等级</p>
                      <p className="text-white">{selectedException.customerLevel || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">影响金额</p>
                      <p className="text-white">¥{selectedException.amount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">SLA截止</p>
                      <p className="text-white">{selectedException.slaDeadline}</p>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="space-y-3">
                  <Button className="w-full" leftIcon={<CheckCircle className="w-4 h-4" />}>
                    处理异常
                  </Button>
                  <Button variant="outline" className="w-full" leftIcon={<ArrowUp className="w-4 h-4" />}>
                    升级处理
                  </Button>
                  <Button variant="ghost" className="w-full" leftIcon={<User className="w-4 h-4" />}>
                    指派他人
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
