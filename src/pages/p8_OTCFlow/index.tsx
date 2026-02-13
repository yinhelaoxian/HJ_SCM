import React, { useState } from 'react';
import { GitBranch, CheckCircle, Clock, AlertTriangle, FileText, Package, Truck, DollarSign, ChevronRight } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { OTC_FLOW, SALES_ORDERS } from '../../data/mock.data';

const OTCFlow = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  
  const nodeIcons: Record<string, any> = {
    contract: { icon: FileText, color: '#00897B' },
    order: { icon: FileText, color: '#00897B' },
    plan: { icon: Clock, color: '#2D7DD2' },
    make: { icon: Package, color: '#E53935' },
    quality: { icon: CheckCircle, color: '#7A8BA8' },
    deliver: { icon: Truck, color: '#7A8BA8' },
    receipt: { icon: Package, color: '#7A8BA8' },
    payment: { icon: DollarSign, color: '#7A8BA8' }
  };
  
  const nodeBg: Record<string, string> = {
    completed: 'rgba(0,137,123,0.08)',
    inProgress: 'rgba(45,125,210,0.08)',
    atRisk: 'rgba(229,57,53,0.08)',
    pending: 'rgba(68,85,104,0.08)'
  };
  
  const totalDays = OTC_FLOW.nodes.reduce((sum, n) => sum + (n.delay || 0), 0);
  
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-2xl font-display flex items-center gap-2" style={{ color: '#E8EDF4' }}>
            <GitBranch className="w-6 h-6" style={{ color: '#2D7DD2' }} />
            订单全链路追踪
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>
            SO-{OTC_FLOW.soId} · {OTC_FLOW.customer} · ¥{OTC_FLOW.amount}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs" style={{ color: '#7A8BA8' }}>原定交期</p>
            <p className="text-lg font-display" style={{ color: '#7A8BA8' }}>{OTC_FLOW.originalDate}</p>
          </div>
          <ChevronRight className="w-5 h-5" style={{ color: '#1E2D45' }} />
          <div className="text-right">
            <p className="text-xs" style={{ color: '#E53935' }}>客户要求</p>
            <p className="text-lg font-display" style={{ color: '#E53935' }}>{OTC_FLOW.requestedDate}</p>
          </div>
          {totalDays > 0 && (
            <div className="px-3 py-1.5 rounded" style={{ background: 'rgba(229,57,53,0.1)' }}>
              <span className="text-sm font-bold" style={{ color: '#E53935' }}>延误 {totalDays}天</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 320px' }}>
        {/* 左侧：端到端流程甘特图 */}
        <div className="card p-4">
          <h3 className="text-sm font-medium mb-4" style={{ color: '#E8EDF4' }}>订单履行全流程</h3>
          
          <div className="relative">
            {/* 流程线 */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5" style={{ background: 'linear-gradient(180deg, #00897B, #2D7DD2, #E53935, #7A8BA8)' }} />
            
            <div className="space-y-4">
              {OTC_FLOW.nodes.map((node, i) => {
                const Icon = nodeIcons[node.id]?.icon || Clock;
                const color = nodeIcons[node.id]?.color || '#7A8BA8';
                const isLast = i === OTC_FLOW.nodes.length - 1;
                
                return (
                  <div key={node.id} className="relative flex items-start group">
                    {/* 时间轴左侧 */}
                    <div className="w-12 pt-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        node.status === 'completed' ? '' : ''
                      }`}
                        style={{ 
                          background: nodeBg[node.status],
                          border: `2px solid ${color}`
                        }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                    </div>
                    
                    {/* 内容 */}
                    <div className="flex-1 ml-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{node.label}</span>
                        {node.status === 'completed' && <CheckCircle className="w-4 h-4" style={{ color: '#00897B' }} />}
                        {node.status === 'atRisk' && <AlertTriangle className="w-4 h-4" style={{ color: '#E53935' }} />}
                        {node.status === 'inProgress' && (
                          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#2D7DD2' }} />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs" style={{ color: '#7A8BA8' }}>
                        <span>计划: {node.planDate}</span>
                        {node.actualDate && (
                          <span style={{ color: node.delay > 0 ? '#E53935' : '#00897B' }}>
                            实际: {node.actualDate} {node.delay > 0 && `(+${node.delay}天)`}
                          </span>
                        )}
                        {node.owner && <span>负责人: {node.owner}</span>}
                      </div>
                      
                      {node.riskNote && (
                        <div className="mt-2 p-2 rounded text-xs" 
                          style={{ background: 'rgba(229,57,53,0.06)', border: '1px solid #E53935' }}>
                          <span style={{ color: '#E53935' }}>⚠️ {node.riskNote}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* 详情按钮 */}
                    <button 
                      onClick={() => setSelectedNode(node)}
                      className="opacity-0 group-hover:opacity-100 px-3 py-1 rounded text-xs transition-all"
                      style={{ background: 'rgba(45,125,210,0.1)', color: '#2D7DD2', border: '1px solid rgba(45,125,210,0.3)' }}>
                      查看详情
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* 右侧：详情抽屉 + 关联单据 */}
        <div className="space-y-4">
          {selectedNode ? (
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{selectedNode.label} - 详情</h3>
                <button onClick={() => setSelectedNode(null)} className="text-xs" style={{ color: '#445568' }}>✕</button>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#7A8BA8' }}>状态</span>
                  <span className="px-2 py-0.5 rounded text-xs" 
                    style={{ 
                      background: nodeBg[selectedNode.status],
                      color: nodeIcons[selectedNode.id]?.color 
                    }}>
                    {selectedNode.status === 'completed' ? '已完成' : 
                     selectedNode.status === 'inProgress' ? '进行中' :
                     selectedNode.status === 'atRisk' ? '有风险' : '待开始'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#7A8BA8' }}>计划时间</span>
                  <span style={{ color: '#E8EDF4' }}>{selectedNode.planDate}</span>
                </div>
                {selectedNode.actualDate && (
                  <div className="flex justify-between">
                    <span style={{ color: '#7A8BA8' }}>实际时间</span>
                    <span style={{ color: selectedNode.delay > 0 ? '#E53935' : '#E8EDF4' }}>
                      {selectedNode.actualDate} {selectedNode.delay > 0 && `(+${selectedNode.delay}天)`}
                    </span>
                  </div>
                )}
                {selectedNode.owner && (
                  <div className="flex justify-between">
                    <span style={{ color: '#7A8BA8' }}>负责人</span>
                    <span style={{ color: '#E8EDF4' }}>{selectedNode.owner}</span>
                  </div>
                )}
              </div>
              
              {selectedNode.id === 'make' && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: '#1E2D45' }}>
                  <h4 className="text-xs font-medium mb-2" style={{ color: '#7A8BA8' }}>关联单据</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded" style={{ background: '#0B0F17' }}>
                      <Package className="w-4 h-4" style={{ color: '#2D7DD2' }} />
                      <span className="text-xs" style={{ color: '#E8EDF4' }}>MO-2026-1847（工单）</span>
                      <span className="text-xs ml-auto" style={{ color: '#F57C00' }}>待启动</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded" style={{ background: '#0B0F17' }}>
                      <Package className="w-4 h-4" style={{ color: '#2D7DD2' }} />
                      <span className="text-xs" style={{ color: '#E8EDF4' }}>MO-2026-1851（工单）</span>
                      <span className="text-xs ml-auto" style={{ color: '#F57C00' }}>待启动</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-4" style={{ background: '#0B0F17' }}>
              <p className="text-sm text-center" style={{ color: '#445568' }}>
                点击流程节点查看详情
              </p>
            </div>
          )}
          
          {/* 关联单据网络 */}
          <div className="card p-4">
            <h3 className="text-sm font-medium mb-3" style={{ color: '#E8EDF4' }}>关联单据网络</h3>
            
            <div className="p-3 rounded mb-3" style={{ background: '#0B0F17' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs" 
                  style={{ background: '#2D7DD2', color: '#fff' }}>SO</span>
                <span className="text-sm font-medium" style={{ color: '#E8EDF4' }}>{OTC_FLOW.soId}</span>
              </div>
              
              <div className="ml-6 space-y-2 text-xs border-l-2 pl-3" style={{ borderColor: '#1E2D45' }}>
                {Object.entries(OTC_FLOW.relatedDocs).map(([type, docs]) => (
                  <div key={type}>
                    <div className="flex items-center gap-1 mb-1" style={{ color: '#7A8BA8' }}>
                      <ChevronRight className="w-3 h-3" />
                      {type === 'mo' ? '生产工单' : type === 'po' ? '采购订单' : type === 'pr' ? '采购申请' : '送货单'}
                    </div>
                    <div className="ml-3 space-y-1">
                      {docs.map((doc, di) => (
                        <div key={di} className="flex items-center gap-2 p-1.5 rounded" 
                          style={{ background: '#131926' }}>
                          <span className="text-xs" style={{ color: '#E8EDF4' }}>{doc}</span>
                          {doc.includes('待') ? (
                            <span className="text-xs px-1.5 py-0.5 rounded" 
                              style={{ background: 'rgba(245,124,0,0.1)', color: '#F57C00' }}>待创建</span>
                          ) : (
                            <span className="text-xs px-1.5 py-0.5 rounded" 
                              style={{ background: 'rgba(229,57,53,0.1)', color: '#E53935' }}>⚠️有风险</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTCFlow;
