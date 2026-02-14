import React, { useState, useEffect } from 'react';
import {
  Shield, AlertTriangle, CheckCircle, Clock,
  TrendingUp, Database, RefreshCw
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

/**
 * 数据质量监控仪表盘
 */
export default function DataQualityDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  
  const mockData = {
    overall: { score: 87, trend: '+2.3%' },
    checks: { total: 1560, passed: 1358, failed: 202 },
    issues: [
      { type: '完整性', count: 45, critical: 3 },
      { type: '一致性', count: 28, critical: 1 },
      { type: '准确性', count: 15, critical: 0 }
    ],
    trends: [
      { date: '02-10', score: 82 },
      { date: '02-11', score: 84 },
      { date: '02-12', score: 85 },
      { date: '02-13', score: 87 },
      { date: '02-14', score: 87 }
    ]
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-white">数据质量监控</h1>
      
      {/* 质量评分 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
          <Shield className="w-8 h-8 text-green-400 mb-4"/>
          <p className="text-gray-400 text-sm">质量评分</p>
          <p className="text-4xl font-bold text-white">{mockData.overall.score}</p>
          <p className="text-green-400 text-sm">较上周{mockData.overall.trend}</p>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
          <CheckCircle className="w-8 h-8 text-blue-400 mb-4"/>
          <p className="text-gray-400 text-sm">检查项</p>
          <p className="text-3xl font-bold text-white">{mockData.checks.total}</p>
          <p className="text-gray-400 text-sm">通过{mockData.checks.passed}</p>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30">
          <AlertTriangle className="w-8 h-8 text-amber-400 mb-4"/>
          <p className="text-gray-400 text-sm">异常项</p>
          <p className="text-3xl font-bold text-white">{mockData.checks.failed}</p>
          <p className="text-red-400 text-sm">3紧急</p>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
          <Database className="w-8 h-8 text-purple-400 mb-4"/>
          <p className="text-gray-400 text-sm">检查项/日</p>
          <p className="text-3xl font-bold text-white">156</p>
          <p className="text-gray-400 text-sm">实时监控中</p>
        </Card>
      </div>
      
      {/* 异常分布 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">异常分布</h3>
        <div className="grid grid-cols-3 gap-4">
          {mockData.issues.map((item, i) => (
            <div key={i} className="p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-400 text-sm mb-2">{item.type}</p>
              <p className="text-2xl font-bold text-white">{item.count}</p>
              <p className="text-red-400 text-sm">{item.critical}紧急</p>
            </div>
          ))}
        </div>
      </Card>
      
      {/* 质量趋势 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">质量趋势</h3>
        <div className="h-32 flex items-end gap-2">
          {mockData.trends.map((t, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                style={{ height: `${t.score}%` }}
              />
              <p className="text-xs text-gray-400 mt-2">{t.date}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
