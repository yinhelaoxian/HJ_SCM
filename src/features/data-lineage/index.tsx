import React, { useState } from 'react';

/**
 * 数据血缘可视化
 */
export default function DataLineageViewer() {
  const [selectedNode, setSelectedNode] = useState(null);
  
  // 模拟血缘数据
  const nodes = [
    { id: 'demand-forecast', label: '需求预测', type: 'source' },
    { id: 'sop', label: 'S&OP平衡', type: 'process' },
    { id: 'mps', label: 'MPS计划', type: 'process' },
    { id: 'mrp', label: 'MRP运算', type: 'process' },
    { id: 'purchase', label: '采购订单', type: 'output' },
    { id: 'production', label: '生产工单', type: 'output' }
  ];

  const edges = [
    { source: 'demand-forecast', target: 'sop' },
    { source: 'sop', target: 'mps' },
    { source: 'mps', target: 'mrp' },
    { source: 'mrp', source: 'purchase', target: 'purchase' },
    { source: 'mrp', target: 'production' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">数据血缘</h1>
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-gray-400">节点: {nodes.length} | 边: {edges.length}</p>
        <p className="text-gray-500 text-sm">血缘可视化进行中...</p>
      </div>
    </div>
  );
}
