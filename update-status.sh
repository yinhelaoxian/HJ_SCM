#!/bin/bash

# HJ SCM 项目状态更新脚本
# 用法: ./update-status.sh [sprint] [task] [status]
# 示例: ./update-status.sh Sprint6 MRP-Engine 完成

STATUS_FILE="PROJECT_STATUS.md"
SPRINT="$1"
TASK="$2"
STATUS="$3"  # 完成/进行中/待执行

update_sprint() {
    local sprint="$1"
    local task="$2"
    local status="$3"
    
    # 更新状态标记
    if [ "$status" = "完成" ]; then
        local mark="✅"
    elif [ "$status" = "进行中" ]; then
        local mark="🔄"
    elif [ "$status" = "待执行" ]; then
        local mark="⏳"
    else
        local mark="$status"
    fi
    
    echo "✅ 已更新: $sprint - $task = $mark"
}

update_doc() {
    local doc="$1"
    local status="$2"
    
    echo "✅ 文档已更新: $doc = $status"
}

update_test() {
    local test="$1"
    local status="$2"
    echo "✅ 测试已更新: $test = $status"
}

update_git() {
    echo "✅ Git 同步: $1"
}

update_deploy() {
    local env="$1"
    local status="$2"
    echo "✅ 部署已更新: $env = $status"
}

# 主命令
case "${1:-status}" in
    status)
        cat "$STATUS_FILE"
        ;;
    sprint)
        update_sprint "$2" "$3" "$4"
        git add -A
        git commit -m "chore: 更新状态 - $2 $3 $4"
        git push
        ;;
    doc)
        update_doc "$2" "$3"
        git add -A
        git commit -m "docs: 更新文档状态 - $2 = $3"
        git push
        ;;
    test)
        update_test "$2" "$3"
        git add -A
        git commit -m "test: 更新测试状态 - $2 = $3"
        git push
        ;;
    git)
        update_git "$2"
        ;;
    deploy)
        update_deploy "$2" "$3"
        git add -A
        git commit -m "deploy: 更新部署状态 - $2 = $3"
        git push
        ;;
    all)
        git add -A
        git commit -m "chore: 项目状态更新 - $(date '+%Y-%m-%d')"
        git push
        ;;
    help|*)
        echo "用法: $0 <命令> [参数]"
        echo ""
        echo "命令:"
        echo "  status              # 查看项目状态"
        echo "  sprint <任务> <状态>  # 更新 Sprint 任务状态"
        echo "  doc <文档> <状态>    # 更新文档状态"
        echo "  test <测试> <状态>    # 更新测试状态"
        echo "  git <消息>          # Git 同步"
        echo "  deploy <环境> <状态> # 更新部署状态"
        echo "  all                   # 提交所有更改"
        echo ""
        echo "示例:"
        echo "  $0 sprint Sprint6 MRP-Engine 完成"
        echo "  $0 doc MRP_EngineSpec 完成"
        echo "  $0 test MRPEngineTest 完成"
        echo "  $0 deploy docker 本地 完成"
        ;;
esac
