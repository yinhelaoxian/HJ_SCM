# HJ_SCM 设计系统规范 v2.0

> 基于 Tailwind CSS v4 + shadcn/ui 最佳实践

## 1. 设计理念

- **Tailwind CSS v4 集成**：使用 `@theme inline` 映射CSS变量
- **语义化命名**：颜色使用 `--color-*` 前缀
- **主题切换**：支持亮色/深色 `.dark` 类切换
- **OKLCH 准备**：兼容现代色彩空间

## 2. 颜色系统

### 2.1 核心语义色

```css
:root {
  /* 品牌色 */
  --color-primary: #2D7DD2;
  --color-primary-hover: #3D9BE9;
  
  /* 状态色 */
  --color-success: #00897B;
  --color-warning: #F57C00;
  --color-destructive: #E53935;  /* danger → destructive */
  --color-info: #3D9BE9;
}
```

### 2.2 Tailwind CSS v4 映射

```css
@theme inline {
  --color-background: var(--color-background);
  --color-foreground: var(--color-foreground);
  --color-card: var(--color-card);
  --color-popover: var(--color-popover);
  --color-primary: var(--color-primary);
  --color-primary-foreground: var(--color-primary-foreground);
  --color-secondary: var(--color-secondary);
  --color-muted: var(--color-muted);
  --color-accent: var(--color-accent);
  --color-destructive: var(--color-destructive);
  --color-border: var(--color-border);
  --color-input: var(--color-input);
  --color-ring: var(--color-ring);
  
  /* 图表颜色 */
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
}
```

### 2.3 深色主题

```css
.dark {
  --color-background: #0B0F17;
  --color-foreground: #E8EDF4;
  --color-card: #131926;
  --color-secondary: #1A2235;
  --color-muted: #1A2235;
  --color-muted-foreground: #7A8BA8;
  --color-accent: #1A2235;
  --color-border: #1E2D45;
  --color-destructive: #E53935;
}
```

### 2.4 颜色使用示例

```tsx
// Tailwind 类
<div className="bg-primary text-primary-foreground">主要按钮</div>
<div className="bg-destructive text-destructive-foreground">危险操作</div>
<div className="bg-muted text-muted-foreground">辅助文字</div>

// CSS 变量
<div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
  卡片内容
</div>
```

## 3. 字体系统

```css
:root {
  --font-family-display: 'Barlow Condensed', sans-serif;  /* 标题 */
  --font-family-body: 'IBM Plex Sans', sans-serif;       /* 正文 */
  --font-family-mono: 'IBM Plex Mono', monospace;       /* 代码 */
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
}
```

## 4. 圆角系统

```css
:root {
  --radius: 8px;
  --radius-sm: calc(var(--radius) - 4px);  /* 4px */
  --radius-md: calc(var(--radius) - 2px);  /* 6px */
  --radius-lg: var(--radius);               /* 8px */
  --radius-xl: calc(var(--radius) + 4px);  /* 12px */
  --radius-full: 9999px;
}
```

## 5. 基础样式层 (@layer base)

```css
@layer base {
  /* 全局重置 */
  *, *::before, *::after {
    box-sizing: border-box;
  }
  
  /* 焦点环 */
  *:focus-visible {
    outline: 2px solid var(--color-ring);
    outline-offset: 2px;
  }
  
  /* 基础排版 */
  h1 { font-size: 24px; font-weight: 500; line-height: 1.5; }
  h2 { font-size: 20px; font-weight: 500; line-height: 1.5; }
  h3 { font-size: 18px; font-weight: 500; line-height: 1.5; }
  h4 { font-size: 16px; font-weight: 500; line-height: 1.5; }
}
```

## 6. 组件使用

### 6.1 按钮

```tsx
// Tailwind 类
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-hover">
  确定
</button>

// CSS 变量
<button style={{ 
  background: 'var(--color-primary)',
  color: 'var(--color-primary-foreground)',
  borderRadius: 'var(--radius-lg)'
}}>
  确定
</button>
```

### 6.2 卡片

```tsx
<div className="bg-card border border-border rounded-lg p-4">
  卡片内容
</div>
```

### 6.3 输入框

