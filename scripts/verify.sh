#!/bin/bash
# 自动化验收脚本 - 增强版

echo "=== HJ_SCM 自动化验收 (增强版) ==="

ERRORS=0

# 1. 检查服务器是否运行
echo -e "\n[1] 检查服务器状态..."
if lsof -i :3000 | grep LISTEN > /dev/null; then
    echo "✅ 服务器运行中"
else
    echo "❌ 服务器未运行"
    exit 1
fi

# 2. 检查页面是否可访问
echo -e "\n[2] 检查页面可访问性..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ 页面返回 200"
else
    echo "❌ 页面返回 $HTTP_CODE"
    exit 1
fi

# 3. 检查 HTML 结构
echo -e "\n[3] 检查 HTML 结构..."
if curl -s http://localhost:3000 | grep -q 'id="root"'; then
    echo "✅ 包含 root 元素"
else
    echo "❌ 缺少 root 元素"
    exit 1
fi

# 4. 检查 React 脚本
echo -e "\n[4] 检查 React 加载..."
if curl -s http://localhost:3000 | grep -q 'react'; then
    echo "✅ 包含 React 脚本"
else
    echo "❌ 缺少 React 脚本"
    exit 1
fi

# 5. 检查 Vite 客户端
echo -e "\n[5] 检查 Vite 客户端..."
if curl -s http://localhost:3000 | grep -q '@vite/client'; then
    echo "✅ Vite 客户端已加载"
else
    echo "❌ Vite 客户端未加载"
    exit 1
fi

# 6. 【新增】检查组件命名一致性
echo -e "\n[6] 检查组件命名一致性..."
cd /home/ubuntu/scm-hj/src/features/strategy

FAILED_COMPONENTS=""

# 检查 capacity 组件
CAPACITY_DEF=$(grep -o "^const CapacityPlanningPage" capacity/index.tsx 2>/dev/null || echo "")
CAPACITY_EXP=$(grep "export default CapacityPage" capacity/index.tsx 2>/dev/null || echo "")
if [ -n "$CAPACITY_DEF" ] && [ -n "$CAPACITY_EXP" ]; then
    echo "❌ capacity/index.tsx: 组件命名不一致 (CapacityPlanningPage vs CapacityPage)"
    FAILED_COMPONENTS="$FAILED_COMPONENTS capacity"
    ERRORS=$((ERRORS + 1))
fi

# 检查 financial 组件
FINANCIAL_DEF=$(grep -o "^const FinancialConstraintsPage" financial/index.tsx 2>/dev/null || echo "")
FINANCIAL_EXP=$(grep "export default FinancialPage" financial/index.tsx 2>/dev/null || echo "")
if [ -n "$FINANCIAL_DEF" ] && [ -n "$FINANCIAL_EXP" ]; then
    echo "❌ financial/index.tsx: 组件命名不一致 (FinancialConstraintsPage vs FinancialPage)"
    FAILED_COMPONENTS="$FAILED_COMPONENTS financial"
    ERRORS=$((ERRORS + 1))
fi

# 检查 network 组件
NETWORK_DEF=$(grep -o "^const NetworkPlanningPage" network/index.tsx 2>/dev/null || echo "")
NETWORK_EXP=$(grep "export default NetworkPage" network/index.tsx 2>/dev/null || echo "")
if [ -n "$NETWORK_DEF" ] && [ -n "$NETWORK_EXP" ]; then
    echo "❌ network/index.tsx: 组件命名不一致 (NetworkPlanningPage vs NetworkPage)"
    FAILED_COMPONENTS="$FAILED_COMPONENTS network"
    ERRORS=$((ERRORS + 1))
fi

# 检查 portfolio 组件
PORTFOLIO_DEF=$(grep -o "^const PortfolioPage" portfolio/index.tsx 2>/dev/null || echo "")
PORTFOLIO_EXP=$(grep "export default PortfolioAnalysisPage" portfolio/index.tsx 2>/dev/null || echo "")
if [ -n "$PORTFOLIO_DEF" ] && [ -n "$PORTFOLIO_EXP" ]; then
    echo "❌ portfolio/index.tsx: 组件命名不一致 (PortfolioPage vs PortfolioAnalysisPage)"
    FAILED_COMPONENTS="$FAILED_COMPONENTS portfolio"
    ERRORS=$((ERRORS + 1))
fi

if [ $ERRORS -eq 0 ]; then
    echo "✅ 所有组件命名一致"
fi

# 7. 【新增】检查 Vite 服务器日志中的编译错误
echo -e "\n[7] 检查 Vite 编译错误..."
VITE_ERRORS=$(grep -i "error\|failed\|未定义" /tmp/vite.log 2>/dev/null | grep -v "Download the React DevTools" | head -10 || echo "")
if [ -n "$VITE_ERRORS" ]; then
    echo "⚠️  Vite 服务器日志中发现潜在错误："
    echo "$VITE_ERRORS" | head -5
    ERRORS=$((ERRORS + 1))
else
    echo "✅ Vite 编译无明显错误"
fi

# 最终结果
echo -e "\n========================================"
if [ $ERRORS -gt 0 ]; then
    echo "   ⚠️  验收未通过，发现 $ERRORS 个问题"
    echo "   问题组件: $FAILED_COMPONENTS"
    exit 1
else
    echo "   🎉 验收通过！"
    echo "========================================"
    exit 0
fi
