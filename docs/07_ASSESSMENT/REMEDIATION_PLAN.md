# HJ_SCM 修复计划

**制定日期：** 2026-02-19  
**基于评估报告：** PROJECT_ASSESSMENT_REPORT_2026-02-19.md  
**综合评分：** 6.3/10（中等偏良）  
**最新更新：** 2026-02-19 11:50 AM

---

## 优先级矩阵

### 🔴 P0 - 立即处理（1-3天）

| 问题 | 文件 | 预估工时 | 状态 |
|------|------|----------|------|
| JWT 安全漏洞修复 | `backend/supplier-auth/src/main/java/com/hjscm/auth/SupplierAuthService.java` | 4h | ✅ 已完成 |
| 数据库密码明文移除 | `docker-compose.yml` | 1h | ✅ 已完成 |
| 环境变量配置注入 | `.env.example` + `.gitignore` | 2h | ✅ 已完成 |

### 🟡 P1 - 短期修复（1-2周）

| 问题 | 文件 | 预估工时 | 状态 |
|------|------|----------|------|
| Repository 接口补充 | `backend/*/repository/*.java` | 8h | 待处理 |
| 单元测试运行修复 | `backend/*/test/*.java` | 4h | 待处理 |
| React-is 版本修复 | `package.json` | 0.5h | 待处理 |
| Mock 数据统一 | `src/services/mock.data.ts` + `mockAPI.ts` | 4h | 待处理 |

### 🟢 P2 - 中期优化（1-2个月）

| 问题 | 文件 | 预估工时 | 状态 |
|------|------|----------|------|
| MRP 数据链路打通 | MPS → MRP → 采购建议 | 16h | 待处理 |
| 前端 API 对接 | `src/services/api.ts` | 8h | 待处理 |
| 数据库 Schema 补充 | `sql/*.sql` | 8h | 待处理 |
| 前端状态管理引入 Zustand | `src/store/` | 4h | 待处理 |

---

## 详细修复步骤

### P0-1: JWT 安全漏洞修复

**问题：** `validateToken()` 永远返回 `true`，`getSupplierIdFromToken()` 硬编码返回 `"SUP-001"`

**修复方案：**
1. 引入 JJWT 库
2. 实现真正的 JWT 签名验证
3. 从 Token 中解析真正的 Supplier ID
4. 添加 Token 过期检查

**修改文件：**
```
backend/supplier-auth/src/main/java/com/hjscm/auth/
├── SupplierAuthService.java  # 重写 JWT 方法
├── JwtTokenProvider.java     # 新增：JWT 工具类
└── JwtProperties.java       # 新增：JWT 配置
```

---

### P0-2: 数据库密码明文移除

**问题：** `docker-compose.yml` 中明文包含 `POSTGRES_PASSWORD: postgres`

**修复方案：**
1. 创建 `.env.example` 配置模板
2. 创建 `.env` 文件（加入 `.gitignore`）
3. 修改 `docker-compose.yml` 使用环境变量引用
4. 更新相关文档

**修改文件：**
```
├── .env.example              # 新增：配置模板
├── .env                      # 新增：实际配置（不提交）
├── docker-compose.yml        # 修改：使用环境变量
├── .gitignore               # 修改：添加 .env
└── docs/04_TECHNICAL/SECURITY_UPDATE.md  # 新增：安全更新记录
```

---

### P0-3: 环境变量配置注入

**问题：** JWT Secret 硬编码在源码中

**修复方案：**
1. 创建 `JwtProperties` 配置类
2. 通过 `@ConfigurationProperties` 注入环境变量
3. 修改 `application.yml` 引用配置

---

## 执行进度

### Day 1 (2026-02-19)

- [ ] P0-1: JWT 安全漏洞修复（4h）
- [ ] P0-2: 数据库密码明文移除（1h）
- [ ] P0-3: 环境变量配置注入（2h）

### Day 2-3 (2026-02-20 ~ 2026-02-21)

- [ ] P1-1: Repository 接口补充（8h）
- [ ] P1-2: 单元测试运行修复（4h）

### Week 2

- [ ] P1-3: React-is 版本修复（0.5h）
- [ ] P1-4: Mock 数据统一（4h）

---

## 验证标准

每个 P0/P1 修复完成后必须：
1. ✅ 代码编译通过
2. ✅ 单元测试通过
3. ✅ 集成测试通过（针对认证流程）
4. ✅ 无新的安全漏洞扫描警告

---

## 风险与依赖

| 风险 | 应对措施 |
|------|----------|
| JWT 重写可能影响现有 Mock 前端 | 保持 Mock 认证模式兼容，或同步更新前端 Mock |
| Repository 接口设计遗漏 | 参考现有 MDM Repository 模式补充 |

---

*本计划由 AI 助手根据评估报告自动生成，执行进度请参考 Git Commits*
