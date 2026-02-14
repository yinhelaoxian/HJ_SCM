import React, { useState } from 'react';

/**
 * 移动端仪表盘
 */
export default function MobileDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* 顶部 */}
      <header className="sticky top-0 z-40 bg-gray-800/95 backdrop-blur p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">SCM 移动端</h1>
      </header>
      
      {/* 内容区 */}
      <main className="p-4 pb-24">
        {/* 快捷入口 */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { icon: '📊', label: '仪表盘' },
            { icon: '⚠️', label: '异常' },
            { icon: '📋', label: '审批' },
            { icon: '📈', label: '报表' }
          ].map(item => (
            <button
              key={item.label}
              className="flex flex-col items-center p-4 bg-gray-800 rounded-xl touch-target"
            >
              <span className="text-2xl mb-2">{item.icon}</span>
              <span className="text-xs text-gray-400">{item.label}</span>
            </button>
          ))}
        </div>
        
        {/* 异常列表 */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="text-white font-bold mb-3">待处理异常</h2>
          {[
            { type: '缺料', level: '高', time: '2小时前' },
            { type: '延期', level: '中', time: '5小时前' }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {item.type === '缺料' ? '⚠️' : '⏰'}
                </span>
                <div>
                  <p className="text-white text-sm">{item.type}</p>
                  <p className="text-gray-500 text-xs">{item.time}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                item.level === '高' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {item.level}优先级
              </span>
            </div>
          ))}
        </div>
      </main>
      
      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 flex justify-around py-3 z-50">
        {['首页', '工作台', '消息', '我的'].map(tab => (
          <button key={tab} className="flex flex-col items-center">
            <span className="text-lg">{tab === '首页' ? '🏠' : tab === '工作台' ? '📋' : tab === '消息' ? '💬' : '👤'}</span>
            <span className="text-xs text-gray-500 mt-1">{tab}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
