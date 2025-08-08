#!/bin/bash

# River-AD Development Setup Script
# 独立开发者专用的一键开发环境启动脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${PURPLE}"
echo "██████╗ ██╗██╗   ██╗███████╗██████╗       █████╗ ██████╗ "
echo "██╔══██╗██║██║   ██║██╔════╝██╔══██╗     ██╔══██╗██╔══██╗"
echo "██████╔╝██║██║   ██║█████╗  ██████╔╝     ███████║██║  ██║"
echo "██╔══██╗██║╚██╗ ██╔╝██╔══╝  ██╔══██╗     ██╔══██║██║  ██║"
echo "██║  ██║██║ ╚████╔╝ ███████╗██║  ██║     ██║  ██║██████╔╝"
echo "╚═╝  ╚═╝╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝     ╚═╝  ╚═╝╚═════╝ "
echo -e "${NC}"
echo -e "${CYAN}🚀 River-AD Development Environment Setup${NC}"
echo -e "${CYAN}独立开发者专用，让我们创造一个盈利的deals网站！${NC}"
echo ""

# 函数定义
log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查必要的工具
check_requirements() {
    log_info "检查开发环境依赖..."
    
    # 检查Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装，请先安装Docker"
        exit 1
    fi
    
    # 检查Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose未安装，请先安装Docker Compose"
        exit 1
    fi
    
    # 检查Java (用于本地开发)
    if ! command -v java &> /dev/null; then
        log_warning "Java未安装，建议安装JDK 17用于本地开发"
    fi
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        log_warning "Node.js未安装，建议安装Node.js 18+用于前端开发"
    fi
    
    log_success "依赖检查完成"
}

# 创建环境变量文件
setup_env() {
    log_info "设置环境变量..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        log_success "已创建 .env 文件，请根据需要修改配置"
    else
        log_info ".env 文件已存在"
    fi
}

# 创建必要的目录
create_directories() {
    log_info "创建项目目录结构..."
    
    # 创建后端目录结构
    mkdir -p backend/{src/{main/{java/com/riverad/{config,controller,dto,entity,repository,service,util},resources/{static,templates,i18n}},test/java/com/riverad}
    
    # 创建前端目录结构
    mkdir -p frontend/{components/{common,deals,user,layout},pages/{api,deals,user},public/{images,icons},styles,utils,hooks,types,i18n/{locales/{en,zh}}}
    
    # 创建其他必要目录
    mkdir -p {logs,uploads,docs,scripts,monitoring}
    
    log_success "项目目录结构创建完成"
}

# 启动数据库服务
start_databases() {
    log_info "启动数据库服务 (PostgreSQL + Redis)..."
    
    # 只启动数据库相关服务
    docker-compose up -d postgres redis
    
    # 等待数据库启动
    log_info "等待数据库启动..."
    sleep 10
    
    # 检查数据库连接
    if docker-compose exec postgres pg_isready -U riverad_user -d riverad; then
        log_success "PostgreSQL 数据库已就绪"
    else
        log_error "PostgreSQL 数据库启动失败"
        return 1
    fi
    
    # 检查Redis连接
    if docker-compose exec redis redis-cli ping | grep -q PONG; then
        log_success "Redis 缓存已就绪"
    else
        log_error "Redis 缓存启动失败"
        return 1
    fi
}

# 初始化数据库
init_database() {
    log_info "初始化数据库表结构和基础数据..."
    
    # 等待数据库完全启动
    sleep 5
    
    # 执行数据库初始化脚本会自动运行 (通过docker-entrypoint-initdb.d)
    log_success "数据库初始化完成"
}

# 显示开发信息
show_dev_info() {
    echo ""
    echo -e "${GREEN}🎉 开发环境设置完成！${NC}"
    echo ""
    echo -e "${CYAN}📋 开发信息:${NC}"
    echo -e "   • 数据库: ${YELLOW}PostgreSQL (localhost:5432)${NC}"
    echo -e "   • 缓存: ${YELLOW}Redis (localhost:6379)${NC}"
    echo -e "   • 数据库名: ${YELLOW}riverad${NC}"
    echo -e "   • 用户名: ${YELLOW}riverad_user${NC}"
    echo ""
    echo -e "${CYAN}🚀 下一步操作:${NC}"
    echo -e "   1. ${BLUE}cd backend && ./mvnw spring-boot:run${NC} - 启动后端服务"
    echo -e "   2. ${BLUE}cd frontend && npm run dev${NC} - 启动前端开发服务器"
    echo -e "   3. ${BLUE}访问 http://localhost:3000${NC} - 查看应用"
    echo ""
    echo -e "${CYAN}🛠️  常用命令:${NC}"
    echo -e "   • ${BLUE}docker-compose logs -f postgres${NC} - 查看数据库日志"
    echo -e "   • ${BLUE}docker-compose logs -f redis${NC} - 查看Redis日志"
    echo -e "   • ${BLUE}docker-compose down${NC} - 停止所有服务"
    echo -e "   • ${BLUE}docker-compose up -d${NC} - 启动所有服务"
    echo ""
    echo -e "${GREEN}💰 让我们开始构建你的盈利deals网站！${NC}"
}

# 主流程
main() {
    echo -e "${BLUE}开始设置 River-AD 开发环境...${NC}"
    echo ""
    
    check_requirements
    setup_env
    create_directories
    start_databases
    init_database
    show_dev_info
}

# 命令行参数处理
case "${1:-setup}" in
    setup)
        main
        ;;
    start)
        log_info "启动开发环境..."
        docker-compose up -d postgres redis
        log_success "开发环境已启动"
        ;;
    stop)
        log_info "停止开发环境..."
        docker-compose down
        log_success "开发环境已停止"
        ;;
    restart)
        log_info "重启开发环境..."
        docker-compose restart postgres redis
        log_success "开发环境已重启"
        ;;
    logs)
        docker-compose logs -f postgres redis
        ;;
    status)
        docker-compose ps
        ;;
    clean)
        log_warning "清理开发环境 (将删除所有数据)..."
        read -p "确定要继续吗? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v --remove-orphans
            docker system prune -f
            log_success "开发环境已清理"
        else
            log_info "取消清理操作"
        fi
        ;;
    help)
        echo -e "${CYAN}River-AD 开发环境管理脚本${NC}"
        echo ""
        echo "用法: $0 [command]"
        echo ""
        echo "命令:"
        echo "  setup     - 初始化开发环境 (默认)"
        echo "  start     - 启动数据库服务"
        echo "  stop      - 停止所有服务"  
        echo "  restart   - 重启数据库服务"
        echo "  logs      - 查看服务日志"
        echo "  status    - 查看服务状态"
        echo "  clean     - 清理所有数据和容器"
        echo "  help      - 显示此帮助信息"
        ;;
    *)
        log_error "未知命令: $1"
        log_info "使用 '$0 help' 查看可用命令"
        exit 1
        ;;
esac