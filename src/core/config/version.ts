/**
 * HJ SCM 版本配置
 * 浏览器兼容版本
 */

// 从 Vite 注入的环境变量读取版本
// 在 vite.config.ts 中通过 define 注入
const getVersion = (): string => {
  // @ts-ignore
  if (typeof __APP_VERSION__ !== 'undefined') {
    // @ts-ignore
    return __APP_VERSION__;
  }
  // 回退：从 import.meta.env.VITE_APP_VERSION 读取
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_APP_VERSION || '1.0.0';
  }
  return '1.0.0';
};

const version = getVersion();

export const APP_VERSION = {
  version: version,
  
  // 完整版本字符串
  get full(): string {
    return `v${version}`;
  },
  
  // 显示版本（含日期）
  get display(): string {
    return `${this.full} 演示版 ${new Date().toLocaleDateString('zh-CN')}`;
  },
  
  // 构建日期
  buildDate: new Date().toISOString().split('T')[0],
};

export default APP_VERSION;
