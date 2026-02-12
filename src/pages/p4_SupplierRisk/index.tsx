// Page 4: 供应商风险全景
import React, { useState } from 'react';
import {
  AlertTriangle, Globe, Factory, Truck,
  ChevronRight, Search, Bell
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { SUPPLIERS, SALES_ORDERS, MATERIALS } from '../../data/mock.data';

const RadarChart: React.FC<{ data: typeof SUPPLIERS[0].radar }> = ({ data }) => {
  const option = {
    polar: { radius: ['30%', '70%'] },
    angleAxis: {
      type: 'category',
      data: ['财务健康', '交付可靠', '质量稳定', '地缘政治', '集中度', '合规'],
      axisLabel: { color: '#7A8BA8' }
    },
    radiusAxis: { show: false },
    series: [{
      type: 'radar',
      data: [{ value: [data.financial, data.delivery, data.quality, data.geopolitical, data.concentration, data.compliance] }],
      areaStyle: { color: 'rgba(229, 57, 53, 0.2)' },
      lineStyle: { color: '#E53935', width: 2 },
      itemStyle: { color: '#E53935' }
    }]
  };
  
  return <ReactECharts option={option} style={{ height: 220 }} />;
};

const RiskChain: React.FC<{ supplier: typeof SUPPLIERS[0] }> = ({ supplier }) => {
  const orders = SALES_ORDERS.filter(o => 
    supplier.secondaryRisk?.some(s => o.customer.includes(s))
  );
  
  return (
    <div className="card p-4">
      <h3 className="text-sm font-medium text-danger mb-3 flex items-center">
        <AlertTriangle className="w-4 h-4 mr-2" />
        风险传导链路
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <div className="px-3 py-2 bg-danger-bg border border-danger rounded text-sm text-danger flex-1">
            {supplier.name}
          </div>
          <ChevronRight className="mx-2 text-muted" />
          <div className="px-3 py-2 bg-warning-bg border border-warning rounded text-sm text-warning flex-1">
            {supplier.keyMaterials?.[0]}
          </div>
        </div>
        
        {orders.slice(0, 2).map((order, i) => (
          <div key={order.id} className="flex items-center ml-6">
            <ChevronRight className="mr-2 text-muted w-4 h-4" />
            <div className="flex-1 px-3 py-2 border border-warning rounded text-sm">
              <span className="text-warning">MO-{order.id.replace('SO', '2026-')}</span>
              <span className="ml-2 text-secondary">{order.material}</span>
              <span className="ml-2 text-muted">({order.qty?.toLocaleString()}件)</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-card rounded border border-warning">
        <p className="text-xs text-warning mb-2">⚠️ 隐性风险发现</p>
        <p className="text-sm text-secondary">
          以下2家国内供应商的关键零件同样依赖 Bühler 的传动组件：
        </p>
        <div className="mt-2 space-y-1">
          {supplier.alternativeSuppliers?.map(name => (
            <p key={name} className="text-xs text-muted">· {name}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

const OTDTrend: React.FC<{ trend: number[] }> = ({ trend }) => {
  const option = {
    grid: { top: 20, right: 20, bottom: 30, left: 50 },
    xAxis: {
      type: 'category',
      data: ['5月', '6月', '7月', '8月', '9月', '10月'],
      axisLabel: { color: '#7A8BA8' }
    },
    yAxis: {
      type: 'value',
      min: 0.5, max: 1,
      axisLabel: { color: '#7A8BA8' },
      splitLine: { lineStyle: { color: '#1E2D45', type: 'dashed' } }
    },
    series: [{
      data: trend,
      type: 'line',
      smooth: true,
      lineStyle: { color: '#E53935', width: 2 },
      itemStyle: { color: '#E53935' },
      areaStyle: { color: 'rgba(229, 57, 53, 0.1) }
    }]
  };
  
  return <ReactECharts option={option} style={{ height: 120 }} />;
};

const SupplierRisk: React.FC = () => {
  const supplier = SUPPLIERS[0];
  
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display text-primary">供应商风险全景</h1>
          <p className="text-sm text-secondary">供应链风险可视化监控</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              placeholder="搜索供应商" 
              className="pl-10 pr-4 py-2 bg-card border border-border rounded text-sm text-primary"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <h3 className="text-sm font-medium text-secondary mb-3">供应商列表</h3>
          <div className="space-y-2">
            {SUPPLIERS.map(s => (
              <div 
                key={s.id}
                className={`p-3 rounded cursor-pointer border ${
                  s.id === supplier.id 
                    ? 'bg-card border-accent' 
                    : 'border-transparent hover:bg-card-hover'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-primary">{s.flag} {s.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    s.riskScore < 50 ? 'bg-danger-bg text-danger' :
                    s.riskScore < 70 ? 'bg-warning-bg text-warning' :
                    'bg-success-bg text-success'
                  }`}>
                    {s.riskScore}
                  </span>
                </div>
                <p className="text-xs text-muted">{s.category}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="col-span-5">
          <div className="card p-4 mb-4">
            <div className="flex items-center mb-4">
              <span className="text-lg">{supplier.flag}</span>
              <div className="flex-1 ml-2">
                <h2 className="text-lg font-medium text-primary">{supplier.name}</h2>
                <p className="text-xs text-secondary">{supplier.category}</p>
              </div>
              <span className="text-sm text-danger font-bold">{supplier.riskScore}/100</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <RadarChart data={supplier.radar} />
              <div>
                <OTDTrend trend={supplier.otdTrend} />
                <p className="text-xs text-muted mt-2">近6个月OTD趋势</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {supplier.riskFactors?.map((factor, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-danger">·</span>
                  <span className="text-secondary">{factor}</span>
                </div>
              ))}
            </div>
          </div>
          
          <RiskChain supplier={supplier} />
        </div>
        
        <div className="col-span-4">
          <div className="card p-4">
            <h3 className="text-sm font-medium text-secondary mb-3">未来30天关键节点</h3>
            <div className="space-y-3">
              {[
                { date: '10月15日', event: 'Bühler确认最新交期' },
                { date: '10月20日', event: '替代供应商认证截止' },
                { date: '10月25日', event: 'IKEA确认提前发货' },
                { date: '11月1日', event: '圣诞订单首批交付' }
              ].map((node, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-20 text-xs text-muted">{node.date}</div>
                  <div className="flex-1 p-2 bg-card rounded text-sm text-secondary">{node.event}</div>
                  {i < 3 && <div className="w-4 h-4 rounded-full bg-accent" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierRisk;
