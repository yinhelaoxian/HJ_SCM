# HJ_SCM 多代理协作模式使用指南

## 快速开始

### 方式1：使用OpenClaw命令（推荐）

```bash
# 启动一个产品经理子代理
openclaw sessions spawn --agent product-manager --task "设计一个新的库存管理模块"

# 启动一个系统架构师子代理
openclaw sessions spawn --agent system-architect --task "设计库存模块的API和数据模型"

# 并行启动多个角色
openclaw sessions spawn --agent senior-engineer --task "实现库存管理模块的前端代码"
openclaw sessions spawn --agent senior-engineer --task "实现库存管理模块的后端API"
```

### 方式2：使用脚本（简化）

```bash
# 启动整个团队协作开发一个功能
cd ~/scm-hj
./scripts/multi-agent-dev.sh "开发库存管理模块"
```

---

## 多代理协作命令

### 查看当前会话

```bash
# 列出所有活跃会话
openclaw sessions list

# 查看特定会话的对话历史
openclaw sessions history <session-key>
```

### 向会话发送消息

```bash
# 给产品经理会话发送消息
openclaw sessions send <session-key> "请更新需求文档，增加库存预警功能"
```

### 管理会话

```bash
# 终止会话
openclaw sessions kill <session-key>

# 创建新会话并指定角色
openclaw sessions create --agent product-manager --name "需求分析"
```

---

## 协作流程示例

### 示例1：开发新功能

```bash
# 1. 启动产品经理
openclaw sessions spawn \
  --agent product-manager \
  --task "分析库存管理模块的需求，输出：功能列表、用户故事、优先级排序" \
  --session pm-session

# 2. 产品经理产出需求文档后，启动系统架构师
openclaw sessions spawn \
  --agent system-architect \
  --task "根据需求文档，设计：API接口、数据模型、组件结构" \
  --session arch-session

# 3. 架构设计完成后，启动高级工程师
openclaw sessions spawn \
  --agent senior-engineer \
  --task "实现库存管理模块的所有功能代码" \
  --session dev-session

# 4. 代码完成后，启动QA测试
openclaw sessions spawn \
  --agent qa-tester \
  --task "测试库存管理模块，编写测试用例，发现并记录Bug" \
  --session qa-session

# 5. 测试通过后，启动交付官
openclaw sessions spawn \
  --agent delivery-officer \
  --task "部署库存管理模块到测试环境，验证功能正常" \
  --session deploy-session
```

### 示例2：修复Bug

```bash
# 1. 启动QA测试员定位问题
openclaw sessions spawn \
  --agent qa-tester \
  --task "复现库存模块的显示Bug，定位问题原因和位置" \
  --session bug-locator

# 2. 根据QA报告，启动高级工程师修复
openclaw sessions spawn \
  --agent senior-engineer \
  --task "修复库存模块显示Bug：问题在p8_OTCFlow的详情抽屉组件" \
  --session bug-fixer

# 3. 修复后，QA验证
openclaw sessions spawn \
  --agent qa-tester \
  --task "验证库存模块显示Bug已修复，测试所有相关功能" \
  --session bug-verifier
```

---

## 多代理协作脚本

创建快捷脚本：

