# HJ_SCM 设计系统规范

> 基于行业最佳实践（shadcn/ui + Tailwind CSS）构建的深色主题设计系统

## 1. 设计理念

- **原子化设计**：使用Tailwind CSS utility classes构建UI
- **语义化命名**：颜色、间距、字体都有明确语义
- **深色优先**：针对指挥中心大屏场景优化的深色主题
- **主题切换**：支持亮色/深色主题切换

## 2. 颜色系统

### 2.1 核心语义色

```css
:root {
  /* 主题色 */
  --color-primary: #2D7DD2;      /* 品牌主色 */
  --color-primary-hover: #3D9BE9; /* 主色悬停态 */
  --color-primary-light: rgba(45, 125, 210, 0.1);
  
  /* 状态色 */
  --color-success: #00897B;       /* 成功/正常 */
  --color-warning: #F57C00;       /* 警告/注意 */
  --color-danger: #E53935;        /* 危险/错误 */
  --color-info: #3D9BE9;          /* 信息 */
  
  /* 中性色 - 深色主题 */
  --background: #0B0F17;          /* 页面背景 */
  --foreground: #E8EDF4;          /* 主文字色 */
  --card: #131926;                /* 卡片背景 */
  --card-foreground: #E8EDF4;     /* 卡片文字 */
  --popover: #131926;             /* 浮层背景 */
  --popover-foreground: #E8EDF4;   /* 浮层文字 */
  
  /* 边框与辅助 */
  --border: #1E2D45;              /* 边框色 */
  --input: #0B0F17;              /* 输入框背景 */
  --ring: #2D7DD2;                /* 聚焦边框 */
}
```

### 2.2 图表颜色系统

```css
.chart-1: #2D7DD2;  /* 蓝色 - 主要数据 */
.chart-2: #00897B;   /* 青绿 - 次要数据 */
.chart-3: #F57C00;   /* 橙色 - 警告数据 */
.chart-4: #E53935;   /* 红色 - 危险数据 */
.chart-5: #7A8BA8;   /* 灰色 - 辅助数据 */
```

### 2.3 侧边栏颜色

```css
.sidebar: #0B0F17;           /* 侧边栏背景 */
.sidebar-foreground: #E8EDF4; /* 侧边栏文字 */
.sidebar-accent: #1A2235;     /* 侧边栏选中态 */
.sidebar-border: #1E2D45;     /* 侧边栏边框 */
```

## 3. 间距系统

```css
:root {
  --space-1: 4px;   /* 超小间距 */
  --space-2: 8px;   /* 小间距 */
  --space-3: 12px;  /* 中小间距 */
  --space-4: 16px;  /* 中间距 */
  --space-5: 20px;  /* 中大间距 */
  --space-6: 24px;  /* 大间距 */
  --space-8: 32px;  /* 特大间距 */
  --space-10: 40px; /* 页面间距 */
}
```

## 4. 字体系统

```css
:root {
  /* 字体族 */
  --font-display: 'Barlow Condensed', sans-serif;  /* 标题字体 */
  --font-body: 'IBM Plex Sans', sans-serif;       /* 正文字体 */
  --font-mono: 'IBM Plex Mono', monospace;        /* 等宽字体 */
  
  /* 字重 */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  
  /* 字号 */
  --text-xs: 12px;     /* 辅助文字 */
  --text-sm: 14px;     /* 小正文 */
  --text-base: 16px;   /* 正文字号 */
  --text-lg: 18px;     /* 小标题 */
  --text-xl: 20px;     /* 中标题 */
  --text-2xl: 24px;    /* 大标题 */
  --text-3xl: 30px;   /* 特大标题 */
  --text-4xl: 36px;   /* 页面标题 */
}
```

## 5. 圆角与阴影

```css
:root {
  --radius-sm: 4px;      /* 小圆角 */
  --radius-md: 6px;      /* 中圆角 */
  --radius-lg: 8px;      /* 大圆角 */
  --radius-xl: 12px;     /* 特大圆角 */
  --radius-full: 9999px; /* 全圆角 */
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.4);
}
```

## 6. 动画系统

```css
:root {
  --animate-fast: 150ms ease;   /* 快速过渡 */
  --animate-base: 200ms ease;   /* 标准过渡 */
  --animate-slow: 300ms ease;   /* 慢速过渡 */
}
```

## 7. 组件规范

### 7.1 按钮 (Button)

```tsx
// props: variant, size, loading, disabled
<Button variant="primary" size="md" loading={false}>
  确定
</Button>
```

### 7.2 卡片 (Card)

```tsx
// props: variant, padding
<Card variant="bordered" padding="md">
  内容
</Card>
```

### 7.3 徽章 (Badge)

```tsx
// props: variant
<Badge variant="success">已确认</Badge>
<Badge variant="warning">待审批</Badge>
<Badge variant="danger">有风险</Badge>
```

### 7.4 加载骨架 (Skeleton)

```tsx
<Skeleton variant="text" width="100%" height={16} />
<Skeleton variant="circular" width={40} height={40} />
```

## 8. 布局规范

### 8.1 页面布局

```
┌─────────────────────────────────────┐
│ Header (56px)                       │
├─────────────┬───────────────────────┤
│             │                       │
│  Sidebar    │    Main Content       │
│  (220px)    │    (剩余宽度)         │
│             │                       │
│             │                       │
└─────────────┴───────────────────────┘
```

### 8.2 网格系统

```css
.grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
.gap-4 { gap: 16px; }
```

## 9. 状态颜色映射

| 状态 | CSS变量 | 用途 |
|------|---------|------|
| 成功 | success | 正常/完成/通过 |
| 警告 | warning | 待处理/预警 |
| 危险 | danger | 错误/风险/断供 |
| 信息 | info | 提示/进行中 |

## 10. 使用示例

### 10.1 深色卡片组件

```tsx
<div className="card p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
  <h3 style={{ color: 'var(--foreground)' }}>标题</h3>
  <p style={{ color: 'var(--muted-foreground)' }}>正文内容</p>
</div>
```

### 10.2 危险状态

```tsx
<div 
  className="p-3 rounded"
  style={{ 
    background: 'var(--color-danger-light)',
    border: '1px solid var(--color-danger)',
    color: 'var(--color-danger)'
  }}
>
  ⚠️ 存在风险
</div>
```

## 11. 最佳实践

1. **使用CSS变量**：避免硬编码颜色，优先使用`var(--color-*)`
2. **保持一致性**：相同场景使用相同的颜色和间距
3. **响应式设计**：移动优先，支持不同屏幕尺寸
4. **无障碍访问**：确保文字与背景对比度足够

## 12. 相关文件

- `src/index.css` - 全局样式变量
- `src/ui/` - 可复用UI组件
- `src/utils/format.ts` - 格式化工具

---

*版本: v1.0*
*参考: shadcn/ui, Tailwind CSS*
