import React, { useState } from 'react';
import { Calendar, Lock, AlertTriangle, Edit, Check, History, ChevronRight } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { MPS_DATA } from '../../data/mock.data';

const MPS = () => {
  const [selectedCell, setSelectedCell] = useState(null);
  
  const zoneColors = {
    frozen: { bg: 'rgba(229,57,53,0.06)', border: '#E53935', label: '🔒 冻结区', desc: '禁止变更' },
    slushy: { bg: 'rgba(245,124,0,0.06)', border: '#F57C00', label: '⚠️ 泥泞区', desc: '需审批变更' },
    liquid: { bg: 'rgba(45,125,210,0.04)', border: '#2D7DD2', label: '✏️ 自由区', desc: '可自由规划' }
  };
  
  const getZone = (weekIdx) => {
    if (weekIdx < MPS_DATA.fenceConfig.frozen) return 'frozen';
    if (weekIdx < MPS_DATA.fenceConfig.frozen + MPS_DATA.fenceConfig.slushy) return 'slushy';
    return 'liquid';
  };
  
  const scheduleMatrix = MPS_DATA.schedule.reduce((acc, row) => {
    if (!acc[row.week]) acc[row.week] = [];
    acc[row.week].push(row);
    return acc;
  }, {});
  
  const zoneBar = (
    <div className="flex mb-2 text-xs">
      {MPS_DATA.weeks.map((week, i) => {
        const zone = getZone(i);
        return (
          <div key={i} className="flex-1 text-center py-1" style={{ 
            background: zoneColors[zone].bg,
            borderBottom: `2px solid ${zoneColors[zone].border}`,
            color: zone === 'frozen' ? '#E53935' : zone === 'slushy' ? '#F57C00' : '#2D7DD2'
          }}>
            {zone === 'frozen' ? '🔒' : zone === 'slushy' ? '⚠️' : '✏️'}
          </div>
        );
      })}
    </div>
  );
  
  const weekHeaders = (
    <div className="flex mb-1">
      <div className="w-24 shrink-0 text-xs py-1" style={{ color: '#445568' }}>产品/产线</div>
      <div className="flex-1 flex">
        {MPS_DATA.weeks.map((w, i) => (
          <div key={i} className="flex-1 text-center text-xs py-1" 
            style={{ 
              background: zoneColors[getZone(i)].bg,
              color: getZone(i) === 'frozen' ? '#E53935' : '#7A8BA8'
            }}>
            {w}
          </div>
        ))}
      </div>
    </div>
  );
  
  const products = [
    { name: 'HJ-LA23 (青岛A线)', color: '#2D7DD2' },
    { name: 'HJ-LA15 (青岛B线)', color: '#00897B' },
    { name: 'HJ-LA23 (泰国)', color: '#F57C00' }
  ];
  
  const rollingHistory = MPS_DATA.rollingHistory.map((h, i) => (
    <div key={i} className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#1E2D45' }}>
      <div className="flex items-center gap-2">
        <History className="w-4 h-4" style={{ color: '#445568' }} />
        <span className="text-sm" style={{ color: '#E8EDF4' }}>{h.date}</span>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(45,125,210,0.1)', color: '#2D7DD2' }}>{h.type}</span>
      </div>
      <span className="text-xs" style={{ color: '#7A8BA8' }}>变更{h.changes}项 · {h.approvedBy}</span>
    </div>
  ));
  
  return (
    <div className="page-enter">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>MPS 主生产计划工作台</h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A8BA8' }}>战术层 · 三区管理 · 第40-55周</p>
        </div>
        <div className="flex gap-2">
          {Object.entries(zoneColors).map(([zone, config]) => (
            <div key={zone} className="flex items-center gap-2 px-3 py-1.5 rounded text-xs"
              style={{ background: config.bg, border: `1px solid ${config.border}` }}>
              <span>{config.label}</span>
              <span style={{ color: '#7A8BA8' }}>{config.desc}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 280px' }}>
        {/* 左侧：排产矩阵 */}
        <div>
          <div className="card p-4 overflow-x-auto">
            <h3 className="text-sm font-medium mb-3" style={{ color: '#E8EDF4' }}>产品排产矩阵</h3>
            {zoneBar}
            {weekHeaders}
            
            <div className="space-y-1">
              {products.map((prod, pi) => (
                <div key={pi} className="flex">
                  <div className="w-24 shrink-0 text-xs py-2 flex items-center gap-1" 
                    style={{ color: prod.color, background: '#0B0F17' }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: prod.color }} />
                    {prod.name}
                  </div>
                  <div className="flex-1 flex">
                    {MPS_DATA.weeks.map((w, wi) => {
                      const cellData = scheduleMatrix[w]?.find(s => s.product.includes(prod.name.split(' ')[0]));
                      const zone = getZone(wi);
                      const isRisk = cellData?.status === 'at_risk';
                      const isAI = cellData?.status === 'ai_suggest';
                      
                      return (
                        <div key={wi} 
                          className="flex-1 h-10 border-r cursor-pointer relative transition-all hover:opacity-80"
                          style={{ 
                            background: zoneColors[zone].bg,
                            borderColor: isRisk ? '#E53935' : isAI ? '#F57C00' : zoneColors[zone].border
                          }}
                          onClick={() => cellData && setSelectedCell(cellData)}
                        >
                          {cellData && (
                            <>
                              {cellData.qty > 0 ? (
                                <div className="w-full h-full flex items-center justify-center text-xs font-medium"
                                  style={{ color: prod.color }}>
                                  {cellData.qty.toLocaleString()}
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-lg" style={{ color: isRisk ? '#E53935' : '#445568' }}>
                                    {isRisk ? '🔴' : '—'}
                                  </span>
                                </div>
                              )}
                              {isAI && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center"
                                  style={{ background: '#F57C00' }}>
                                  <span className="text-[8px]">⚡</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-3 flex gap-4 text-xs" style={{ color: '#7A8BA8' }}>
              <span>🔴 = 停产/断供</span>
              <span>⚡ = AI建议调整</span>
              <span>空白 = 无排产</span>
            </div>
          </div>
          
          {/* 本周重点说明 */}
          <div className="mt-4 p-4 rounded" style={{ background: 'rgba(229,57,53,0.06)', border: '1px solid #E53935' }}>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" style={{ color: '#E53935' }} />
              <div>
                <h4 className="text-sm font-medium mb-1" style={{ color: '#E53935' }}>⚠️ 本周重点风险</h4>
                <p className="text-sm" style={{ color: '#7A8BA8' }}>
                  W43-W45期间青岛工厂HJ-LA23因Bühler断供停产，AI建议泰国工厂转产支援，
                  可弥补60%缺口。需要在<strong>10月12日前</strong>确认排产调整方案。
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 右侧：变更分析 + 历史 */}
        <div className="space-y-4">
          {selectedCell ? (
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium" style={{ color: '#E8EDF4' }}>变更影响分析</h3>
                <button onClick={() => setSelectedCell(null)} className="text-xs" style={{ color: '#445568' }}>✕</button>
              </div>
              
              <div className="p-3 rounded mb-3" style={{ background: '#0B0F17' }}>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: '#7A8BA8' }}>{selectedCell.week}</span>
                  <span style={{ color: '#E8EDF4' }}>{selectedCell.product}</span>
                </div>
                <div className="text-2xl font-display" style={{ color: '#2D7DD2' }}>
                  {selectedCell.qty.toLocaleString()} 件
                </div>
                <div className="text-xs mt-1" style={{ color: '#445568' }}>{selectedCell.plant}</div>
              </div>
              
              {selectedCell.zone === 'frozen' && (
                <div className="p-3 rounded border" style={{ background: 'rgba(229,57,53,0.06)', borderColor: '#E53935' }}>
                  <p className="text-xs" style={{ color: '#E53935' }}>🔒 此周次已冻结</p>
                  <p className="text-xs mt-1" style={{ color: '#7A8BA8' }}>变更需要COO王志远审批</p>
                </div>
              )}
              
              {selectedCell.zone === 'slushy' && (
                <>
                  <h4 className="text-xs font-medium mt-3 mb-2" style={{ color: '#7A8BA8' }}>影响分析</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: '#445568' }}>影响PO</span>
                      <span style={{ color: '#7A8BA8' }}>2个需要调整</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#445568' }}>影响物料</span>
                      <span style={{ color: '#7A8BA8' }}>DC马达总成·HJ-M05</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#445568' }}>客户订单</span>
                      <span style={{ color: '#E53935' }}>SO-2026-3341有风险</span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 py-1.5 rounded text-xs" style={{ background: '#2D7DD2', color: '#fff' }}>
                      发起变更审批
                    </button>
                    <button className="px-3 py-1.5 rounded text-xs" style={{ border: '1px solid #1E2D45', color: '#7A8BA8' }}>
                      AI建议
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="card p-4" style={{ background: '#0B0F17' }}>
              <p className="text-sm text-center" style={{ color: '#445568' }}>
                点击矩阵中的单元格查看变更影响
              </p>
            </div>
          )}
          
          <div className="card p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#E8EDF4' }}>
              <History className="w-4 h-4" /> 滚动更新记录
            </h3>
            {rollingHistory}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MPS;
