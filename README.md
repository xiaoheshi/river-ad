# River-AD 🌊
> 全球优惠，一键直达 | Global Deals, One Click Away

## 项目简介

River-AD 是一个中英双语的海外优惠聚合平台，类似于 deals.com/ie，专为全球华人用户和英语用户提供精选的海外购物优惠。通过 CPS（按销售付费）联盟营销模式实现盈利。

## ✨ 主要特性

- 🌏 **中英双语支持** - 为全球用户提供本地化体验
- 💰 **CPS联盟跟踪** - 智能联盟链接跟踪和佣金管理
- 🔍 **智能搜索** - 多维度优惠搜索和筛选
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🚀 **高性能架构** - 基于现代技术栈构建
- 🔒 **安全可靠** - 完整的安全防护和数据保护

## 🛠️ 技术栈

### 后端
- **Java 17** - 现代Java开发
- **Spring Boot 3.2** - 企业级应用框架
- **PostgreSQL 15** - 可靠的关系型数据库
- **Redis 7** - 高性能缓存
- **Maven** - 项目管理工具

### 前端  
- **React 18** - 现代前端框架
- **Next.js 14** - 全栈React框架
- **TypeScript** - 类型安全的JavaScript
- **Ant Design** - 企业级UI组件库
- **TailwindCSS** - 实用优先的CSS框架

### 基础设施
- **Docker & Docker Compose** - 容器化部署
- **PostgreSQL** - 主数据存储
- **Redis** - 缓存和会话存储
- **Nginx** - 反向代理（生产环境）

## 🚀 快速开始

### 环境要求
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Git

### 开发环境搭建

1. **克隆项目**
```bash
git clone https://github.com/xiaoheshi/river-ad.git
cd river-ad
```

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，修改相关配置
```

3. **启动开发环境**
```bash
cd docker
docker-compose up -d
```

4. **查看服务状态**
```bash
docker-compose ps
```

### 服务地址

- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:8080/api
- **数据库**: localhost:5432
- **Redis**: localhost:6379

### 单独开发

#### 后端开发
```bash
cd backend
mvn spring-boot:run
```

#### 前端开发
```bash
cd frontend
npm install
npm run dev
```

## 📁 项目结构

```
river-ad/
├── backend/                 # Spring Boot 后端
│   ├── src/main/java/       # Java 源代码
│   ├── src/main/resources/  # 配置文件和资源
│   ├── src/test/           # 测试代码
│   └── pom.xml             # Maven 配置
├── frontend/               # Next.js 前端
│   ├── src/                # 源代码
│   │   ├── components/     # React 组件
│   │   ├── pages/          # 页面组件
│   │   ├── hooks/          # 自定义 Hooks
│   │   ├── services/       # API 服务
│   │   ├── store/          # 状态管理
│   │   └── utils/          # 工具函数
│   ├── public/             # 静态资源
│   └── package.json        # Node.js 配置
├── docker/                 # Docker 配置
│   ├── docker-compose.yml  # 开发环境
│   └── init-scripts/       # 数据库初始化
├── docs/                   # 项目文档
├── scripts/                # 部署脚本
└── .github/                # GitHub Actions
```

## 🗄️ 数据库结构

### 核心表
- `users` - 用户信息
- `deals` - 优惠信息
- `stores` - 商店信息  
- `categories` - 商品分类
- `affiliate_clicks` - 联盟点击跟踪
- `user_favorites` - 用户收藏

## 🔧 开发指南

### 代码规范
- **Java**: Google Java Style Guide
- **TypeScript**: ESLint + Prettier
- **提交规范**: Conventional Commits

### 分支管理
- `main` - 生产分支
- `develop` - 开发分支
- `feature/*` - 功能分支
- `hotfix/*` - 热修复分支

### 提交流程
```bash
# 创建功能分支
git checkout -b feature/优惠搜索功能

# 提交代码
git add .
git commit -m "feat: 添加优惠搜索功能"

# 推送分支
git push origin feature/优惠搜索功能
```

## 🧪 测试

### 后端测试
```bash
cd backend
mvn test
```

### 前端测试
```bash
cd frontend
npm run test
```

### 端到端测试
```bash
npm run test:e2e
```

## 📈 部署

### 开发环境
```bash
docker-compose up -d
```

### 生产环境
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📊 监控和日志

- **应用监控**: Spring Boot Actuator
- **日志管理**: Logback + ELK Stack
- **性能监控**: Micrometer + Prometheus

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 推送到分支
5. 创建 Pull Request

## 📝 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 📞 联系方式

- **项目维护者**: xiaoheshi
- **GitHub**: https://github.com/xiaoheshi
- **Issues**: https://github.com/xiaoheshi/river-ad/issues

## 🎯 路线图

### v1.0.0 (当前开发中)
- [x] 项目基础架构
- [x] 用户认证系统
- [ ] 优惠信息管理
- [ ] 搜索和筛选功能
- [ ] 联盟跟踪系统

### v1.1.0 (计划中)
- [ ] 用户个人中心
- [ ] 收藏和愿望清单
- [ ] 邮件通知系统
- [ ] 移动端优化

### v1.2.0 (规划中)
- [ ] 商家管理后台
- [ ] 数据分析面板
- [ ] API 开放平台
- [ ] 多语言扩展

## 🌟 支持项目

如果这个项目对你有帮助，请给个 ⭐️ Star！

## 📚 相关文档

- [技术实现指南](./技术实现指南.md)
- [部署指南](./docs/deployment.md)  
- [API 文档](./docs/api.md)
- [开发规范](./docs/development.md)

---

**让我们一起构建全球最好的优惠聚合平台！** 🚀