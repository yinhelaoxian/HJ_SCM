#!/bin/bash

# HJ_SCM 快速启动脚本 (直接npm方式)
# 用法: ./hj-scm.sh [dev|build|test|status]

PROJECT_DIR="/home/ubuntu/.openclaw/workspace/HJ_SCM"

cd "$PROJECT_DIR"

case "${1:-dev}" in
  dev)
    echo "🚀 启动HJ_SCM开发服务器..."
    npm run dev
    ;;
    
  build)
    echo "📦 构建项目..."
    npm run build
    ;;
    
  test)
    echo "🧪 运行测试..."
    npm test
    ;;
    
  status)
    echo "📊 服务状态:"
    lsof -i :3000 | head -5
    ps aux | grep vite | grep -v grep | head -3
    ;;
    
  stop)
    echo "🛑 停止服务..."
    pkill -f vite
    echo "✅ 已停止"
    ;;
    
  restart)
    echo "🔄 重启服务..."
    pkill -f vite
    sleep 2
    npm run dev &
    ;;
    
  *)
    echo "用法: ./hj-scm.sh [dev|build|test|status|stop|restart]"
    ;;
esac
