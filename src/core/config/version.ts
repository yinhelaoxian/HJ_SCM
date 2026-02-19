/**
 * HJ SCM 版本配置
 * 动态读取 package.json 中的版本号
 */

import packageJson from '../../package.json';

// 从 package.json 读取版本号
const pkg = packageJson as { version?: string };
const version = pkg.version || '1.0.0';

export const APP_VERSION = {
  version: version,
  
  // 完整版本字符串
  get full(): string {
    return `v${version}`;
  },
  
  // 显示版本（含类型标识）
  get display(): string {
    return `${this.full} 演示版 ${new Date().toLocaleDateString('zh-CN')}`;
  },
  
  // 构建日期
  buildDate: new Date().toISOString().split('T')[0],
};

export default APP_VERSION;
