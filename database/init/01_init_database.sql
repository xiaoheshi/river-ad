-- River-AD Database Initialization Script
-- 专为CPS联盟营销优化的数据库设计

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create enum types for better data integrity
CREATE TYPE deal_status AS ENUM ('active', 'expired', 'pending', 'disabled');
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
CREATE TYPE click_status AS ENUM ('clicked', 'converted', 'pending');

-- Users table - 用户管理
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    role user_role DEFAULT 'user',
    preferred_language VARCHAR(5) DEFAULT 'en',
    preferred_currency VARCHAR(3) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    -- User preferences for personalization
    preferences JSONB DEFAULT '{}',
    -- Tracking fields for analytics
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES users(id),
    total_savings DECIMAL(12,2) DEFAULT 0.00
);

-- Stores table - 商家信息
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    website_url VARCHAR(500) NOT NULL,
    affiliate_network VARCHAR(100), -- 'cj', 'shareasale', 'impact', etc.
    commission_rate DECIMAL(5,2), -- 佣金率
    cookie_duration INTEGER DEFAULT 30, -- Cookie有效期（天）
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Multi-language support
    name_zh VARCHAR(200),
    description_zh TEXT,
    -- Performance metrics
    click_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT 0.00
);

-- Categories table - 分类管理
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Multi-language support
    name_zh VARCHAR(100),
    description_zh TEXT,
    -- Icon for UI
    icon VARCHAR(50)
);

-- Deals table - 核心优惠信息
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    store_id UUID NOT NULL REFERENCES stores(id),
    category_id UUID REFERENCES categories(id),
    
    -- Deal details
    original_price DECIMAL(12,2),
    discounted_price DECIMAL(12,2),
    discount_percentage INTEGER,
    coupon_code VARCHAR(50),
    
    -- URLs and tracking
    product_url VARCHAR(1000) NOT NULL,
    affiliate_url VARCHAR(1000) NOT NULL,
    image_url VARCHAR(500),
    
    -- Status and timing
    status deal_status DEFAULT 'pending',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE,
    
    -- Multi-language support
    title_zh VARCHAR(300),
    description_zh TEXT,
    
    -- Performance tracking
    view_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    
    -- SEO and metadata
    meta_title VARCHAR(200),
    meta_description VARCHAR(300),
    tags TEXT[], -- Array of tags
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Click tracking table - CPS核心跟踪
CREATE TABLE click_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id),
    user_id UUID REFERENCES users(id), -- NULL for anonymous users
    
    -- Tracking details
    click_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_ip INET,
    user_agent TEXT,
    referer VARCHAR(1000),
    
    -- Geographic info for analytics
    country_code VARCHAR(2),
    city VARCHAR(100),
    
    -- Conversion tracking
    status click_status DEFAULT 'clicked',
    conversion_time TIMESTAMP WITH TIME ZONE,
    commission_amount DECIMAL(10,2),
    order_value DECIMAL(12,2),
    
    -- Session tracking
    session_id VARCHAR(100),
    tracking_code VARCHAR(100) UNIQUE -- 用于回调跟踪
);

-- User favorites - 用户收藏
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    deal_id UUID NOT NULL REFERENCES deals(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, deal_id)
);

-- Email subscriptions - 邮件订阅
CREATE TABLE email_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    categories UUID[], -- Array of category IDs
    stores UUID[], -- Array of store IDs
    is_active BOOLEAN DEFAULT TRUE,
    verification_token VARCHAR(100),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(email)
);

-- Create indexes for performance
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_store_id ON deals(store_id);
CREATE INDEX idx_deals_category_id ON deals(category_id);
CREATE INDEX idx_deals_end_date ON deals(end_date);
CREATE INDEX idx_deals_created_at ON deals(created_at DESC);
CREATE INDEX idx_deals_view_count ON deals(view_count DESC);

CREATE INDEX idx_click_tracking_deal_id ON click_tracking(deal_id);
CREATE INDEX idx_click_tracking_user_id ON click_tracking(user_id);
CREATE INDEX idx_click_tracking_click_time ON click_tracking(click_time DESC);
CREATE INDEX idx_click_tracking_status ON click_tracking(status);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_referral_code ON users(referral_code);

CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_stores_is_active ON stores(is_active);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- Full-text search indexes
CREATE INDEX idx_deals_search ON deals USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_stores_search ON stores USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data for development
INSERT INTO categories (name, name_zh, slug, description, description_zh, icon) VALUES
('Electronics', '电子产品', 'electronics', 'Electronic devices and gadgets', '电子设备和小工具', 'laptop'),
('Fashion', '时尚', 'fashion', 'Clothing and accessories', '服装和配饰', 'shirt'),
('Home & Garden', '家居园艺', 'home-garden', 'Home improvement and gardening', '家居改善和园艺', 'home'),
('Travel', '旅行', 'travel', 'Travel deals and bookings', '旅行优惠和预订', 'plane'),
('Health & Beauty', '健康美容', 'health-beauty', 'Health and beauty products', '健康和美容产品', 'heart');

INSERT INTO stores (name, name_zh, slug, website_url, affiliate_network, commission_rate, description, description_zh) VALUES
('Amazon', '亚马逊', 'amazon', 'https://amazon.com', 'amazon', 4.00, 'Global marketplace', '全球购物平台'),
('Best Buy', '百思买', 'bestbuy', 'https://bestbuy.com', 'cj', 2.50, 'Electronics retailer', '电子产品零售商'),
('Target', '塔吉特', 'target', 'https://target.com', 'impact', 3.00, 'Department store', '百货商店');

-- Create initial admin user (password: admin123)
INSERT INTO users (email, username, display_name, password_hash, role, is_active, email_verified) VALUES
('admin@riverad.com', 'admin', 'Admin User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqyc/Zo/.VjQxdQxKd/Lqsa', 'admin', true, true);

COMMENT ON DATABASE riverad IS 'River-AD: 中英双语CPS联盟营销优惠网站数据库';