#!/bin/bash

# HJ_SCM 可靠启动脚本 (支持systemd和nohup两种方式)
# 用法: ./hj-run.sh start|stop|status|restart|enable|auto-commit

PROJECT_DIR="/home/ubuntu/.openclaw/workspace/HJ_SCM"
SERVICE_NAME="hj-scm"
AUTO_COMMIT=true  # 是否自动提交代码

cd "$PROJECT_DIR"

# 自动提交函数
auto_commit() {
    if [ "$AUTO_COMMIT" != "true" ]; then
        return
    fi
    
    # 检查是否有未提交的变更
    if git diff --quiet 2>/dev/null || git diff --cached --quiet 2>/dev/null; then
        echo "📦 检测到代码变更，自动提交..."
        git add -A
        # 生成提交信息
        MSG="chore: 自动提交 $(date '+%Y-%m-%d %H:%M')"
        git commit -m "$MSG" 2>/dev/null
        
        # 检查隧道是否可用
        if bash ~/tunnel_ec2.sh 2>/dev/null; then
            echo "🚀 推送到GitHub..."
            git push origin main 2>/dev/null
            echo "✅ 已推送到GitHub"
        else
            echo "⚠️  SSH隧道不可用，推送延迟"
        fi
    fi
}

case "${1:-start}" in
  start)
    # 启动前自动提交
    echo "🔍 检查代码变更..."
    auto_commit
    
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
    # 停止前自动提交
    auto_commit
    
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
    
  commit)
    # 手动触发提交
    echo "📦 手动提交代码..."
    git add -A
    MSG="${2:-manual commit $(date '+%Y-%m-%d %H:%M')}"
    git commit -m "$MSG"
    echo "✅ 已提交"
    ;;
    
  push)
    # 手动推送到GitHub
    echo "🚀 推送到GitHub..."
    if bash ~/tunnel_ec2.sh 2>/dev/null; then
      git push origin main
      echo "✅ 已推送"
    else
      echo "❌ SSH隧道不可用"
    fi
    ;;
    
  auto)
    # 开启/关闭自动提交
    if [ "$2" = "off" ]; then
      AUTO_COMMIT=false
      echo "⚠️  已关闭自动提交"
    else
      AUTO_COMMIT=true
      echo "✅ 已开启自动提交"
    fi
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
    echo "用法: ./hj-run.sh [start|stop|status|restart|commit|push|auto|enable|disable|install|log]"
    echo ""
    echo "命令:"
    echo "  start   - 启动服务（自动提交代码）"
    echo "  stop    - 停止服务（自动提交代码）"
    echo "  status  - 查看服务状态"
    echo "  restart - 重启服务"
    echo "  commit  - 手动提交代码"
    echo "  push    - 推送到GitHub"
    echo "  auto off - 关闭自动提交"
    echo "  enable  - 开机自启"
    echo "  install - 安装systemd服务"
    ;;
esac
