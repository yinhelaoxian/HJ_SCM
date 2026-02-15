import React, { useState, useEffect } from 'react';
import { 
  GitCommit, GitPullRequest, CheckCircle, Clock, 
  Server, Database, Container, AlertCircle 
} from 'lucide-react';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

// Git 提交数据
const getGitCommits = () => [
  { sha: '65daceb', msg: 'chore: 添加项目状态管理工具', time: '23:47' },
  { sha: '0a1f87e', msg: 'docs: 添加中间件清单文档', time: '23:27' },
  { sha: '629bd67', msg: 'docs: 更新Sprint Backlog', time: '23:18' },
  { sha: '9afed97', msg: 'docs: API文档和MVP发布说明', time: '23:11' },
  { sha: 'f7d6c26', msg: 'feat: Sprint 7-9功能代码', time: '16:30' },
];

// Sprint 进度数据
const sprints = [
  { id: 'Sprint 6', name: 'MRP引擎核心', progress: 100, color: '#00897B' },
  { id: 'Sprint 7', name: '库存模块', progress: 100, color: '#00897B' },
  { id: 'Sprint 8', name: '生产执行', progress: 100, color: '#00897B' },
  { id: 'S9', name: '测试发布', progress: 75, color: '#F57C00' },
];

// 测试数据
const tests = [
  { name: '单元测试', written: 17, run: 0, pass: 0 },
  { name: '集成测试', written: 5, run: 0, pass: 0 },
  { name: '性能测试', written: 0, run: 0, pass: 0 },
];

// 文档数据
const docs = [
  { name: '技术规范', count: 12, done: 12 },
  { name: '测试文档', count: 3, done: 3 },
  { name: '部署文档', count: 5, done: 5 },
];

// 部署数据
const deploys = [
  { env: '本地开发', status: 'running', url: 'http://localhost:3000' },
  { env: 'Docker Dev', status: 'configured', url: '-' },
  { env: 'Docker Prod', status: 'pending', url: '-' },
  { env: 'K8s', status: 'pending', url: '-' },
];

