#!/bin/bash

# HJ SCM 快速启动脚本
# 用法: ./start-dev.sh [frontend|backend|all]

set -e

case "${1:-all}" in
  frontend)
    echo "🚀 启动前端开发服务器..."
    docker compose up -d frontend
    echo "✅ 前端已启动: http://localhost:3000"
    ;;
    
  backend)
    echo "🐘 启动 PostgreSQL + Redis + 后端..."
    docker compose up -d postgres redis backend
    echo "✅ 后端已启动: http://localhost:8080"
    ;;
    
  all|"")
    echo "🚀 启动完整开发环境..."
    docker compose up -d
    echo ""
    echo "✅ 服务已启动:"
    echo "   - 前端: http://localhost:3000"
    echo "   - 后端: http://localhost:8080"
    echo "   - PostgreSQL: localhost:5432"
    echo "   - Redis: localhost:6379"
    ;;
    
  stop)
    echo "🛑 停止所有服务..."
    docker compose down
    echo "✅ 所有服务已停止"
    ;;
    
  logs)
    docker compose logs -f ${2:-}
    ;;
    
  test)
    echo "🧪 运行后端测试..."
    docker compose exec backend mvn clean test
    ;;
    
  sh)
    docker compose exec ${2:-backend} sh
    ;;
    
  *)
    echo "用法: ./start-dev.sh [frontend|backend|all|stop|logs|test|sh]"
    echo ""
    echo "命令:"
    echo "  frontend - 仅启动前端 (端口3000)"
    echo "  backend - 启动数据库+Redis+后端"
    echo "  all     - 启动全部服务（默认）"
    echo "  stop    - 停止所有服务"
    echo "  logs    - 查看日志"
    echo "  test    - 运行后端测试"
    echo "  sh      - 进入后端容器"
    ;;
esac
