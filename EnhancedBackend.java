import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

public class EnhancedBackend {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Map<Long, Deal> deals = new ConcurrentHashMap<>();
    private static final Map<Long, Category> categories = new ConcurrentHashMap<>();
    private static final Map<Long, Store> stores = new ConcurrentHashMap<>();
    private static final Map<Long, User> users = new ConcurrentHashMap<>();
    private static final AtomicLong idGenerator = new AtomicLong(1);

    public static void main(String[] args) throws IOException {
        // Initialize sample data
        initializeSampleData();
        
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        // API endpoints
        server.createContext("/api/health", new HealthHandler());
        server.createContext("/api/deals", new DealsHandler());
        server.createContext("/api/categories", new CategoriesHandler());
        server.createContext("/api/stores", new StoresHandler());
        server.createContext("/api/auth", new AuthHandler());
        server.createContext("/api/affiliate", new AffiliateHandler());
        
        server.setExecutor(null);
        server.start();
        
        System.out.println("🎉 River-AD 增强后端服务已启动！");
        System.out.println("📡 服务地址: http://localhost:8080");
        System.out.println("💚 健康检查: http://localhost:8080/api/health");
        System.out.println("🏷️ 优惠接口: http://localhost:8080/api/deals");
        System.out.println("📂 分类接口: http://localhost:8080/api/categories");
        System.out.println("🏪 商店接口: http://localhost:8080/api/stores");
        System.out.println("👤 认证接口: http://localhost:8080/api/auth");
        System.out.println("🔗 联盟接口: http://localhost:8080/api/affiliate");
        System.out.println("⭐ 状态: 运行中...");
    }
    
    private static void initializeSampleData() {
        // Initialize Categories
        Category category1 = new Category(1L, "Electronics", "电子产品", "electronics", 
            "Latest tech gadgets and electronics", "最新科技产品和电子设备", true, 1);
        Category category2 = new Category(2L, "Fashion", "时尚", "fashion", 
            "Clothing and fashion accessories", "服装和时尚配饰", true, 2);
        Category category3 = new Category(3L, "Home & Garden", "家居园艺", "home-garden", 
            "Home improvement and garden supplies", "家居改善和园艺用品", true, 3);
        
        categories.put(1L, category1);
        categories.put(2L, category2);
        categories.put(3L, category3);
        
        // Initialize Stores
        Store store1 = new Store(1L, "Amazon", "amazon", "Global e-commerce giant", 
            "https://amazon.com", "https://logo.url/amazon.png", 0.05, true);
        Store store2 = new Store(2L, "Best Buy", "best-buy", "Electronics retailer", 
            "https://bestbuy.com", "https://logo.url/bestbuy.png", 0.03, true);
        Store store3 = new Store(3L, "Target", "target", "Retail chain store", 
            "https://target.com", "https://logo.url/target.png", 0.04, true);
            
        stores.put(1L, store1);
        stores.put(2L, store2);
        stores.put(3L, store3);
        
        // Initialize Deals
        Deal deal1 = new Deal(1L, "iPhone 15 Pro Max", "iPhone 15 Pro Max",
            "Latest iPhone with advanced features", "搭载最新技术的iPhone",
            1299.99, 1199.99, 7.7, "https://deal.url/iphone15", 
            "https://affiliate.url/iphone15", "https://image.url/iphone15.jpg",
            "IPHONE15", category1, store1, LocalDateTime.now().plusDays(30), true, true, 156);
            
        Deal deal2 = new Deal(2L, "Nike Air Max 270", "耐克 Air Max 270",
            "Comfortable running shoes", "舒适的跑步鞋",
            129.99, 89.99, 30.8, "https://deal.url/nike270", 
            "https://affiliate.url/nike270", "https://image.url/nike270.jpg",
            "NIKE30", category2, store3, LocalDateTime.now().plusDays(15), true, false, 89);
            
        Deal deal3 = new Deal(3L, "Dyson V15 Vacuum", "戴森 V15 吸尘器",
            "Powerful cordless vacuum cleaner", "强力无线吸尘器",
            649.99, 549.99, 15.4, "https://deal.url/dysonv15", 
            "https://affiliate.url/dysonv15", "https://image.url/dysonv15.jpg",
            null, category3, store2, LocalDateTime.now().plusDays(7), true, true, 234);
            
        deals.put(1L, deal1);
        deals.put(2L, deal2);
        deals.put(3L, deal3);
        
        // Initialize sample user
        User user1 = new User(1L, "demo@riverad.com", "Demo User", "en", "USD", "UTC", true, true);
        users.put(1L, user1);
    }
    
