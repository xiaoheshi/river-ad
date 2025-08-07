# Sprint 1: 基础建设执行计划
## 第1-14天: 独立开发者MVP建设

## 🏁 冲刺目标

**使命**: 作为独立开发者，建立可扩展的优惠平台基础
**座右铭**: "小步快跑，质量优先！"

### 第1个Sprint成功标准（个人开发现实版）
- ✅ 完成本地开发环境搭建
- ✅ 核心Spring Boot应用运行
- ✅ 数据库架构实现并测试  
- ✅ 系统中的前20个手工优惠样本
- ✅ 基础API端点运行和测试
- ✅ 简单的前端展示页面
- ✅ Docker本地部署成功

## 📅 每日执行计划（14天版本）

### **第1-2天: 环境搭建与基础配置**
*"好的开始是成功的一半！"*

#### 第1天任务
**上午 (9:00 AM - 12:00 PM)**
```bash
# 1. 创建项目结构
mkdir -p river-ad/{backend,frontend,docker,docs,scripts}
cd river-ad

# 2. 初始化Spring Boot项目
spring init --dependencies=web,data-jpa,security,redis,validation,actuator \
  --groupId=com.riverad --artifactId=backend \
  --name="River-AD Backend" --description="海外优惠平台后端服务" \
  --package-name=com.riverad backend

# 3. 设置Git仓库
git init
git add .
git commit -m "initial: 项目初始化"
```

**下午 (1:00 PM - 6:00 PM)**
- [ ] Java 17 JDK 安装并配置
- [ ] Maven 3.8+ 配置
- [ ] IDE (IntelliJ IDEA) 环境配置
- [ ] Docker & Docker Compose 安装

#### 第2天任务
**全天: 数据库环境搭建**
```sql
-- 创建数据库和用户
CREATE DATABASE riverad;
CREATE USER riverad WITH ENCRYPTED PASSWORD 'riverad123';
GRANT ALL PRIVILEGES ON DATABASE riverad TO riverad;
```

```yaml
# application.yml 基础配置
spring:
  application:
    name: river-ad-backend
  
  datasource:
    url: jdbc:postgresql://localhost:5432/riverad
    username: riverad
    password: riverad123
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
  
  redis:
    host: localhost
    port: 6379

server:
  port: 8080
```

**第2天结束检查**:
- [ ] PostgreSQL 15+ 数据库服务器运行
- [ ] Redis 7+ 缓存服务器运行
- [ ] Spring Boot应用能够启动
- [ ] 数据库连接正常

---

### **第3-5天: 核心实体模型开发**
*"数据模型决定了应用的骨架！"*

#### 第3天: 用户实体
```java
// src/main/java/com/riverad/entity/User.java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name") 
    private String lastName;
    
    @Column(name = "preferred_language")
    private String preferredLanguage = "en";
    
    @Column(name = "preferred_currency")
    private String preferredCurrency = "USD";
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    // 构造函数、getter、setter...
}
```

#### 第4天: 优惠实体
```java
// src/main/java/com/riverad/entity/Deal.java
@Entity
@Table(name = "deals")
public class Deal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "title_en", nullable = false, length = 500)
    private String titleEn;
    
    @Column(name = "title_zh", length = 500)
    private String titleZh;
    
    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;
    
    @Column(name = "description_zh", columnDefinition = "TEXT") 
    private String descriptionZh;
    
    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;
    
    @Column(name = "sale_price", precision = 10, scale = 2)
    private BigDecimal salePrice;
    
    @Column(length = 3)
    private String currency = "USD";
    
    @Column(name = "store_name")
    private String storeName;
    
    private String category;
    
    @Column(name = "affiliate_url", nullable = false, columnDefinition = "TEXT")
    private String affiliateUrl;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "is_featured")
    private Boolean isFeatured = false;
    
    @Column(name = "click_count")
    private Integer clickCount = 0;
    
    // 更多字段和方法...
}
```

#### 第5天: Repository层
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}

@Repository
public interface DealRepository extends JpaRepository<Deal, Long>, JpaSpecificationExecutor<Deal> {
    
    @Query("SELECT d FROM Deal d WHERE d.isActive = true ORDER BY d.createdAt DESC")
    Page<Deal> findActiveDeals(Pageable pageable);
    
    @Query("SELECT d FROM Deal d WHERE d.isActive = true AND d.isFeatured = true")
    List<Deal> findFeaturedDeals();
    
