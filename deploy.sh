#!/bin/bash

# River-AD 部署脚本
set -e

echo "🚀 开始部署 River-AD 应用..."

# 检查 Docker 和 Docker Compose
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 设置环境变量
ENVIRONMENT=${1:-production}
echo "📝 使用环境: $ENVIRONMENT"

# 复制对应的环境配置文件
if [ -f ".env.$ENVIRONMENT" ]; then
    cp ".env.$ENVIRONMENT" .env
    echo "✅ 已加载 $ENVIRONMENT 环境配置"
else
    echo "⚠️  未找到 .env.$ENVIRONMENT 文件，使用默认配置"
fi

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down --remove-orphans

# 清理旧的镜像（可选）
if [ "$2" = "--clean" ]; then
    echo "🧹 清理旧镜像..."
    docker system prune -f
    docker-compose build --no-cache
else
    echo "🔨 构建应用镜像..."
    docker-compose build
fi

# 启动数据库服务
echo "💾 启动数据库服务..."
docker-compose up -d postgres redis

# 等待数据库启动
echo "⏳ 等待数据库就绪..."
sleep 10

# 启动后端服务
echo "🖥️  启动后端服务..."
docker-compose up -d backend

# 等待后端启动
echo "⏳ 等待后端服务就绪..."
sleep 15

# 检查后端健康状态
echo "🔍 检查后端健康状态..."
if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    echo "✅ 后端服务正常运行"
else
    echo "❌ 后端服务启动失败，请检查日志"
    docker-compose logs backend
    exit 1
fi

# 启动前端服务
echo "🌐 启动前端服务..."
docker-compose up -d frontend

# 等待前端启动
echo "⏳ 等待前端服务就绪..."
sleep 10

# 检查前端健康状态
echo "🔍 检查前端健康状态..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ 前端服务正常运行"
else
    echo "❌ 前端服务启动失败，请检查日志"
    docker-compose logs frontend
    exit 1
fi

# 显示服务状态
echo "📊 服务状态:"
docker-compose ps

echo ""
echo "🎉 River-AD 部署完成！"
echo ""
echo "📝 访问地址:"
echo "   前端应用: http://localhost:3000"
echo "   后端API:  http://localhost:8080/api"
echo "   健康检查: http://localhost:8080/api/health"
echo ""
echo "📋 管理命令:"
echo "   查看日志: docker-compose logs [service]"
echo "   重启服务: docker-compose restart [service]" 
echo "   停止服务: docker-compose down"
echo ""
echo "🔧 测试页面:"
echo "   完整演示: http://localhost:3000/full-demo"
echo "   认证测试: http://localhost:3000/auth-test"
echo "   联盟追踪: http://localhost:3000/affiliate-test"
echo "   管理后台: http://localhost:3000/admin/login"
echo ""

# 运行基础健康检查
echo "🏥 运行健康检查..."
echo "后端API健康状态:"
curl -s http://localhost:8080/api/health | head -3
echo ""

echo "✅ 部署完成！River-AD 正在运行中..."