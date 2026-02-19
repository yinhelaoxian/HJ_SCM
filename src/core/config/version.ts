/**
 * HJ SCM 版本配置
 * 动态版本号
 */

// 直接读取 package.json 内容
import fs from 'fs';
import path from 'path';

const versionPath = path.resolve(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(versionPath, 'utf-8'));
const version = pkg.version || '1.0.0';

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