    @Modifying
    @Query("UPDATE Deal d SET d.clickCount = d.clickCount + 1 WHERE d.id = :dealId")
    void incrementClickCount(@Param("dealId") Long dealId);
}
```

**第3-5天完成清单:**
- [ ] 所有核心实体类创建完成
- [ ] Repository接口定义完成
- [ ] 数据库表自动创建成功
- [ ] 基础CRUD操作测试通过

---

### **第6-9天: REST API核心端点开发**
*"API是外界连接我们应用的桥梁！"*

#### 第6天: DTO和基础响应类
```java
// src/main/java/com/riverad/dto/DealDto.java
public class DealDto {
    private Long id;
    private String title;
    private String description;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private String currency;
    private Integer discountPercentage;
    private String storeName;
    private String category;
    private String imageUrl;
    private String couponCode;
    private LocalDateTime endDate;
    
    // getters and setters...
}

// src/main/java/com/riverad/dto/PagedResponse.java
public class PagedResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean last;
    
    // constructors, getters and setters...
}
```

#### 第7天: 优惠控制器
```java
@RestController
@RequestMapping("/api/v1/deals")
@CrossOrigin(origins = "*")
public class DealController {

    @Autowired
    private DealService dealService;

    @GetMapping
    public ResponseEntity<PagedResponse<DealDto>> getDeals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestHeader(value = "Accept-Language", defaultValue = "en") String language) {
        
        PagedResponse<DealDto> deals = dealService.getDeals(
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")),
            search, language
        );
        
        return ResponseEntity.ok(deals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DealDto> getDeal(
            @PathVariable Long id,
            @RequestHeader(value = "Accept-Language", defaultValue = "en") String language) {
        
        DealDto deal = dealService.getDeal(id, language);
        return ResponseEntity.ok(deal);
    }

    @PostMapping("/{id}/click")
    public ResponseEntity<Map<String, String>> trackClick(@PathVariable Long id) {
        String trackingUrl = dealService.trackClick(id);
        return ResponseEntity.ok(Map.of("url", trackingUrl));
    }
}
```

#### 第8天: 优惠服务实现
```java
@Service
@Transactional
public class DealService {

    @Autowired
    private DealRepository dealRepository;

    public PagedResponse<DealDto> getDeals(Pageable pageable, String search, String language) {
        Specification<Deal> spec = Specification.where(null);
        spec = spec.and((root, query, cb) -> cb.equal(root.get("isActive"), true));
        
        if (StringUtils.hasText(search)) {
            spec = spec.and((root, query, cb) -> {
                String pattern = "%" + search.toLowerCase() + "%";
                return cb.or(
                    cb.like(cb.lower(root.get("titleEn")), pattern),
                    cb.like(cb.lower(root.get("titleZh")), pattern)
                );
            });
        }
        
        Page<Deal> deals = dealRepository.findAll(spec, pageable);
        
        return new PagedResponse<>(
            deals.getContent().stream()
                .map(deal -> convertToDto(deal, language))
                .collect(Collectors.toList()),
            deals.getNumber(),
            deals.getSize(), 
            deals.getTotalElements(),
            deals.getTotalPages(),
            deals.isLast()
        );
    }

    public DealDto convertToDto(Deal deal, String language) {
        DealDto dto = new DealDto();
        dto.setId(deal.getId());
        
        // 根据语言设置标题和描述
        if ("zh".equals(language) && StringUtils.hasText(deal.getTitleZh())) {
            dto.setTitle(deal.getTitleZh());
            dto.setDescription(deal.getDescriptionZh());
        } else {
            dto.setTitle(deal.getTitleEn());
            dto.setDescription(deal.getDescriptionEn());
        }
        
        dto.setOriginalPrice(deal.getOriginalPrice());
        dto.setSalePrice(deal.getSalePrice());
        dto.setCurrency(deal.getCurrency());
        dto.setStoreName(deal.getStoreName());
        dto.setCategory(deal.getCategory());
        dto.setImageUrl(deal.getImageUrl());
        
        // 计算折扣百分比
        if (deal.getOriginalPrice() != null && deal.getSalePrice() != null) {
            BigDecimal discount = deal.getOriginalPrice()
                .subtract(deal.getSalePrice())
                .divide(deal.getOriginalPrice(), 2, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));
            dto.setDiscountPercentage(discount.intValue());
        }
        
        return dto;
    }

    public String trackClick(Long dealId) {
        Deal deal = dealRepository.findById(dealId)
            .orElseThrow(() -> new ResourceNotFoundException("Deal not found: " + dealId));
        
        // 更新点击计数
        dealRepository.incrementClickCount(dealId);
        
        // 返回跟踪URL（后期可以加入更复杂的跟踪逻辑）
        return deal.getAffiliateUrl();
    }
}
```

#### 第9天: API测试
```bash
# 测试获取优惠列表
curl -X GET "http://localhost:8080/api/v1/deals?page=0&size=10" \
  -H "Accept-Language: zh"

