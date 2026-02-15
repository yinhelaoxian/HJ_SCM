#!/bin/bash

# HJ SCM 快速状态查看脚本
# 用法: ./quick-status

echo "========================================"
echo "    HJ SCM 项目状态概览"
echo "========================================"
echo ""

# Git 状态
echo "📦 Git 状态:"
cd /home/ubuntu/scm-hj
GIT_COMMITS=$(git log --oneline -1 | head -c 7)
echo "  提交: $GIT_COMMITS"
echo "  分支: $(git branch --show-current)"
echo ""

# 服务器状态
echo "🖥️  服务器状态:"
if curl -s http://localhost:3000/ > /dev/null 2>&1; then
    echo "  前端: ✅ 运行中 (http://localhost:3000/)"
else
    echo "  前端: ❌ 未运行"
fi
echo ""

# 文档状态
echo "📝 文档完成度:"
DOCS_TOTAL=$(find /home/ubuntu/scm-hj/docs -name "*.md" 2>/dev/null | wc -l)
DOCS_DONE=$(grep -l "✅ 完成" /home/ubuntu/scm-hj/docs/04_TECHNICAL/*.md 2>/dev/null | wc -l)
echo "  技术文档: $DOCS_DONE / $DOCS_TOTAL"
echo ""

# 测试状态
echo "🧪 测试状态:"
echo "  测试代码: 5 个测试类已编写"
echo "  执行状态: ⏳ 待运行"
echo ""

# 部署状态
echo "🚀 部署状态:"
echo "  本地: ✅ 已配置 (docker-compose.yml)"
echo "  生产: ⏳ 待部署"
echo ""

# Sprint 进度
echo "🏃 Sprint 进度:"
echo "  Sprint 1-5: 100% ✅"
echo "  Sprint 6-8: 100% ✅"
echo "  Sprint 9: 75% 🔄 (测试待运行)"
echo ""

echo "========================================"
echo "  下次更新: 完成任务后自动"
echo "  查看详情: cat PROJECT_STATUS.md"
echo "========================================"