```bash
mkdir -p ~/scm-hj/scripts

cat > ~/scm-hj/scripts/multi-agent-dev.sh << 'SCRIPT'
#!/bin/bash

# HJ_SCM 多代理协作开发脚本
# 用法: ./scripts/multi-agent-dev.sh "任务描述"

TASK="$1"

if [ -z "$TASK" ]; then
    echo "用法: ./multi-agent-dev.sh \"任务描述\""
    exit 1
fi

echo "🚀 启动多代理团队协作..."
echo "任务: $TASK"
echo ""

# 1. 启动产品经理
echo "📋 [1/5] 启动产品经理..."
PRODUCT_SESSION=$(openclaw sessions spawn \
  --agent product-manager \
  --task "分析$TASK的需求，输出功能列表和用户故事" \
  --cleanup delete)

echo "产品经理会话: $PRODUCT_SESSION"

# 2. 启动系统架构师（并行）
echo ""
echo "🏗️ [2/5] 启动系统架构师..."
ARCH_SESSION=$(openclaw sessions spawn \
  --agent system-architect \
  --task "设计$TASK的技术架构、API和数据模型" \
  --cleanup delete)

echo "架构师会话: $ARCH_SESSION"

# 3. 等待产品经理和架构师完成后，启动工程师
echo ""
echo "⏳ 等待需求和架构设计完成..."

# 模拟等待（实际应该监控会话状态）
sleep 30

# 3. 启动高级工程师
echo ""
echo "💻 [3/5] 启动高级工程师..."
DEV_SESSION=$(openclaw sessions spawn \
  --agent senior-engineer \
  --task "实现$TASK的所有功能代码" \
  --cleanup delete)

echo "工程师会话: $DEV_SESSION"

# 4. 代码完成后，启动QA
echo ""
echo "⏳ 等待代码实现完成..."
sleep 60

# 4. 启动QA测试
echo ""
echo "🧪 [4/5] 启动QA测试..."
QA_SESSION=$(openclaw sessions spawn \
  --agent qa-tester \
  --task "测试$TASK，编写测试用例，发现并记录Bug" \
  --cleanup delete)

echo "QA会话: $QA_SESSION"

# 5. 测试通过后，启动交付官
echo ""
echo "⏳ 等待测试完成..."
sleep 30

# 5. 启动交付官
echo ""
echo "🚀 [5/5] 启动交付官..."
DEPLOY_SESSION=$(openclaw sessions spawn \
  --agent delivery-officer \
  --task "部署$TASK到服务器，验证功能正常" \
  --cleanup delete)

echo "交付官会话: $DEPLOY_SESSION"

echo ""
echo "✅ 多代理协作任务已完成！"
echo "所有会话已记录，可以随时查看进度。"
SCRIPT

chmod +x ~/scm-hj/scripts/multi-agent-dev.sh
```

---

## 会话管理最佳实践

### 命名规范

```
会话命名格式: {角色}-{任务}-{时间戳}

示例:
- pm-inventory-20260213
- arch-inventory-20260213
- dev-inventory-20260213
- qa-inventory-20260213
- deploy-inventory-20260213
```

### 清理策略

```bash
# 开发完成后清理测试会话
openclaw sessions list --status completed | xargs -I {} openclaw sessions kill {}

# 或者使用 --cleanup delete 参数自动清理
openclaw sessions spawn --agent qa-tester --task "测试" --cleanup delete
```

### 状态监控

```bash
# 查看所有会话状态
openclaw sessions list

# 查看活跃会话
openclaw sessions list --status active

# 查看最近会话
openclaw sessions list --limit 10
```

---

## 故障排查

### 问题1：会话无法启动

```bash
# 检查agents配置
cat ~/.openclaw/config/agents.yaml

# 检查OpenClaw服务状态
openclaw status
```

### 问题2：会话超时

```bash
# 增加超时时间
openclaw sessions spawn --agent senior-engineer --task "任务" --timeout 600
```

### 问题3：无法通信

```bash
# 查看会话日志
openclaw sessions logs <session-key>

# 重启会话
openclaw sessions kill <session-key>
openclaw sessions spawn --agent <agent> --task "重新执行"
```

---

## 团队协作效率提升

### 指标监控

| 指标 | 目标值 | 测量方式 |
|------|--------|---------|
| 需求分析时长 | < 2小时 | 产品经理会话时间 |
| 架构设计时长 | < 4小时 | 架构师会话时间 |
| 代码实现时长 | < 8小时 | 工程师会话时间 |
| 测试验证时长 | < 4小时 | QA会话时间 |
| 部署上线时长 | < 1小时 | 交付官会话时间 |
| **总交付周期** | **< 2天** | 整体耗时 |

### 协作优化

1. **并行启动**：产品经理和系统架构师可以并行工作
2. **快速迭代**：小步快跑，每个功能独立交付
3. **持续集成**：代码提交后自动触发测试
4. **自动化部署**：测试通过后自动部署

---

## 下一步

1. ✅ 创建agents配置
2. ⏳ 配置OpenClaw服务
3. ⏳ 测试多代理协作
4. ⏳ 优化协作流程

---

*文档版本: v1.0*
*创建时间: 2026-02-13*