# 测试获取单个优惠
curl -X GET "http://localhost:8080/api/v1/deals/1" \
  -H "Accept-Language: en"

# 测试搜索功能
curl -X GET "http://localhost:8080/api/v1/deals?search=laptop&page=0&size=5"

# 测试点击跟踪
curl -X POST "http://localhost:8080/api/v1/deals/1/click"
```

---

### **第10-11天: 样本数据与缓存**
*"好的数据让应用活起来！"*

#### 第10天: 样本数据脚本
```java
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DealRepository dealRepository;

    @Override
    public void run(String... args) throws Exception {
        if (dealRepository.count() == 0) {
            loadSampleDeals();
        }
    }

    private void loadSampleDeals() {
        List<Deal> sampleDeals = Arrays.asList(
            createDeal("MacBook Pro M3 Laptop", "MacBook Pro M3 笔记本电脑",
                      "High-performance laptop for professionals", "专业人士的高性能笔记本电脑",
                      new BigDecimal("2499.00"), new BigDecimal("2199.00"), "USD",
                      "https://amazon.com/macbook-pro-m3", "Apple", "Electronics"),
                      
            createDeal("Nike Air Max Sneakers", "耐克 Air Max 运动鞋",
                      "Comfortable running shoes", "舒适的跑步鞋",
                      new BigDecimal("150.00"), new BigDecimal("99.00"), "USD", 
                      "https://nike.com/air-max", "Nike", "Fashion"),
                      
            createDeal("Samsung 4K Smart TV 55\"", "三星4K智能电视55英寸",
                      "Ultra HD Smart Television", "超高清智能电视",
                      new BigDecimal("899.00"), new BigDecimal("699.00"), "USD",
                      "https://samsung.com/tv-55-4k", "Samsung", "Electronics"),
                      
            // ... 添加更多样本数据到50个
        );
        
        dealRepository.saveAll(sampleDeals);
        System.out.println("已加载 " + sampleDeals.size() + " 个样本优惠");
    }

    private Deal createDeal(String titleEn, String titleZh, String descEn, String descZh,
                           BigDecimal originalPrice, BigDecimal salePrice, String currency,
                           String affiliateUrl, String storeName, String category) {
        Deal deal = new Deal();
        deal.setTitleEn(titleEn);
        deal.setTitleZh(titleZh);
        deal.setDescriptionEn(descEn);
        deal.setDescriptionZh(descZh);
        deal.setOriginalPrice(originalPrice);
        deal.setSalePrice(salePrice);
        deal.setCurrency(currency);
        deal.setAffiliateUrl(affiliateUrl);
        deal.setStoreName(storeName);
        deal.setCategory(category);
        deal.setIsActive(true);
        deal.setIsFeatured(Math.random() < 0.2); // 20%的优惠设为推荐
        return deal;
    }
}
```

#### 第11天: Redis缓存集成
```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(15))
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));

        return RedisCacheManager.builder(factory)
            .cacheDefaults(config)
            .build();
    }
}

// 在DealService中添加缓存注解
@Cacheable(value = "deals", key = "#dealId + '_' + #language")
public DealDto getDeal(Long dealId, String language) {
    // 实现代码...
}

@Cacheable(value = "featured_deals", key = "#language")
public List<DealDto> getFeaturedDeals(String language) {
    // 实现代码...
}
```

---

### **第12-13天: 安全配置与监控**
*"安全和监控是生产环境的基石！"*

#### 第12天: 基础安全配置
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/v1/deals/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        return http.build();
    }
}
```