```tsx
<input 
  className="bg-input border border-border rounded-md px-3 py-2"
  placeholder="输入内容"
/>
```

## 7. 状态颜色映射

| 状态 | CSS变量 | Tailwind类 | 用途 |
|------|---------|------------|------|
| 成功 | `--color-success` | `text-success` | 正常/完成 |
| 警告 | `--color-warning` | `text-warning` | 预警/待处理 |
| 危险 | `--color-destructive` | `text-destructive` | 错误/风险 |
| 信息 | `--color-info` | `text-info` | 提示/进行中 |

## 8. 图表颜色规范

```css
.chart-1: #2D7DD2  /* 蓝色 - 主要数据 */
.chart-2: #00897B  /* 青绿 - 次要数据 */
.chart-3: #F57C00  /* 橙色 - 强调数据 */
.chart-4: #E53935  /* 红色 - 警示数据 */
.chart-5: #7A8BA8  /* 灰色 - 辅助数据 */
```

## 9. 侧边栏专用颜色

```css
@theme inline {
  --color-sidebar: var(--color-sidebar);
  --color-sidebar-foreground: var(--color-sidebar-foreground);
  --color-sidebar-accent: var(--color-sidebar-accent);
  --color-sidebar-accent-foreground: var(--color-sidebar-accent-foreground);
  --color-sidebar-border: var(--color-sidebar-border);
}
```

## 10. 动画系统

```css
.animate-slide-in { animation: slideIn 200ms ease-out; }
.animate-fade-in { animation: fadeIn 200ms ease-out; }
.animate-pulse { animation: pulse 2s infinite; }

@keyframes slideIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
```

## 11. 文件结构

```
src/
├── index.css              # 全局样式 + CSS变量
├── ui/                    # 可复用UI组件
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Badge.tsx
└── components/           # 业务组件
```

## 12. 最佳实践

1. **优先使用Tailwind类**：如 `bg-primary`, `text-destructive`
2. **CSS变量用于动态值**：如 `style={{ background: 'var(--color-card)' }}`
3. **保持一致性**：相同场景使用相同颜色
4. **响应式设计**：使用Tailwind响应式类

## 13. 相关文件

- `src/index.css` - 完整样式变量定义
- `src/ui/` - 组件库

---

*版本: v2.0*
*参考: Tailwind CSS v4, shadcn/ui*

---

## 14. 异常标签组件（Exception Badge）

用于展示异常状态的专用组件。

### 14.1 标签类型

| 类型 | 样式 | 用法 |
|------|------|------|
| CRITICAL | 红底 + 高亮 | 紧急异常 |
| HIGH | 橙底 | 高风险异常 |
| MEDIUM | 黄底 | 中等风险 |
| LOW | 蓝底 | 低风险/提示 |

### 14.2 组件代码

```tsx
interface ExceptionBadgeProps {
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  label: string;
}

const exceptionStyles = {
  CRITICAL: 'bg-red-900/30 text-red-400 border-red-700',
  HIGH: 'bg-orange-900/30 text-orange-400 border-orange-700',
  MEDIUM: 'bg-yellow-900/30 text-yellow-400 border-yellow-700',
  LOW: 'bg-blue-900/30 text-blue-400 border-blue-700',
};

export function ExceptionBadge({ level, label }: ExceptionBadgeProps) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${exceptionStyles[level]}`}>
      {label}
    </span>
  );
}
```

### 14.3 使用示例

```tsx
<div className="flex gap-2">
  <ExceptionBadge level="CRITICAL" label="紧急缺料" />
  <ExceptionBadge level="HIGH" label="高风险" />
  <ExceptionBadge level="MEDIUM" label="待处理" />
  <ExceptionBadge level="LOW" label="提示" />
</div>
```

---

## 15. 地图组件（Map Component）

用于物流追踪和工厂分布的可视化组件。

### 15.1 地图标记类型

| 类型 | 图标 | 用法 |
|------|------|------|
| FACTORY | 🏭 | 工厂位置 |
| WAREHOUSE | 📦 | 仓库位置 |
| IN_TRANSIT | 🚚 | 在途物料 |
| DELIVERY | 📍 | 交付点 |
| ALERT | ⚠️ | 异常位置 |

### 15.2 组件代码

```tsx
interface MapMarker {
  id: string;
  type: 'FACTORY' | 'WAREHOUSE' | 'IN_TRANSIT' | 'DELIVERY' | 'ALERT';
  lat: number;
  lng: number;
  label: string;
  info?: string;
}