    static class HealthHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "UP");
            response.put("timestamp", LocalDateTime.now().toString());
            response.put("service", "River-AD Enhanced Backend");
            response.put("version", "2.0.0");
            response.put("message", "🎉 增强后端服务运行正常！");
            response.put("features", Arrays.asList("Deals API", "Categories", "Stores", "Authentication", "Affiliate Tracking"));
            response.put("dataStatus", Map.of(
                "deals", deals.size(),
                "categories", categories.size(), 
                "stores", stores.size(),
                "users", users.size()
            ));
            
            sendJsonResponse(exchange, response, 200);
        }
    }
    
    static class DealsHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            String method = exchange.getRequestMethod();
            String path = exchange.getRequestURI().getPath();
            
            if (method.equals("GET")) {
                if (path.contains("/popular")) {
                    handlePopularDeals(exchange);
                } else if (path.matches(".*/\\d+$")) {
                    handleGetDeal(exchange, path);
                } else {
                    handleGetDeals(exchange);
                }
            } else if (method.equals("POST") && path.contains("/click")) {
                handleDealClick(exchange, path);
            }
        }
        
        private void handleGetDeals(HttpExchange exchange) throws IOException {
            String query = exchange.getRequestURI().getQuery();
            int page = 0;
            int size = 20;
            String keyword = null;
            Long categoryId = null;
            Long storeId = null;
            
            if (query != null) {
                Map<String, String> params = parseQueryParams(query);
                page = Integer.parseInt(params.getOrDefault("page", "0"));
                size = Integer.parseInt(params.getOrDefault("size", "20"));
                keyword = params.get("keyword");
                if (params.get("categoryId") != null) {
                    categoryId = Long.parseLong(params.get("categoryId"));
                }
                if (params.get("storeId") != null) {
                    storeId = Long.parseLong(params.get("storeId"));
                }
            }
            
            List<Deal> filteredDeals = deals.values().stream()
                .filter(deal -> deal.isActive)
                .filter(deal -> keyword == null || 
                    deal.titleEn.toLowerCase().contains(keyword.toLowerCase()) ||
                    deal.titleZh.toLowerCase().contains(keyword.toLowerCase()))
                .filter(deal -> categoryId == null || deal.category.id.equals(categoryId))
                .filter(deal -> storeId == null || deal.store.id.equals(storeId))
                .sorted((a, b) -> b.createdAt.compareTo(a.createdAt))
                .collect(Collectors.toList());
                
            int totalElements = filteredDeals.size();
            int totalPages = (int) Math.ceil((double) totalElements / size);
            int start = page * size;
            int end = Math.min(start + size, totalElements);
            
            List<Deal> pageContent = filteredDeals.subList(start, end);
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", pageContent);
            response.put("totalElements", totalElements);
            response.put("totalPages", totalPages);
            response.put("number", page);
            response.put("size", size);
            response.put("first", page == 0);
            response.put("last", page >= totalPages - 1);
            
            sendJsonResponse(exchange, response, 200);
        }
        
        private void handlePopularDeals(exchange) throws IOException {
            String query = exchange.getRequestURI().getQuery();
            int limit = 10;
            
            if (query != null) {
                Map<String, String> params = parseQueryParams(query);
                limit = Integer.parseInt(params.getOrDefault("limit", "10"));
            }
            
            List<Deal> popularDeals = deals.values().stream()
                .filter(deal -> deal.isActive)
                .sorted((a, b) -> Integer.compare(b.clickCount, a.clickCount))
                .limit(limit)
                .collect(Collectors.toList());
                
            sendJsonResponse(exchange, popularDeals, 200);
        }
        
        private void handleGetDeal(HttpExchange exchange, String path) throws IOException {
            String idStr = path.substring(path.lastIndexOf("/") + 1);
            Long id = Long.parseLong(idStr);
            
            Deal deal = deals.get(id);
            if (deal != null && deal.isActive) {
                sendJsonResponse(exchange, deal, 200);
            } else {
                sendJsonResponse(exchange, Map.of("error", "Deal not found"), 404);
            }
        }
        
        private void handleDealClick(HttpExchange exchange, String path) throws IOException {
            String idStr = path.split("/")[3]; // /api/deals/{id}/click
            Long id = Long.parseLong(idStr);
            
            Deal deal = deals.get(id);
            if (deal != null) {
                deal.clickCount++;
                sendJsonResponse(exchange, Map.of("message", "点击记录成功", "clickCount", deal.clickCount), 200);
            } else {
                sendJsonResponse(exchange, Map.of("error", "Deal not found"), 404);
            }
        }
    }
    
    static class CategoriesHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            List<Category> activeCategories = categories.values().stream()
                .filter(category -> category.isActive)
                .sorted(Comparator.comparing(c -> c.displayOrder))
                .collect(Collectors.toList());
                
            sendJsonResponse(exchange, activeCategories, 200);
        }
    }
    
    static class StoresHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            List<Store> activeStores = stores.values().stream()
                .filter(store -> store.isActive)
                .sorted(Comparator.comparing(s -> s.name))
                .collect(Collectors.toList());
                
            sendJsonResponse(exchange, activeStores, 200);
        }
    }
    
    static class AuthHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            String path = exchange.getRequestURI().getPath();
            String method = exchange.getRequestMethod();
            
            if (path.endsWith("/login") && method.equals("POST")) {
                handleLogin(exchange);
            } else if (path.endsWith("/register") && method.equals("POST")) {
                handleRegister(exchange);
            } else if (path.endsWith("/validate") && method.equals("POST")) {
                handleValidate(exchange);
            }
        }
        
        private void handleLogin(HttpExchange exchange) throws IOException {
            // Simplified login - always return success for demo
            Map<String, Object> response = new HashMap<>();
            response.put("token", "demo-jwt-token-" + System.currentTimeMillis());
            response.put("type", "Bearer");
            response.put("userId", 1L);
            response.put("email", "demo@riverad.com");
            response.put("fullName", "Demo User");
            
            sendJsonResponse(exchange, response, 200);
        }
        
        private void handleRegister(HttpExchange exchange) throws IOException {
            // Simplified register - always return success for demo
            Long newUserId = idGenerator.incrementAndGet();
            Map<String, Object> response = new HashMap<>();
            response.put("token", "demo-jwt-token-" + System.currentTimeMillis());
            response.put("type", "Bearer");
            response.put("userId", newUserId);
            response.put("email", "newuser@riverad.com");
            response.put("fullName", "New User");
            
            sendJsonResponse(exchange, response, 200);
        }
        
        private void handleValidate(HttpExchange exchange) throws IOException {
            sendJsonResponse(exchange, Map.of("valid", true, "message", "Token valid"), 200);
        }
    }
    
    static class AffiliateHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            String path = exchange.getRequestURI().getPath();
            String method = exchange.getRequestMethod();
            
            if (path.endsWith("/track") && method.equals("POST")) {
                handleTrackClick(exchange);
            } else if (path.contains("/stats/clicks")) {
                handleClickStats(exchange);
            }
        }
        
        private void handleTrackClick(HttpExchange exchange) throws IOException {
            String clickId = "click-" + UUID.randomUUID().toString().substring(0, 8);
            sendJsonResponse(exchange, Map.of("message", "点击跟踪成功", "clickId", clickId), 200);
        }
        
        private void handleClickStats(HttpExchange exchange) throws IOException {
            // Return random stats for demo
            long clicks = (long) (Math.random() * 1000 + 100);
            sendJsonResponse(exchange, clicks, 200);
        }
    }
    
    // Utility methods
    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "http://localhost:3000");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        exchange.getResponseHeaders().add("Access-Control-Allow-Credentials", "true");
    }
    
    private static void sendJsonResponse(HttpExchange exchange, Object data, int status) throws IOException {
        try {
            String response = objectMapper.writeValueAsString(data);
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
            exchange.sendResponseHeaders(status, response.getBytes(StandardCharsets.UTF_8).length);
            
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes(StandardCharsets.UTF_8));
            os.close();
        } catch (Exception e) {
            String errorResponse = "{\"error\": \"Internal server error\"}";
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(500, errorResponse.length());
            
            OutputStream os = exchange.getResponseBody();
            os.write(errorResponse.getBytes());
            os.close();
        }
    }
    
    private static Map<String, String> parseQueryParams(String query) {
        Map<String, String> params = new HashMap<>();
        if (query == null) return params;
        
        for (String param : query.split("&")) {
            String[] pair = param.split("=");
            if (pair.length == 2) {
                params.put(pair[0], java.net.URLDecoder.decode(pair[1], StandardCharsets.UTF_8));
            }
        }
        return params;
    }
}

