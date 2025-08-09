#!/bin/bash

# River-AD 开发环境启动脚本
set -e

echo "🔧 启动 River-AD 开发环境..."

# 检查端口占用
check_port() {
    if lsof -ti:$1 > /dev/null 2>&1; then
        echo "⚠️  端口 $1 已被占用，正在释放..."
        lsof -ti:$1 | xargs kill -9 || true
        sleep 2
    fi
}

# 检查关键端口
check_port 8080
check_port 3000

echo "🖥️  启动后端服务..."
cd /mnt/e/work/river-ad
nohup java FullBackend.java > backend.log 2>&1 &
BACKEND_PID=$!

# 等待后端启动
echo "⏳ 等待后端服务就绪..."
for i in {1..30}; do
    if curl -s http://localhost:8080/api/health > /dev/null 2>&1; then
        echo "✅ 后端服务已就绪"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ 后端服务启动超时"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    sleep 2
done

echo "🌐 启动前端服务..."
cd /mnt/e/work/river-ad/frontend
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# 等待前端启动
echo "⏳ 等待前端服务就绪..."
for i in {1..60}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ 前端服务已就绪"
        break
    fi
    if [ $i -eq 60 ]; then
        echo "❌ 前端服务启动超时，但后端仍可用"
        break
    fi
    sleep 3
done

echo ""
echo "🎉 River-AD 开发环境已启动！"
echo ""
echo "📝 服务地址:"
echo "   后端API:  http://localhost:8080/api"
echo "   前端应用: http://localhost:3000"
echo ""
echo "🔧 测试页面:"
echo "   API健康:  http://localhost:8080/api/health"
echo "   完整演示: http://localhost:3000/full-demo"
echo "   认证测试: http://localhost:3000/auth-test"
echo "   联盟追踪: http://localhost:3000/affiliate-test"
echo "   管理后台: http://localhost:3000/admin/login"
echo ""
echo "📊 进程ID:"
echo "   后端PID: $BACKEND_PID"
echo "   前端PID: $FRONTEND_PID"
echo ""
echo "📋 停止服务:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# 显示后端健康状态
echo "🏥 后端健康检查:"
curl -s http://localhost:8080/api/health 2>/dev/null | head -3 || echo "后端未完全就绪"