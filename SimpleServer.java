import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.time.LocalDateTime;
import java.nio.charset.StandardCharsets;

public class SimpleServer {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        // Health check endpoint
        server.createContext("/api/health", new HealthHandler());
        
        // Test endpoint
        server.createContext("/api/test", new TestHandler());
        
        // CORS preflight handler
        server.createContext("/api/", new CorsHandler());
        
        server.setExecutor(null);
        server.start();
        
        System.out.println("🎉 River-AD 简化后端服务已启动！");
        System.out.println("📡 服务地址: http://localhost:8080");
        System.out.println("💚 健康检查: http://localhost:8080/api/health");
        System.out.println("🧪 API 测试: http://localhost:8080/api/test");
        System.out.println("⭐ 状态: 运行中...");
    }
    
    static class HealthHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            // Handle CORS
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "http://localhost:3000");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
            
            String response = "{\n" +
                "  \"status\": \"UP\",\n" +
                "  \"timestamp\": \"" + LocalDateTime.now() + "\",\n" +
                "  \"service\": \"River-AD Backend\",\n" +
                "  \"version\": \"1.0.0\",\n" +
                "  \"message\": \"🎉 后端服务运行正常！\"\n" +
                "}";
            
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
            exchange.sendResponseHeaders(200, response.getBytes(StandardCharsets.UTF_8).length);
            
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes(StandardCharsets.UTF_8));
            os.close();
        }
    }
    
    static class TestHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            // Handle CORS
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "http://localhost:3000");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
            
            String response = "{\n" +
                "  \"success\": true,\n" +
                "  \"message\": \"API 测试成功！\",\n" +
                "  \"timestamp\": \"" + LocalDateTime.now() + "\",\n" +
                "  \"backend\": \"Pure Java HTTP Server\",\n" +
                "  \"database\": \"Not connected (demo mode)\",\n" +
                "  \"cors\": \"Enabled for localhost:3000\"\n" +
                "}";
            
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
            exchange.sendResponseHeaders(200, response.getBytes(StandardCharsets.UTF_8).length);
            
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes(StandardCharsets.UTF_8));
            os.close();
        }
    }
    
    static class CorsHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            // Handle CORS preflight requests
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "http://localhost:3000");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
            } else {
                String response = "{\"message\": \"River-AD API is running\"}";
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, response.length());
                
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        }
    }
}