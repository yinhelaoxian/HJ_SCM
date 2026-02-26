// 供应链控制塔页面
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Package, 
  Truck, 
  Factory, 
  ShoppingCart, 
  RotateCcw,
  Settings,
  ArrowRight,
  Zap,
  Clock,
  DollarSign,
  Users,
  Globe,
  Database,
  CheckCircle,
  XCircle
} from 'lucide-react';

// 类型定义
interface DefenseLine {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'good' | 'warning' | 'critical';
  metrics: DefenseMetric[];
}

interface DefenseMetric {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
}

interface ISCStep {
  id: string;
  name: string;
  status: 'good' | 'warning' | 'critical';
  metrics: { label: string; value: string | number }[];
  link: string;
  color: string;
}

// 模拟数据
const mockDefenseLines: DefenseLine[] = [
  {
    id: 1,
    name: '第一道防线',
    description: '日常运营风险管理',
    icon: <Shield className="w-8 h-8" />,
    status: 'good',
    metrics: [
      { label: '库存周转率', value: '8.5次', trend: 'up' },
      { label: 'OTD准时交货率', value: '96.8%', trend: 'up' },
      { label: '生产计划达成率', value: '94.2%', trend: 'stable' },
      { label: '关键物料到位率', value: '98.5%', trend: 'up' },
    ]
  },
  {
    id: 2,
    name: '第二道防线',
    description: '战略与财务风险管理',
    icon: <Shield className="w-8 h-8" />,
    status: 'warning',
    metrics: [
      { label: '供应商风险评分', value: '72分', trend: 'down' },
      { label: '供应商集中度', value: '15%', trend: 'stable' },
      { label: '合规性评分', value: '88分', trend: 'up' },
      { label: '现金周转周期', value: '45天', trend: 'stable' },
    ]
  },
  {
    id: 3,
    name: '第三道防线',
    description: '企业风险管理与韧性',
    icon: <Shield className="w-8 h-8" />,
    status: 'good',
    metrics: [
      { label: 'MTTR恢复时间', value: '4.2h', trend: 'up' },
      { label: '供应链韧性指数', value: '85分', trend: 'up' },
      { label: 'BCP测试覆盖率', value: '92%', trend: 'stable' },
      { label: '网络安全等级', value: 'A级', trend: 'stable' },
    ]
  },
];

const mockISCCteps: ISCStep[] = [
  {
    id: 'plan',
    name: '计划 (Plan)',
    status: 'good',
    metrics: [
      { label: '预测准确率', value: '87%' },
      { label: 'S&OP达成率', value: '95%' },
    ],
    link: '/demand-forecast',
    color: 'blue'
  },
  {
    id: 'source',
    name: '采购 (Source)',
    status: 'good',
    metrics: [
      { label: '供应商交货准时率', value: '94%' },
      { label: '采购价格变动', value: '-2.1%' },
    ],
    link: '/mdm-supplier',
    color: 'green'
  },
  {
    id: 'make',
    name: '生产 (Make)',
    status: 'warning',
    metrics: [
      { label: '生产计划达成率', value: '89%' },
      { label: '质量合格率', value: '98.2%' },
    ],
    link: '/production',
    color: 'orange'
  },
  {
    id: 'deliver',
    name: '交付 (Deliver)',
    status: 'good',
    metrics: [
      { label: '订单OTD', value: '96.5%' },
      { label: '运输成本', value: '¥125万' },
    ],
    link: '/shipment',
    color: 'purple'
  },
  {
    id: 'return',
    name: '退货 (Return)',
    status: 'good',
    metrics: [
      { label: '退货率', value: '1.2%' },
      { label: '处理时长', value: '2.1天' },
    ],
    link: '/rma',
    color: 'red'
  },
  {
    id: 'enable',
    name: '赋能 (Enable)',
    status: 'good',
    metrics: [
      { label: '系统可用率', value: '99.9%' },
      { label: '数据完整率', value: '98%' },
    ],
    link: '/data-lineage',
    color: 'cyan'
  },
];

const statusColors = {
  good: 'text-green-500 bg-green-50',
  warning: 'text-yellow-500 bg-yellow-50',
  critical: 'text-red-500 bg-red-50',
};

const statusBgColors = {
  good: 'bg-green-500',
  warning: 'bg-yellow-500',
  critical: 'bg-red-500',
};

export default function ControlTower() {
  const [activeTab, setActiveTab] = useState<'overview' | 'defense' | 'isc'>('overview');

  const getStatusIcon = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-7 h-7 text-blue-600" />
          供应链控制塔
        </h1>
        <p className="text-gray-500 mt-1">端到端供应链可视化监控与决策平台</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'overview', label: '总览' },
          { key: 'defense', label: '三道防线' },
          { key: 'isc', label: 'ISC流程' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 快速状态卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">供应链健康度</p>
                  <p className="text-2xl font-bold text-green-600">92.5</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">待处理预警</p>
                  <p className="text-2xl font-bold text-yellow-600">8</p>
                </div>
                <AlertTriangle className="w-10 h-10 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">本月OTD</p>
                  <p className="text-2xl font-bold text-blue-600">96.8%</p>
                </div>
                <Truck className="w-10 h-10 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">库存周转率</p>
                  <p className="text-2xl font-bold text-purple-600">8.5次</p>
                </div>
                <TrendingUp className="w-10 h-10 text-purple-500" />
              </div>
            </div>
          </div>

          {/* 三道防线预览 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">供应链三道防线</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockDefenseLines.map((line) => (
                <div
                  key={line.id}
                  className={`p-4 rounded-lg border-2 ${line.status === 'good' ? 'border-green-200 bg-green-50' : line.status === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {line.icon}
                      <span className="font-medium">{line.name}</span>
                    </div>
                    {getStatusIcon(line.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{line.description}</p>
                  <div className="space-y-1">
                    {line.metrics.slice(0, 2).map((m, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-500">{m.label}</span>
                        <span className="font-medium">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ISC流程预览 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">ISC供应链流程</h2>
            <div className="flex flex-wrap gap-3">
              {mockISCCteps.map((step) => (
                <div
                  key={step.id}
                  className={`px-4 py-3 rounded-lg border-l-4 bg-gray-50 ${step.status === 'good' ? 'border-green-500' : step.status === 'warning' ? 'border-yellow-500' : 'border-red-500'}`}
                >
                  <div className="flex items-center gap-2">
                    {getStatusIcon(step.status)}
                    <span className="font-medium">{step.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 三道防线详情 Tab */}
      {activeTab === 'defense' && (
        <div className="space-y-6">
          {mockDefenseLines.map((line) => (
            <div
              key={line.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${statusColors[line.status]}`}>
                    {line.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{line.name}</h3>
                    <p className="text-sm text-gray-500">{line.description}</p>
                  </div>
                </div>
                {getStatusIcon(line.status)}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {line.metrics.map((metric, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">{metric.label}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xl font-bold">{metric.value}</span>
                      {metric.trend && (
                        <span className={`text-xs ${
                          metric.trend === 'up' ? 'text-green-500' : 
                          metric.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                        }`}>
                          {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ISC流程详情 Tab */}
      {activeTab === 'isc' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockISCCteps.map((step) => (
            <div
              key={step.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${statusBgColors[step.status]}`} />
                  <span className="font-semibold">{step.name}</span>
                </div>
                {getStatusIcon(step.status)}
              </div>
              
              <div className="space-y-2 mb-4">
                {step.metrics.map((m, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-500">{m.label}</span>
                    <span className="font-medium">{m.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center text-blue-600 text-sm hover:underline">
                <span>查看详情</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