// Data models
class Deal {
    public Long id;
    public String titleEn;
    public String titleZh;
    public String descriptionEn;
    public String descriptionZh;
    public Double originalPrice;
    public Double salePrice;
    public Double discountPercentage;
    public String dealUrl;
    public String affiliateUrl;
    public String imageUrl;
    public String couponCode;
    public Category category;
    public Store store;
    public LocalDateTime expiresAt;
    public boolean isActive;
    public boolean isFeatured;
    public int clickCount;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
    
    public Deal(Long id, String titleEn, String titleZh, String descriptionEn, String descriptionZh,
               Double originalPrice, Double salePrice, Double discountPercentage, String dealUrl,
               String affiliateUrl, String imageUrl, String couponCode, Category category, Store store,
               LocalDateTime expiresAt, boolean isActive, boolean isFeatured, int clickCount) {
        this.id = id;
        this.titleEn = titleEn;
        this.titleZh = titleZh;
        this.descriptionEn = descriptionEn;
        this.descriptionZh = descriptionZh;
        this.originalPrice = originalPrice;
        this.salePrice = salePrice;
        this.discountPercentage = discountPercentage;
        this.dealUrl = dealUrl;
        this.affiliateUrl = affiliateUrl;
        this.imageUrl = imageUrl;
        this.couponCode = couponCode;
        this.category = category;
        this.store = store;
        this.expiresAt = expiresAt;
        this.isActive = isActive;
        this.isFeatured = isFeatured;
        this.clickCount = clickCount;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}

class Category {
    public Long id;
    public String nameEn;
    public String nameZh;
    public String slug;
    public String descriptionEn;
    public String descriptionZh;
    public boolean isActive;
    public int displayOrder;
    