export default function ProjectMonitor() {
  const [commits] = useState(getGitCommits());
  const [now] = useState(new Date());
  
  const totalDocs = docs.reduce((a, b) => a + b.count, 0);
  const doneDocs = docs.reduce((a, b) => a + b.done, 0);
  const totalTests = tests.reduce((a, b) => a + b.written, 0);
  const runTests = tests.reduce((a, b) => a + b.run, 0);
  
  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display" style={{ color: '#E8EDF4' }}>
          项目监测中心
        </h1>
        <Button onClick={() => window.location.reload()}>
          刷新
        </Button>
      </div>
      
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {/* Git 提交卡片 */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#7A8BA8' }}>
            <GitCommit className="w-4 h-4" />
            Git 提交
          </h3>
          <div className="space-y-2">
            {commits.slice(0, 4).map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono" style={{ color: '#2D7DD2' }}>{c.sha}</span>
                  <span style={{ color: '#7A8BA8' }}>{c.msg}</span>
                </div>
                <span style={{ color: '#445568' }}>{c.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t" style={{ borderColor: '#1E2D45' }}>
            <span className="text-xs" style={{ color: '#00897B' }}>
              ✅ 已推送 12 个提交到 GitHub
            </span>
          </div>
        </Card>
        
        {/* Sprint 进度卡片 */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#7A8BA8' }}>
            <GitPullRequest className="w-4 h-4" />
            Sprint 进度
          </h3>
          <div className="space-y-3">
            {sprints.map(s => (
              <div key={s.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: '#E8EDF4' }}>{s.name}</span>
                  <span className="text-xs font-mono" style={{ color: s.color }}>{s.progress}%</span>
                </div>
                <div className="h-2 rounded bg-slate-800">
                  <div className="h-full rounded" style={{ width: `${s.progress}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* 文档完成度卡片 */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#7A8BA8' }}>
            <CheckCircle className="w-4 h-4" />
            文档完成度
          </h3>
          <div className="text-center mb-3">
            <span className="text-3xl font-display font-bold" style={{ color: '#00897B' }}>{doneDocs}</span>
            <span className="text-lg" style={{ color: '#445568' }}>/{totalDocs}</span>
          </div>
          <p className="text-xs text-center" style={{ color: '#7A8BA8' }}>
            技术文档完成度
          </p>
          <div className="mt-3 pt-3 border-t" style={{ borderColor: '#1E2D45' }}>
            {docs.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs mb-1">
                <span style={{ color: '#7A8BA8' }}>{d.name}</span>
                <span style={{ color: d.done === d.count ? '#00897B' : '#F57C00' }}>
                  {d.done}/{d.count}
                </span>
              </div>
            ))}
          </div>
        </Card>
        
        {/* 测试状态卡片 */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#7A8BA8' }}>
            <AlertCircle className="w-4 h-4" />
            测试状态
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#E8EDF4' }}>单元测试</span>
              <span className="text-sm font-mono" style={{ color: '#00897B' }}>{runTests}/{totalTests}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#E8EDF4' }}>集成测试</span>
              <span className="text-sm" style={{ color: '#F57C00' }}>⏳ 待运行</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#E8EDF4' }}>性能测试</span>
              <span className="text-sm" style={{ color: '#445568' }}>-</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t" style={{ borderColor: '#1E2D45' }}>
            <p className="text-xs" style={{ color: '#445568' }}>
              测试覆盖率: <span style={{ color: '#F57C00' }}>0%</span>
            </p>
          </div>
        </Card>
      </div>
      
      {/* 第二行 */}
      <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* 部署状态 */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#7A8BA8' }}>
            <Server className="w-4 h-4" />
            部署状态
          </h3>
          <div className="space-y-2">
            {deploys.map(d => (
              <div key={d.env} className="flex items-center justify-between p-2 rounded" 
                style={{ background: d.status === 'running' ? 'rgba(0,137,123,0.08)' : '#131926',
                border: '1px solid #1E2D45' }}>
                <div className="flex items-center gap-2">
                  {d.status === 'running' ? 
                    <CheckCircle className="w-4 h-4" style={{ color: '#00897B' }} /> :
                    <Clock className="w-4 h-4" style={{ color: '#F57C00' }} />
                  }
                  <div>
                    <p className="text-sm" style={{ color: '#E8EDF4' }}>{d.env}</p>
                    <p className="text-xs" style={{ color: '#445568' }}>{d.url}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded"
                  style={{ 
                    background: d.status === 'running' ? 'rgba(0,137,123,0.15)' : 'rgba(245,124,0,0.1)',
                    color: d.status === 'running' ? '#00897B' : '#F57C00'
                  }}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
        
        {/* 快捷操作 */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3" style={{ color: '#7A8BA8' }}>
            快捷操作
          </h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <GitCommit className="w-4 h-4 mr-2" />
              提交代码
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Container className="w-4 h-4 mr-2" />
              Docker 构建
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Database className="w-4 h-4 mr-2" />
              运行测试
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Server className="w-4 h-4 mr-2" />
              查看日志
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Git 提交历史完整列表 */}
      <Card className="p-4 mt-4">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#7A8BA8' }}>
          <GitCommit className="w-4 h-4" />
          Git 提交历史
        </h3>
        <div className="space-y-1">
          {commits.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-slate-800 cursor-pointer"
              style={{ transition: 'background 0.2s' }}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs" style={{ color: '#2D7DD2' }}>{c.sha}</span>
                <span style={{ color: '#E8EDF4' }}>{c.msg}</span>
              </div>
              <span className="text-xs" style={{ color: '#445568' }}>{c.time}</span>
            </div>
          ))}
        </div>
        <Button variant="link" className="mt-3 text-xs" style={{ color: '#3D9BE9' }}>
          查看全部提交 →
        </Button>
      </Card>
    </div>
  );
}
