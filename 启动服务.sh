#!/bin/bash

echo "🌊 River-AD 服务启动脚本"
echo "================================"

# 检查Java是否安装
if ! command -v java &> /dev/null; then
    echo "❌ Java未安装，请先安装Java 17+"
    exit 1
fi

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3未安装，请先安装Python3"
    exit 1
fi

echo "📋 正在启动服务..."

# 启动后端服务
echo "🚀 启动Java后端服务 (端口8080)..."
cd /mnt/e/work/river-ad
java FullBackend.java > backend.log 2>&1 &
BACKEND_PID=$!
echo "   后端PID: $BACKEND_PID"

# 等待后端启动
sleep 5

# 检查后端健康状态
echo "🔍 检查后端健康状态..."
if curl -s http://localhost:8080/api/health > /dev/null; then
    echo "   ✅ 后端服务正常"
else
    echo "   ❌ 后端服务启动失败"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# 启动前端服务
echo "🚀 启动React前端服务 (端口3001)..."
cd /mnt/e/work/river-ad/react-demo
python3 -m http.server 3001 > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   前端PID: $FRONTEND_PID"

# 等待前端启动
sleep 3

# 检查前端服务
echo "🔍 检查前端服务状态..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "   ✅ 前端服务正常"
else
    echo "   ❌ 前端服务启动失败"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 所有服务启动成功！"
echo "================================"
echo "📱 用户访问地址:"
echo "   主页面: http://localhost:3001"
echo "   API接口: http://localhost:8080/api/deals"
echo ""
echo "📊 服务状态:"
echo "   后端服务: PID $BACKEND_PID (Java)"
echo "   前端服务: PID $FRONTEND_PID (Python HTTP)"
echo ""
echo "🛑 停止服务命令:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📋 日志查看:"
echo "   后端日志: tail -f /mnt/e/work/river-ad/backend.log"
echo "   前端日志: tail -f /mnt/e/work/river-ad/react-demo/frontend.log"

# 保存PID到文件，方便后续停止
echo "$BACKEND_PID" > /tmp/riverad_backend.pid
echo "$FRONTEND_PID" > /tmp/riverad_frontend.pid

echo ""
echo "✨ 系统已就绪，请访问 http://localhost:3001 体验完整功能！"