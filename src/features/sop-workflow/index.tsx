import React, { useState, useCallback } from 'react';
import {
  GitBranch, CheckCircle, XCircle, History, Users,
  AlertTriangle, TrendingDown, TrendingUp, Download,
  ChevronRight, Calendar, FileText
} from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';

/**
 * S&OP 需求计划工作流
 *
 * 功能：
 * - 版本管理（创建/对比/回滚）
 * - 需求评审流程
 * - 一致性检查
 * - 审批流
 */
export default function SOPWorkflow() {
  const [activeTab, setActiveTab] = useState('versions');
  const [selectedVersion, setSelectedVersion] = useState('v2026-02');
  const [pendingReview, setPendingReview] = useState(3);

  // 模拟数据
  const versions = [
    {
      id: 'v2026-02',
      name: '2026年2月版本',
      status: 'DRAFT',
      createdAt: '2026-02-10',
      forecastAccuracy: 0.87,
      demandChange: '+12%',
      approvalStatus: 'PENDING',
      reviews: { approved: 5, pending: 2, rejected: 0 }
    },
    {
      id: 'v2026-01',
      name: '2026年1月版本',
      status: 'APPROVED',
      createdAt: '2026-01-10',
      forecastAccuracy: 0.85,
      demandChange: '+8%',
      approvalStatus: 'APPROVED',
      reviews: { approved: 7, pending: 0, rejected: 0 }
    },
    {
      id: 'v2025-12',
      name: '2025年12月版本',
      status: 'APPROVED',
      createdAt: '2025-12-10',
      forecastAccuracy: 0.82,
      demandChange: '+5%',
      approvalStatus: 'APPROVED',
      reviews: { approved: 7, pending: 0, rejected: 0 }
    }
  ];

  const consistencyIssues = [
    { type: 'GAP', message: '销售预测与计划偏差12%', severity: 'HIGH' },
    { type: 'RISK', message: '电机交期延长可能影响Q2交付', severity: 'MEDIUM' },
    { type: 'OPPORTUNITY', message: '建议增加安全库存', severity: 'LOW' }
  ];

  const approvalTasks = [
    { id: 1, version: 'v2026-02', task: '销售预测确认', requester: '张总', date: '2026-02-14' },
    { id: 2, version: 'v2026-02', task: '供应计划确认', requester: '李总', date: '2026-02-14' },
    { id: 3, version: 'v2026-02', task: '财务预算确认', requester: '王总', date: '2026-02-15' }
  ];

  const getVersionStatusBadge = (status) => {
    const config = {
      'DRAFT': { label: '草稿', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
      'REVIEW': { label: '评审中', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      'APPROVED': { label: '已批准', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
      'REJECTED': { label: '已拒绝', className: 'bg-red-500/20 text-red-400 border-red-500/30' }
    };
    return config[status] || config['DRAFT'];
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">S&OP 需求计划</h1>
          <p className="text-gray-400 mt-1">版本管理 · 需求评审 · 一致性检查</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <GitBranch className="w-4 h-4 mr-2" />
            版本对比
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            新建版本
          </Button>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="flex border-b border-gray-700">
        {[
          { key: 'versions', label: '版本管理', icon: History },
          { key: 'review', label: '待审批', icon: CheckCircle, count: pendingReview },
          { key: 'consistency', label: '一致性检查', icon: AlertTriangle },
          { key: 'calendar', label: '日历视图', icon: Calendar }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count && (
              <Badge variant="danger">{tab.count}</Badge>
            )}
          </button>
        ))}
      </div>

      {/* Tab内容 */}
      {activeTab === 'versions' && (
        <div className="space-y-4">
          {/* 版本列表 */}
          {versions.map((version, i) => {
            const statusBadge = getVersionStatusBadge(version.status);
            return (
              <Card
                key={version.id}
                className={`p-4 cursor-pointer transition-all hover:border-blue-500/50 ${
                  selectedVersion === version.id ? 'border-blue-500' : ''
                }`}
                onClick={() => setSelectedVersion(version.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{i + 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{version.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        创建时间: {version.createdAt} · 准确率: {version.forecastAccuracy * 100}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* 评审进度 */}
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {Array.from({length: 7}).map((_, j) => (
                          <div
                            key={j}
                            className={`w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs ${
                              j < version.reviews.approved
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-700 text-gray-400'
                            }`}
                          >
                            {j < version.reviews.approved ? '✓' : '?'}
                          </div>
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">
                        {version.reviews.approved}/7 已审批
                      </span>
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'review' && (
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">待审批任务</h3>
                <p className="text-gray-400 text-sm">您有 {pendingReview} 个待审批任务</p>
              </div>
            </div>
          </Card>

          {approvalTasks.map(task => (
            <Card key={task.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-blue-400">{task.version}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-white">{task.task}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    申请人: {task.requester} · {task.date}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <XCircle className="w-4 h-4 mr-1" />
                    拒绝
                  </Button>
                  <Button size="sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    批准
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'consistency' && (
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">S&OP 一致性检查</h3>
            
            {/* 一致性指标 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">+12%</p>
                <p className="text-gray-400 text-sm">销售预测增长</p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <TrendingDown className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">+8%</p>
                <p className="text-gray-400 text-sm">计划响应增长</p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">2个</p>
                <p className="text-gray-400 text-sm">待解决风险</p>
              </div>
            </div>

            {/* 待处理问题 */}
            <h4 className="text-white font-medium mb-3">待处理问题</h4>
            <div className="space-y-3">
              {consistencyIssues.map((issue, i) => {
                const severityColors = {
                  'HIGH': 'border-red-500/50 bg-red-500/10',
                  'MEDIUM': 'border-amber-500/50 bg-amber-500/10',
                  'LOW': 'border-blue-500/50 bg-blue-500/10'
                };
                return (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border ${severityColors[issue.severity]}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`w-5 h-5 ${
                          issue.severity === 'HIGH' ? 'text-red-400' :
                          issue.severity === 'MEDIUM' ? 'text-amber-400' : 'text-blue-400'
                        }`} />
                        <div>
                          <p className="text-white">{issue.message}</p>
                          <p className="text-gray-500 text-xs mt-1">类型: {issue.type}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        处理
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'calendar' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">S&OP 日历</h3>
          <div className="grid grid-cols-7 gap-2">
            {['一', '二', '三', '四', '五', '六', '日'].map((day, i) => (
              <div key={i} className="text-center text-gray-400 text-sm py-2">{day}</div>
            ))}
            {Array.from({length: 31}).map((_, i) => {
              const day = i + 1;
              const isToday = day === 14;
              const hasEvent = [14, 15, 20, 28].includes(day);
              return (
                <div
                  key={i}
                  className={`p-2 text-center rounded-lg cursor-pointer ${
                    hasEvent
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'hover:bg-gray-800 text-gray-300'
                  } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                >
                  {day}
                  {hasEvent && <div className="w-1 h-1 bg-blue-400 rounded-full mx-auto mt-1" />}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
