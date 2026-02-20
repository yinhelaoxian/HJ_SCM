#!/bin/bash

# HJ_SCM 可靠启动脚本 (支持systemd和nohup两种方式)
# 用法: ./hj-run.sh start|stop|status|restart|enable

PROJECT_DIR="/home/ubuntu/.openclaw/workspace/HJ_SCM"
SERVICE_NAME="hj-scm"

cd "$PROJECT_DIR"

case "${1:-start}" in
  start)
    # 检查是否可以用systemd
    if command -v systemctl &> /dev/null; then
      echo "🚀 使用systemd启动服务..."
      sudo systemctl start $SERVICE_NAME
      sleep 2
      STATUS=$(sudo systemctl is-active $SERVICE_NAME 2>/dev/null)
      if [ "$STATUS" = "active" ]; then
        echo "✅ 服务已启动 (systemd)"
        sudo systemctl status $SERVICE_NAME --no-pager | head -5
      else
        echo "❌ systemd启动失败，回退到nohup..."
        nohup npm run dev > vite.log 2>&1 &
        echo $! > vite.pid
        sleep 3
        echo "✅ 服务已启动 (nohup)"
      fi
    else
      echo "🚀 使用nohup启动服务..."
      nohup npm run dev > vite.log 2>&1 &
      echo $! > vite.pid
      sleep 3
      echo "✅ 服务已启动"
    fi
    ;;
    
  stop)
    if command -v systemctl &> /dev/null && sudo systemctl is-active --quiet $SERVICE_NAME 2>/dev/null; then
      echo "🛑 停止服务 (systemd)..."
      sudo systemctl stop $SERVICE_NAME
      sudo systemctl status $SERVICE_NAME --no-pager | tail -1
    else
      if [ -f "vite.pid" ]; then
        PID=$(cat vite.pid)
        if ps -p $PID > /dev/null 2>&1; then
          echo "🛑 停止服务 (PID: $PID)..."
          kill $PID
          rm -f vite.pid
          echo "✅ 已停止"
        else
          echo "⚠️  服务未运行"
          rm -f vite.pid
        fi
      else
        echo "⚠️  无运行记录"
      fi
    fi
    ;;
    
  status)
    if command -v systemctl &> /dev/null && sudo systemctl is-active --quiet $SERVICE_NAME 2>/dev/null; then
      echo "✅ 服务运行中 (systemd)"
      sudo systemctl status $SERVICE_NAME --no-pager | head -5
    elif [ -f "vite.pid" ]; then
      PID=$(cat vite.pid)
      if ps -p $PID > /dev/null 2>&1; then
        echo "✅ 服务运行中 (PID: $PID)"
        echo "   地址: http://localhost:3000"
      else
        echo "❌ 服务已停止"
        rm -f vite.pid
      fi
    else
      echo "⚠️  服务未运行"
    fi
    ;;
    
  restart)
    $0 stop
    sleep 2
    $0 start
    ;;
    
  enable)
    if command -v systemctl &> /dev/null; then
      echo "🔧 启用开机自启..."
      sudo systemctl enable $SERVICE_NAME
      echo "✅ 已启用开机自启"
    else
      echo "⚠️  systemd不可用"
    fi
    ;;
    
  disable)
    if command -v systemctl &> /dev/null; then
      echo "🔧 禁用开机自启..."
      sudo systemctl disable $SERVICE_NAME
      echo "✅ 已禁用开机自启"
    else
      echo "⚠️  systemd不可用"
    fi
    ;;
    
  install)
    echo "📦 安装systemd服务..."
    sudo cp $PROJECT_DIR/hj-scm.service /etc/systemd/system/
    sudo systemctl daemon-reload
    echo "✅ 服务已安装"
    echo ""
    echo "可用命令:"
    echo "  ./hj-run.sh start   - 启动服务"
    echo "  ./hj-run.sh stop    - 停止服务"
    echo "  ./hj-run.sh status  - 查看状态"
    echo "  ./hj-run.sh enable  - 开机自启"
    ;;
    
  log)
    tail -f vite.log
    ;;
    
  *)
    echo "用法: ./hj-run.sh [start|stop|status|restart|enable|disable|install|log]"
    ;;
esac