interface MapComponentProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (marker: MapMarker) => void;
}

export function SCMMap({ markers, center, zoom, onMarkerClick }: MapComponentProps) {
  const markerColors = {
    FACTORY: '#2D7DD2',
    WAREHOUSE: '#00897B',
    IN_TRANSIT: '#F57C00',
    DELIVERY: '#E53935',
    ALERT: '#E53935',
  };
  
  return (
    <div className="relative w-full h-96 bg-slate-900 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl mb-2 block">🗺️</span>
          <span className="text-sm text-slate-400">地图组件占位</span>
        </div>
      </div>
      {markers.map(marker => (
        <button
          key={marker.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(marker.lng + 180) / 360 * 100}%`, top: `${(90 - marker.lat) / 180 * 100}%` }}
          onClick={() => onMarkerClick?.(marker)}
        >
          <span className="text-2xl filter drop-shadow-lg">
            {marker.type === 'FACTORY' ? '🏭' : 
             marker.type === 'WAREHOUSE' ? '📦' : 
             marker.type === 'IN_TRANSIT' ? '🚚' : 
             marker.type === 'DELIVERY' ? '📍' : '⚠️'}
          </span>
        </button>
      ))}
    </div>
  );
}
```

### 15.3 使用示例

```tsx
const markers: MapMarker[] = [
  { id: '1', type: 'FACTORY', lat: 36.07, lng: 120.37, label: '青岛总部', info: '利用率 112%' },
  { id: '2', type: 'FACTORY', lat: 31.23, lng: 121.47, label: '苏州华东', info: '利用率 78%' },
  { id: '3', type: 'FACTORY', lat: 13.75, lng: 100.50, label: '泰国曼谷', info: '利用率 43%' },
];

<SCMMap markers={markers} center={{ lat: 25.0, lng: 110.0 }} zoom={4} />
```

---

## 16. 时间线组件（Timeline）

```tsx
interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
}

export function Timeline({ items, direction = 'vertical' }: { items: TimelineItem[], direction?: 'horizontal' | 'vertical' }) {
  return (
    <div className={direction === 'horizontal' ? 'flex items-center' : 'space-y-4'}>
      {items.map((item, index) => (
        <div key={item.id} className="relative">
          {index < items.length - 1 && (
            <div className={`absolute bg-slate-700 ${direction === 'horizontal' ? 'w-12 h-0.5 left-full top-1/2' : 'h-12 w-0.5 top-full left-1/2 -translate-x-1/2'}`} />
          )}
          <div className={`flex ${direction === 'horizontal' ? 'flex-col items-center' : 'flex-row gap-4'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              item.status === 'completed' ? 'bg-green-900 border-green-700 text-green-400' :
              item.status === 'current' ? 'bg-blue-900 border-blue-500 text-blue-400' :
              'bg-slate-800 border-slate-700 text-slate-500'
            }`}>
              {item.status === 'completed' ? '✓' : item.status === 'current' ? '●' : '○'}
            </div>
            <div>
              <p className="text-sm" style={{ color: '#E8EDF4' }}>{item.title}</p>
              <p className="text-xs" style={{ color: '#7A8BA8' }}>{item.date}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 17. 进度条组件（Progress Bar）

```tsx
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function ProgressBar({ value, max = 100, label, variant = 'default' }: ProgressBarProps) {
  const percentage = Math.min(100, (value / max) * 100);
  const colors = { default: '#2D7DD2', success: '#00897B', warning: '#F57C00', danger: '#E53935' };
  
  return (
    <div className="w-full">
      {label && <div className="flex justify-between mb-1"><span className="text-xs" style={{ color: '#7A8BA8' }}>{label}</span><span className="text-xs" style={{ color: '#E8EDF4' }}>{value}%</span></div>}
      <div className="w-full h-2 rounded-full bg-slate-800"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, background: colors[variant] }} /></div>
    </div>
  );
}
```

---

*版本: v2.1*
