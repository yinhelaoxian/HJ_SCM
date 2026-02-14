import React, { useState } from 'react';
import { 
  Sun, Moon, Monitor, RefreshCw, Bell,
  Search, User, Settings
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

/**
 * 仪表盘增强：主题切换/实时数据/快捷入口
 */
export default function EnhancedDashboard() {
  const [theme, setTheme] = useState('dark');
  const [notifications] = useState(3);
  
  const themes = {
    dark: { icon: Moon, label: '深色' },
    light: { icon: Sun, label: '浅色' },
    professional: { icon: Monitor, label: '专业' }
  };
  
  return (
    <div className={theme === 'dark' ? 'bg-gray-900 min-h-screen' : 'bg-gray-100 min-h-screen'}>
      {/* 顶部栏 */}
      <header className={`p-4 border-b ${
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900`}>
              SCM 仪表盘
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* 主题切换 */}
            {Object.entries(themes).map(([key, t]) => {
              const Icon = t.icon;
              return (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`p-2 rounded-lg ${
                    theme === key 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-500 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5"/>
                </button>
              );
            })}
            
            {/* 通知 */}
            <button className="relative p-2 text-gray-400 hover:text-white">
              <Bell className="w-5 h-5"/>
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {notifications}
              </span>
            </button>
          </div>
        </div>
      </header>
      
      {/* 快捷入口 */}
      <main className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: '审批(5)', icon: '📋' },
            { label: '异常(3)', icon: '⚠️' },
            { label: '待办(8)', icon: '📝' },
            { label: '消息(12)', icon: '💬' }
          ].map((item, i) => (
            <Card key={i} className="p-4 cursor-pointer hover:border-blue-500/50">
              <span className="text-2xl">{item.icon}</span>
              <p className={`mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {item.label}
              </Card>
          ))}
        </div>
        
        {/* 内容区 */}
        <div className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
          内容区域
        </div>
      </main>
    </div>
  );
}
