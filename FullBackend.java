import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class FullBackend {
    private static final Map<Long, Deal> deals = new ConcurrentHashMap<>();
    private static final Map<Long, Category> categories = new ConcurrentHashMap<>();
    private static final Map<Long, Store> stores = new ConcurrentHashMap<>();
    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public static void main(String[] args) throws IOException {
        initializeSampleData();
        
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        server.createContext("/api/health", new HealthHandler());
        server.createContext("/api/deals", new DealsHandler());
        server.createContext("/api/categories", new CategoriesHandler());
        server.createContext("/api/stores", new StoresHandler());
        server.createContext("/api/auth", new AuthHandler());
        server.createContext("/api/affiliate", new AffiliateHandler());
        
        server.setExecutor(null);
        server.start();
        
        System.out.println("🎉 River-AD 完整后端服务已启动！");
        System.out.println("📡 服务地址: http://localhost:8080");
        System.out.println("💚 健康检查: GET /api/health");
        System.out.println("🏷️  优惠列表: GET /api/deals");
        System.out.println("🔥 热门优惠: GET /api/deals/popular");
        System.out.println("📂 分类列表: GET /api/categories");
        System.out.println("🏪 商店列表: GET /api/stores");
        System.out.println("👤 用户认证: POST /api/auth/login");
        System.out.println("🔗 联盟追踪: POST /api/affiliate/track");
        System.out.println("⭐ 状态: 运行中 - 包含示例数据");
    }
    
    private static void initializeSampleData() {
        // Categories
        categories.put(1L, new Category(1L, "Electronics", "电子产品", "electronics", 
            "Latest tech gadgets", "最新科技产品", true, 1));
        categories.put(2L, new Category(2L, "Fashion", "时尚", "fashion", 
            "Clothing & accessories", "服装配饰", true, 2));
        categories.put(3L, new Category(3L, "Home & Garden", "家居园艺", "home-garden", 
            "Home improvement", "家居改善", true, 3));
        categories.put(4L, new Category(4L, "Sports", "运动", "sports", 
            "Sports & fitness", "运动健身", true, 4));
        categories.put(5L, new Category(5L, "Beauty", "美妆", "beauty", 
            "Beauty & personal care", "美妆个护", true, 5));
        
        // Stores
        stores.put(1L, new Store(1L, "Amazon", "amazon", "Global marketplace", 
            "https://amazon.com", true));
        stores.put(2L, new Store(2L, "Best Buy", "best-buy", "Electronics retailer", 
            "https://bestbuy.com", true));
        stores.put(3L, new Store(3L, "Target", "target", "Department store", 
            "https://target.com", true));
        stores.put(4L, new Store(4L, "Nike", "nike", "Athletic apparel", 
            "https://nike.com", true));
        stores.put(5L, new Store(5L, "Sephora", "sephora", "Beauty retailer", 
            "https://sephora.com", true));
        
        // Deals
        deals.put(1L, new Deal(1L, "iPhone 15 Pro Max 256GB", "iPhone 15 Pro Max 256GB",
            "Latest iPhone with titanium design and advanced camera system", 
            "钛金属设计的最新iPhone，拥有先进的摄像系统",
            1199.99, 999.99, 16.7, "IPHONE15PRO", categories.get(1L), stores.get(1L), 
            LocalDateTime.now().plusDays(15), true, true, 1250));
            
        deals.put(2L, new Deal(2L, "MacBook Air M3 13-inch", "MacBook Air M3 13英寸",
            "Ultra-thin laptop with M3 chip and all-day battery life", 
            "搭载M3芯片的超薄笔记本，电池续航一整天",
            1099.00, 949.00, 13.6, "MACBOOK2024", categories.get(1L), stores.get(1L), 
            LocalDateTime.now().plusDays(20), true, true, 890));
            
        deals.put(3L, new Deal(3L, "Nike Air Jordan 1 Retro High", "耐克 Air Jordan 1 复古高帮",
            "Classic basketball shoes in original colorway", 
            "经典配色的篮球鞋",
            170.00, 119.99, 29.4, "JORDAN30", categories.get(4L), stores.get(4L), 
            LocalDateTime.now().plusDays(10), true, false, 567));
            
        deals.put(4L, new Deal(4L, "Dyson V15 Detect Absolute", "戴森 V15 Detect Absolute",
            "Most powerful suction with laser dust detection", 
            "最强吸力配激光粉尘检测",
            749.99, 599.99, 20.0, "DYSON2024", categories.get(3L), stores.get(2L), 
            LocalDateTime.now().plusDays(7), true, true, 334));
            
        deals.put(5L, new Deal(5L, "Fenty Beauty Foundation Set", "Fenty Beauty 粉底套装",
            "Full coverage foundation with 40+ shades", 
            "40+色号全遮瑕粉底液",
            89.99, 64.99, 27.8, "FENTY25", categories.get(5L), stores.get(5L), 
            LocalDateTime.now().plusDays(12), true, false, 456));
            
        deals.put(6L, new Deal(6L, "Samsung 65\" QLED 4K Smart TV", "三星65英寸QLED 4K智能电视",
            "Quantum dot technology with HDR10+ support", 
            "量子点技术支持HDR10+",
            1299.99, 899.99, 30.8, "SAMSUNG4K", categories.get(1L), stores.get(2L), 
            LocalDateTime.now().plusDays(25), true, true, 203));
            
        deals.put(7L, new Deal(7L, "Adidas Ultraboost 22 Running Shoes", "阿迪达斯 Ultraboost 22 跑鞋",
            "Energy-returning running shoes with Primeknit upper", 
            "Primeknit鞋面回弹跑鞋",
            180.00, 126.00, 30.0, "BOOST30", categories.get(4L), stores.get(3L), 
            LocalDateTime.now().plusDays(8), true, false, 789));
            
        deals.put(8L, new Deal(8L, "KitchenAid Stand Mixer", "KitchenAid 立式搅拌机",
            "Professional 5-quart stand mixer in multiple colors", 
            "专业5夸脱多色立式搅拌机",
            399.99, 279.99, 30.0, "KITCHEN2024", categories.get(3L), stores.get(3L), 
            LocalDateTime.now().plusDays(18), true, false, 125));
    }
    
    static class HealthHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            String response = String.format(
                "{\n" +
                "  \"status\": \"UP\",\n" +
                "  \"timestamp\": \"%s\",\n" +
                "  \"service\": \"River-AD Full Backend\",\n" +
                "  \"version\": \"2.1.0\",\n" +
                "  \"message\": \"🎉 完整后端服务运行正常！\",\n" +
                "  \"dataCount\": {\n" +
                "    \"deals\": %d,\n" +
                "    \"categories\": %d,\n" +
                "    \"stores\": %d\n" +
                "  },\n" +
                "  \"features\": [\"REST API\", \"Sample Data\", \"CORS\", \"Affiliate Tracking\"]\n" +
                "}",
                LocalDateTime.now().toString(),
                deals.size(), categories.size(), stores.size()
            );
            
            sendResponse(exchange, response, 200);
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
                } else if (path.contains("/search")) {
                    handleSearchDeals(exchange);
                } else {
                    handleGetDeals(exchange);
                }
            } else if (method.equals("POST") && path.contains("/click")) {
                handleDealClick(exchange, path);
            }
        }
        
        private void handleGetDeals(HttpExchange exchange) throws IOException {
            String query = exchange.getRequestURI().getQuery();
            final int page = query != null && parseQueryParams(query).containsKey("page") ? 
                Integer.parseInt(parseQueryParams(query).get("page")) : 0;
            final int size = query != null && parseQueryParams(query).containsKey("size") ? 
                Integer.parseInt(parseQueryParams(query).get("size")) : 20;
            final Long categoryId = query != null && parseQueryParams(query).containsKey("categoryId") ? 
                Long.parseLong(parseQueryParams(query).get("categoryId")) : null;
            final Long storeId = query != null && parseQueryParams(query).containsKey("storeId") ? 
                Long.parseLong(parseQueryParams(query).get("storeId")) : null;
            final String sortBy = query != null ? 
                parseQueryParams(query).getOrDefault("sortBy", "newest") : "newest";
            
            List<Deal> filteredDeals = deals.values().stream()
                .filter(deal -> deal.isActive)
                .filter(deal -> categoryId == null || deal.category.id.equals(categoryId))
                .filter(deal -> storeId == null || deal.store.id.equals(storeId))
                .collect(Collectors.toList());
                
            // Sort deals
            switch (sortBy) {
                case "popularity":
                    filteredDeals.sort((a, b) -> Integer.compare(b.clickCount, a.clickCount));
                    break;
                case "price_low":
                    filteredDeals.sort((a, b) -> Double.compare(a.salePrice, b.salePrice));
                    break;
                case "price_high":
                    filteredDeals.sort((a, b) -> Double.compare(b.salePrice, a.salePrice));
                    break;
                default: // newest
                    filteredDeals.sort((a, b) -> b.createdAt.compareTo(a.createdAt));
            }
                
            int totalElements = filteredDeals.size();
            int totalPages = (int) Math.ceil((double) totalElements / size);
            int start = page * size;
            int end = Math.min(start + size, totalElements);
            
            List<Deal> pageContent = start < totalElements ? 
                filteredDeals.subList(start, end) : new ArrayList<>();
            
            StringBuilder json = new StringBuilder();
            json.append("{\n");
            json.append("  \"content\": [");
            
            for (int i = 0; i < pageContent.size(); i++) {
                if (i > 0) json.append(",");
                json.append("\n").append(pageContent.get(i).toJson());
            }
            
            json.append("\n  ],\n");
            json.append("  \"totalElements\": ").append(totalElements).append(",\n");
            json.append("  \"totalPages\": ").append(totalPages).append(",\n");
            json.append("  \"number\": ").append(page).append(",\n");
            json.append("  \"size\": ").append(size).append(",\n");
            json.append("  \"first\": ").append(page == 0).append(",\n");
            json.append("  \"last\": ").append(page >= totalPages - 1).append("\n");
            json.append("}");
            
            sendResponse(exchange, json.toString(), 200);
        }
        
        private void handlePopularDeals(HttpExchange exchange) throws IOException {
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
            
            StringBuilder json = new StringBuilder();
            json.append("[");
            
            for (int i = 0; i < popularDeals.size(); i++) {
                if (i > 0) json.append(",");
                json.append("\n").append(popularDeals.get(i).toJson());
            }
            
            json.append("\n]");
            sendResponse(exchange, json.toString(), 200);
        }
        
        private void handleSearchDeals(HttpExchange exchange) throws IOException {
            String query = exchange.getRequestURI().getQuery();
            String keyword = null;
            int page = 0;
            int size = 20;
            
            if (query != null) {
                Map<String, String> params = parseQueryParams(query);
                keyword = params.get("keyword");
                page = Integer.parseInt(params.getOrDefault("page", "0"));
                size = Integer.parseInt(params.getOrDefault("size", "20"));
            }
            
            if (keyword == null || keyword.trim().isEmpty()) {
                sendResponse(exchange, "{\"error\": \"Keyword is required\"}", 400);
                return;
            }
            
            String lowerKeyword = keyword.toLowerCase();
            List<Deal> searchResults = deals.values().stream()
                .filter(deal -> deal.isActive)
                .filter(deal -> 
                    deal.titleEn.toLowerCase().contains(lowerKeyword) ||
                    deal.titleZh.toLowerCase().contains(lowerKeyword) ||
                    deal.descriptionEn.toLowerCase().contains(lowerKeyword) ||
                    deal.descriptionZh.toLowerCase().contains(lowerKeyword))
                .sorted((a, b) -> Integer.compare(b.clickCount, a.clickCount))
                .collect(Collectors.toList());
                
            int totalElements = searchResults.size();
            int totalPages = (int) Math.ceil((double) totalElements / size);
            int start = page * size;
            int end = Math.min(start + size, totalElements);
            
            List<Deal> pageContent = start < totalElements ? 
                searchResults.subList(start, end) : new ArrayList<>();
            
            StringBuilder json = new StringBuilder();
            json.append("{\n");
            json.append("  \"content\": [");
            
            for (int i = 0; i < pageContent.size(); i++) {
                if (i > 0) json.append(",");
                json.append("\n").append(pageContent.get(i).toJson());
            }
            
            json.append("\n  ],\n");
            json.append("  \"totalElements\": ").append(totalElements).append(",\n");
            json.append("  \"totalPages\": ").append(totalPages).append(",\n");
            json.append("  \"number\": ").append(page).append(",\n");
            json.append("  \"size\": ").append(size).append(",\n");
            json.append("  \"first\": ").append(page == 0).append(",\n");
            json.append("  \"last\": ").append(page >= totalPages - 1).append(",\n");
            json.append("  \"keyword\": \"").append(keyword).append("\"\n");
            json.append("}");
            
            sendResponse(exchange, json.toString(), 200);
        }
        
        private void handleGetDeal(HttpExchange exchange, String path) throws IOException {
            String idStr = path.substring(path.lastIndexOf("/") + 1);
            try {
                Long id = Long.parseLong(idStr);
                Deal deal = deals.get(id);
                
                if (deal != null && deal.isActive) {
                    sendResponse(exchange, deal.toJson(), 200);
                } else {
                    sendResponse(exchange, "{\"error\": \"Deal not found\"}", 404);
                }
            } catch (NumberFormatException e) {
                sendResponse(exchange, "{\"error\": \"Invalid deal ID\"}", 400);
            }
        }
        
        private void handleDealClick(HttpExchange exchange, String path) throws IOException {
            String idStr = path.split("/")[3]; // /api/deals/{id}/click
            try {
                Long id = Long.parseLong(idStr);
                Deal deal = deals.get(id);
                
                if (deal != null) {
                    deal.clickCount++;
                    String response = String.format(
                        "{\"message\": \"点击记录成功\", \"clickCount\": %d, \"dealId\": %d}",
                        deal.clickCount, id
                    );
                    sendResponse(exchange, response, 200);
                } else {
                    sendResponse(exchange, "{\"error\": \"Deal not found\"}", 404);
                }
            } catch (NumberFormatException e) {
                sendResponse(exchange, "{\"error\": \"Invalid deal ID\"}", 400);
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
            
            StringBuilder json = new StringBuilder();
            json.append("[");
            
            for (int i = 0; i < activeCategories.size(); i++) {
                if (i > 0) json.append(",");
                json.append("\n").append(activeCategories.get(i).toJson());
            }
            
            json.append("\n]");
            sendResponse(exchange, json.toString(), 200);
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
            
            StringBuilder json = new StringBuilder();
            json.append("[");
            
            for (int i = 0; i < activeStores.size(); i++) {
                if (i > 0) json.append(",");
                json.append("\n").append(activeStores.get(i).toJson());
            }
            
            json.append("\n]");
            sendResponse(exchange, json.toString(), 200);
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
            } else {
                sendResponse(exchange, "{\"error\": \"Endpoint not found\"}", 404);
            }
        }
        
        private void handleLogin(HttpExchange exchange) throws IOException {
            String response = String.format(
                "{\n" +
                "  \"token\": \"demo-jwt-token-%d\",\n" +
                "  \"type\": \"Bearer\",\n" +
                "  \"userId\": 1,\n" +
                "  \"email\": \"demo@riverad.com\",\n" +
                "  \"fullName\": \"Demo User\"\n" +
                "}",
                System.currentTimeMillis()
            );
            sendResponse(exchange, response, 200);
        }
        
        private void handleRegister(HttpExchange exchange) throws IOException {
            long newUserId = System.currentTimeMillis() % 1000000;
            String response = String.format(
                "{\n" +
                "  \"token\": \"demo-jwt-token-%d\",\n" +
                "  \"type\": \"Bearer\",\n" +
                "  \"userId\": %d,\n" +
                "  \"email\": \"newuser@riverad.com\",\n" +
                "  \"fullName\": \"New User\"\n" +
                "}",
                System.currentTimeMillis(), newUserId
            );
            sendResponse(exchange, response, 200);
        }
        
        private void handleValidate(HttpExchange exchange) throws IOException {
            sendResponse(exchange, "{\"valid\": true, \"message\": \"Token is valid\"}", 200);
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
            } else {
                sendResponse(exchange, "{\"error\": \"Endpoint not found\"}", 404);
            }
        }
        
        private void handleTrackClick(HttpExchange exchange) throws IOException {
            String clickId = "click-" + UUID.randomUUID().toString().substring(0, 8);
            String response = String.format(
                "{\"message\": \"点击跟踪成功\", \"clickId\": \"%s\", \"timestamp\": \"%s\"}",
                clickId, LocalDateTime.now().toString()
            );
            sendResponse(exchange, response, 200);
        }
        
        private void handleClickStats(HttpExchange exchange) throws IOException {
            long clicks = (long) (Math.random() * 1000 + 100);
            sendResponse(exchange, String.valueOf(clicks), 200);
        }
    }
    
    // Utility methods
    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        exchange.getResponseHeaders().add("Access-Control-Allow-Credentials", "true");
    }
    
    private static void sendResponse(HttpExchange exchange, String response, int status) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        byte[] responseBytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(status, responseBytes.length);
        
        OutputStream os = exchange.getResponseBody();
        os.write(responseBytes);
        os.close();
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
    public String couponCode;
    public Category category;
    public Store store;
    public LocalDateTime expiresAt;
    public boolean isActive;
    public boolean isFeatured;
    public int clickCount;
    public LocalDateTime createdAt;
    
    public Deal(Long id, String titleEn, String titleZh, String descriptionEn, String descriptionZh,
               Double originalPrice, Double salePrice, Double discountPercentage, String couponCode,
               Category category, Store store, LocalDateTime expiresAt, boolean isActive, boolean isFeatured, int clickCount) {
        this.id = id;
        this.titleEn = titleEn;
        this.titleZh = titleZh;
        this.descriptionEn = descriptionEn;
        this.descriptionZh = descriptionZh;
        this.originalPrice = originalPrice;
        this.salePrice = salePrice;
        this.discountPercentage = discountPercentage;
        this.couponCode = couponCode;
        this.category = category;
        this.store = store;
        this.expiresAt = expiresAt;
        this.isActive = isActive;
        this.isFeatured = isFeatured;
        this.clickCount = clickCount;
        this.createdAt = LocalDateTime.now().minusHours((long)(Math.random() * 72));
    }
    
    public String toJson() {
        return String.format(
            "    {\n" +
            "      \"id\": %d,\n" +
            "      \"titleEn\": \"%s\",\n" +
            "      \"titleZh\": \"%s\",\n" +
            "      \"descriptionEn\": \"%s\",\n" +
            "      \"descriptionZh\": \"%s\",\n" +
            "      \"originalPrice\": %.2f,\n" +
            "      \"salePrice\": %.2f,\n" +
            "      \"discountPercentage\": %.1f,\n" +
            "      \"couponCode\": %s,\n" +
            "      \"category\": %s,\n" +
            "      \"store\": %s,\n" +
            "      \"expiresAt\": \"%s\",\n" +
            "      \"isActive\": %b,\n" +
            "      \"isFeatured\": %b,\n" +
            "      \"clickCount\": %d,\n" +
            "      \"createdAt\": \"%s\",\n" +
            "      \"dealUrl\": \"https://demo-deal.com/%d\",\n" +
            "      \"affiliateUrl\": \"https://affiliate.riverad.com/%d\",\n" +
            "      \"imageUrl\": \"https://images.demo.com/deal-%d.jpg\"\n" +
            "    }",
            id, titleEn, titleZh, descriptionEn, descriptionZh,
            originalPrice, salePrice, discountPercentage,
            couponCode != null ? "\"" + couponCode + "\"" : "null",
            category.toJson(), store.toJson(),
            expiresAt.toString(), isActive, isFeatured, clickCount,
            createdAt.toString(), id, id, id
        );
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
    
    public String toJson() {
        return String.format(
            "{\n" +
            "        \"id\": %d,\n" +
            "        \"nameEn\": \"%s\",\n" +
            "        \"nameZh\": \"%s\",\n" +
            "        \"slug\": \"%s\",\n" +
            "        \"descriptionEn\": \"%s\",\n" +
            "        \"descriptionZh\": \"%s\",\n" +
            "        \"isActive\": %b,\n" +
            "        \"displayOrder\": %d\n" +
            "      }",
            id, nameEn, nameZh, slug, descriptionEn, descriptionZh, isActive, displayOrder
        );
    }
}

class Store {
    public Long id;
    public String name;
    public String slug;
    public String description;
    public String websiteUrl;
    public boolean isActive;
    
    public Store(Long id, String name, String slug, String description, String websiteUrl, boolean isActive) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.isActive = isActive;
    }
    
    public String toJson() {
        return String.format(
            "{\n" +
            "        \"id\": %d,\n" +
            "        \"name\": \"%s\",\n" +
            "        \"slug\": \"%s\",\n" +
            "        \"description\": \"%s\",\n" +
            "        \"websiteUrl\": \"%s\",\n" +
            "        \"logoUrl\": \"https://logos.demo.com/%s.png\",\n" +
            "        \"commissionRate\": %.3f,\n" +
            "        \"isActive\": %b\n" +
            "      }",
            id, name, slug, description, websiteUrl, slug.toLowerCase(), Math.random() * 0.1 + 0.02, isActive
        );
    }
}