    public Category(Long id, String nameEn, String nameZh, String slug,
                   String descriptionEn, String descriptionZh, boolean isActive, int displayOrder) {
        this.id = id;
        this.nameEn = nameEn;
        this.nameZh = nameZh;
        this.slug = slug;
        this.descriptionEn = descriptionEn;
        this.descriptionZh = descriptionZh;
        this.isActive = isActive;
        this.displayOrder = displayOrder;
    }
}

class Store {
    public Long id;
    public String name;
    public String slug;
    public String description;
    public String websiteUrl;
    public String logoUrl;
    public Double commissionRate;
    public boolean isActive;
    
    public Store(Long id, String name, String slug, String description, String websiteUrl,
                String logoUrl, Double commissionRate, boolean isActive) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.logoUrl = logoUrl;
        this.commissionRate = commissionRate;
        this.isActive = isActive;
    }
}

class User {
    public Long id;
    public String email;
    public String fullName;
    public String preferredLanguage;
    public String preferredCurrency;
    public String timezone;
    public boolean isActive;
    public boolean emailVerified;
    
    public User(Long id, String email, String fullName, String preferredLanguage,
               String preferredCurrency, String timezone, boolean isActive, boolean emailVerified) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.preferredLanguage = preferredLanguage;
        this.preferredCurrency = preferredCurrency;
        this.timezone = timezone;
        this.isActive = isActive;
        this.emailVerified = emailVerified;
    }
}