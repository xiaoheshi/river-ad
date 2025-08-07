-- River-AD 数据库初始化脚本

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    preferred_language VARCHAR(5) DEFAULT 'en',
    preferred_currency VARCHAR(3) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 商店表
CREATE TABLE IF NOT EXISTS stores (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    logo_url TEXT,
    website_url TEXT NOT NULL,
    description_en TEXT,
    description_zh TEXT,
    country VARCHAR(2),
    currency VARCHAR(3) DEFAULT 'USD',
    commission_rate DECIMAL(5,2) DEFAULT 0.05,
    affiliate_network VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_zh VARCHAR(100),
    slug VARCHAR(100) UNIQUE NOT NULL,
    parent_id BIGINT REFERENCES categories(id),
    icon_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 优惠表
CREATE TABLE IF NOT EXISTS deals (
    id BIGSERIAL PRIMARY KEY,
    title_en VARCHAR(500) NOT NULL,
    title_zh VARCHAR(500),
    description_en TEXT,
    description_zh TEXT,
    short_description_en VARCHAR(200),
    short_description_zh VARCHAR(200),
    
    original_price DECIMAL(10,2),
    sale_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    discount_percentage INTEGER,
    
    store_id BIGINT REFERENCES stores(id),
    category_id BIGINT REFERENCES categories(id),
    
    affiliate_url TEXT NOT NULL,
    image_url TEXT,
    coupon_code VARCHAR(50),
    
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    click_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 联盟点击跟踪表
CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id BIGSERIAL PRIMARY KEY,
    deal_id BIGINT REFERENCES deals(id),
    user_id BIGINT REFERENCES users(id),
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    converted BOOLEAN DEFAULT false,
    conversion_amount DECIMAL(10,2),
    commission_earned DECIMAL(10,2)
);

-- 用户收藏表
CREATE TABLE IF NOT EXISTS user_favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    deal_id BIGINT REFERENCES deals(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, deal_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_deals_active_featured ON deals(is_active, is_featured, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deals_category ON deals(category_id, is_active);
CREATE INDEX IF NOT EXISTS idx_deals_store ON deals(store_id, is_active);
CREATE INDEX IF NOT EXISTS idx_deals_price_range ON deals(sale_price, currency, is_active);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_deal_date ON affiliate_clicks(deal_id, clicked_at);
CREATE INDEX IF NOT EXISTS idx_users_email_active ON users(email, is_active);
CREATE INDEX IF NOT EXISTS idx_stores_active ON stores(is_active, created_at);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active, sort_order);

-- 插入初始分类数据
INSERT INTO categories (name_en, name_zh, slug, sort_order) VALUES
('Electronics', '数码电子', 'electronics', 1),
('Fashion', '时尚服饰', 'fashion', 2),
('Home & Garden', '家居园艺', 'home-garden', 3),
('Sports & Outdoor', '运动户外', 'sports-outdoor', 4),
('Beauty & Health', '美容健康', 'beauty-health', 5),
('Books & Media', '图书媒体', 'books-media', 6),
('Travel', '旅行', 'travel', 7),
('Food & Beverage', '食品饮料', 'food-beverage', 8)
ON CONFLICT (slug) DO NOTHING;

-- 插入初始商店数据
INSERT INTO stores (name, slug, website_url, description_en, description_zh, country, currency, commission_rate, affiliate_network) VALUES
('Amazon', 'amazon', 'https://amazon.com', 'World''s largest online retailer', '全球最大的在线零售商', 'US', 'USD', 0.04, 'Amazon Associates'),
('eBay', 'ebay', 'https://ebay.com', 'Global online marketplace', '全球在线市场', 'US', 'USD', 0.02, 'eBay Partner Network'),
('Best Buy', 'bestbuy', 'https://bestbuy.com', 'Electronics and technology retailer', '电子和科技零售商', 'US', 'USD', 0.01, 'CJ Affiliate'),
('Target', 'target', 'https://target.com', 'General merchandise retailer', '综合商品零售商', 'US', 'USD', 0.01, 'Impact Radius'),
('Walmart', 'walmart', 'https://walmart.com', 'Multinational retail corporation', '跨国零售公司', 'US', 'USD', 0.01, 'Commission Junction')
ON CONFLICT (slug) DO NOTHING;

-- 插入样本优惠数据
INSERT INTO deals (title_en, title_zh, description_en, description_zh, original_price, sale_price, currency, store_id, category_id, affiliate_url, is_featured) 
SELECT 
    'Sample Deal ' || generate_series,
    '样本优惠 ' || generate_series,
    'Amazing discount on premium products',
    '优质产品超值折扣',
    ROUND(RANDOM() * 200 + 50, 2),
    ROUND(RANDOM() * 150 + 20, 2),
    'USD',
    (RANDOM() * 4 + 1)::INTEGER,
    (RANDOM() * 7 + 1)::INTEGER,
    'https://example.com/affiliate-link-' || generate_series,
    RANDOM() < 0.2
FROM generate_series(1, 20)
ON CONFLICT DO NOTHING;

-- 创建更新时间戳的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为相关表创建更新时间戳的触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();