#### 第13天: 健康检查和基础监控
```java
@Component
public class CustomHealthIndicator implements HealthIndicator {

    @Autowired
    private DealRepository dealRepository;

    @Override
    public Health health() {
        try {
            long count = dealRepository.count();
            if (count > 0) {
                return Health.up()
                    .withDetail("deals.count", count)
                    .build();
            } else {
                return Health.down()
                    .withDetail("deals.count", 0)
                    .build();
            }
        } catch (Exception e) {
            return Health.down(e).build();
        }
    }
}

// application.yml 添加监控配置
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always
```

---

### **第14天: 部署准备与完整测试**
*"最后一公里，确保一切完美！"*

#### Docker配置
```dockerfile
# Dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/river-ad-backend-*.jar app.jar

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]

EXPOSE 8080
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: riverad
      POSTGRES_USER: riverad
      POSTGRES_PASSWORD: riverad123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: .
    depends_on:
      - postgres
      - redis
    environment:
      SPRING_PROFILES_ACTIVE: production
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/riverad
      SPRING_REDIS_HOST: redis
    ports:
      - "8080:8080"

volumes:
  postgres_data:
```

#### 部署测试脚本
```bash
#!/bin/bash
# deploy-test.sh

echo "🚀 开始部署测试..."

# 构建应用
echo "📦 构建应用..."
./mvnw clean package -DskipTests

# 启动服务
echo "🐳 启动服务..."
docker-compose up --build -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 45

# 健康检查
echo "🏥 健康检查..."
curl -f http://localhost:8080/actuator/health

# API测试
echo "🔍 API测试..."
curl -X GET "http://localhost:8080/api/v1/deals?page=0&size=5"

echo "✅ 部署测试完成！"
```

## 🎯 Sprint 1 完成清单

### 技术清单
- [ ] ✅ Spring Boot 3.2应用成功运行
- [ ] ✅ PostgreSQL数据库连接和表创建正常
- [ ] ✅ Redis缓存服务正常工作
- [ ] ✅ 50个样本优惠数据加载
- [ ] ✅ REST API端点响应正常
- [ ] ✅ 中英双语支持功能
- [ ] ✅ 基础点击跟踪功能
- [ ] ✅ Docker部署成功
- [ ] ✅ 健康检查和基础监控

### 功能清单
- [ ] ✅ 优惠列表API（支持分页、搜索）
- [ ] ✅ 优惠详情API（支持多语言）
- [ ] ✅ 点击跟踪API
- [ ] ✅ 推荐优惠功能
- [ ] ✅ 缓存机制
- [ ] ✅ 错误处理
- [ ] ✅ API文档

### 质量清单
- [ ] ✅ 代码覆盖率 > 70%
- [ ] ✅ 所有API响应时间 < 500ms
- [ ] ✅ 数据库查询优化
- [ ] ✅ 内存使用 < 512MB
- [ ] ✅ 无内存泄漏

## 💪 独立开发者成功秘诀

### 时间管理技巧
- **番茄工作法**: 25分钟专注 + 5分钟休息
- **每日计划**: 前一天晚上规划第二天任务
- **任务分解**: 大任务分解成2小时内能完成的小任务
- **进度跟踪**: 每天记录完成情况

### 质量保证策略
- **测试先行**: 先写测试，再写实现
- **代码审查**: 每天结束时review当天代码
- **文档同步**: 代码写完立即更新文档
- **定期重构**: 每周五进行代码重构

### 心态调节
- **目标现实**: 设定可达成的小目标
- **庆祝进步**: 每完成一个阶段都要庆祝
- **学会求助**: 遇到问题及时查资料或寻求帮助
- **保持健康**: 规律作息，适当运动

## 🚀 Sprint 2 预告

### 下个Sprint重点（第15-28天）
- 前端React应用开发
- 用户注册登录系统
- 管理后台开发
- SEO基础优化
- 邮件通知系统

### 准备工作
- 学习React和Next.js基础
- 准备UI设计稿
- 申请第一个联盟账户（Amazon Associates）
- 域名注册和SSL证书

---

**🏆 Sprint 1 胜利宣言**

*恭喜你！作为独立开发者，你已经成功建立了一个坚实的后端基础！这不仅仅是代码的胜利，更是个人毅力和专业能力的证明。你证明了一个人也能做出专业级的产品！*

*现在，让我们为Sprint 2做好准备，继续这个激动人心的创业之旅！*

**记住**: 你不是一个人在战斗，每一行代码都在为你的梦想添砖加瓦！