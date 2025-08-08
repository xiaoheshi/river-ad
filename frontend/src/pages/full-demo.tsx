import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Button, Tag, Spin, Alert, Input, Select, Pagination, Space, Divider, message } from 'antd';
import { SearchOutlined, FireOutlined, TagsOutlined, ShopOutlined, EyeOutlined, CopyOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

interface Deal {
  id: number;
  titleEn: string;
  titleZh: string;
  descriptionEn: string;
  descriptionZh: string;
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  couponCode?: string;
  category: Category;
  store: Store;
  expiresAt: string;
  isActive: boolean;
  isFeatured: boolean;
  clickCount: number;
  createdAt: string;
  dealUrl: string;
  affiliateUrl: string;
  imageUrl: string;
}

interface Category {
  id: number;
  nameEn: string;
  nameZh: string;
  slug: string;
  descriptionEn: string;
  descriptionZh: string;
  isActive: boolean;
  displayOrder: number;
}

interface Store {
  id: number;
  name: string;
  slug: string;
  description: string;
  websiteUrl: string;
  logoUrl: string;
  commissionRate: number;
  isActive: boolean;
}

interface DealsResponse {
  content: Deal[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export default function FullDemoPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  
  // Language
  const [language, setLanguage] = useState<'en' | 'zh'>('en');

  const API_BASE = 'http://localhost:8080/api';

  useEffect(() => {
    fetchCategories();
    fetchStores();
    fetchDeals();
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [currentPage, pageSize, selectedCategory, selectedStore, sortBy]);

  const fetchDeals = async (keyword?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `${API_BASE}/deals?page=${currentPage - 1}&size=${pageSize}`;
      
      if (keyword) {
        url = `${API_BASE}/deals/search?keyword=${encodeURIComponent(keyword)}&page=${currentPage - 1}&size=${pageSize}`;
      } else {
        if (selectedCategory) url += `&categoryId=${selectedCategory}`;
        if (selectedStore) url += `&storeId=${selectedStore}`;
        if (sortBy) url += `&sortBy=${sortBy}`;
      }
      
      const response = await fetch(url);
      const data: DealsResponse = await response.json();
      
      setDeals(data.content);
      setTotalElements(data.totalElements);
      setCurrentPage(data.number + 1);
    } catch (err) {
      setError('获取优惠信息失败: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch(`${API_BASE}/stores`);
      const data: Store[] = await response.json();
      setStores(data);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    }
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
    setSelectedCategory(null);
    setSelectedStore(null);
    fetchDeals(value);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    setSearchKeyword('');
    fetchDeals();
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const handleDealClick = async (dealId: number) => {
    try {
      await fetch(`${API_BASE}/deals/${dealId}/click`, { method: 'POST' });
      await fetch(`${API_BASE}/affiliate/track`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId })
      });
      
      // Update click count locally
      setDeals(prevDeals => 
        prevDeals.map(deal => 
          deal.id === dealId ? { ...deal, clickCount: deal.clickCount + 1 } : deal
        )
      );
    } catch (err) {
      console.error('Failed to track click:', err);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    message.success('优惠券代码已复制！');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getTitle = (deal: Deal) => language === 'zh' ? deal.titleZh : deal.titleEn;
  const getDescription = (deal: Deal) => language === 'zh' ? deal.descriptionZh : deal.descriptionEn;
  const getCategoryName = (category: Category) => language === 'zh' ? category.nameZh : category.nameEn;

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🌟 River-AD 完整演示
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              双语优惠平台 - 发现全球最优惠的购物机会
            </p>
            
            <div className="flex justify-center space-x-4 mb-6">
              <Button 
                type={language === 'en' ? 'primary' : 'default'} 
                onClick={() => setLanguage('en')}
              >
                🇺🇸 English
              </Button>
              <Button 
                type={language === 'zh' ? 'primary' : 'default'} 
                onClick={() => setLanguage('zh')}
              >
                🇨🇳 中文
              </Button>
            </div>
          </div>

          {/* Search & Filters */}
          <Card className="mb-6">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Search
                  placeholder={language === 'zh' ? "搜索优惠、品牌、商品..." : "Search deals, brands, products..."}
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="large"
                  onSearch={handleSearch}
                />
              </Col>
              
              <Col xs={24} sm={8} md={4}>
                <Select
                  placeholder={language === 'zh' ? "选择分类" : "Category"}
                  allowClear
                  size="large"
                  style={{ width: '100%' }}
                  value={selectedCategory}
                  onChange={(value) => {
                    setSelectedCategory(value);
                    handleFilterChange();
                  }}
                >
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>
                      {getCategoryName(category)}
                    </Option>
                  ))}
                </Select>
              </Col>
              
              <Col xs={24} sm={8} md={4}>
                <Select
                  placeholder={language === 'zh' ? "选择商店" : "Store"}
                  allowClear
                  size="large"
                  style={{ width: '100%' }}
                  value={selectedStore}
                  onChange={(value) => {
                    setSelectedStore(value);
                    handleFilterChange();
                  }}
                >
                  {stores.map(store => (
                    <Option key={store.id} value={store.id}>
                      {store.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              
              <Col xs={24} sm={8} md={4}>
                <Select
                  placeholder={language === 'zh' ? "排序方式" : "Sort by"}
                  size="large"
                  style={{ width: '100%' }}
                  value={sortBy}
                  onChange={(value) => {
                    setSortBy(value);
                    handleFilterChange();
                  }}
                >
                  <Option value="newest">{language === 'zh' ? '最新' : 'Newest'}</Option>
                  <Option value="popularity">{language === 'zh' ? '热门' : 'Popular'}</Option>
                  <Option value="price_low">{language === 'zh' ? '价格：低到高' : 'Price: Low to High'}</Option>
                  <Option value="price_high">{language === 'zh' ? '价格：高到低' : 'Price: High to Low'}</Option>
                </Select>
              </Col>
              
              <Col xs={24} md={4}>
                <Button
                  size="large"
                  style={{ width: '100%' }}
                  onClick={() => {
                    setSearchKeyword('');
                    setSelectedCategory(null);
                    setSelectedStore(null);
                    setSortBy('newest');
                    setCurrentPage(1);
                    fetchDeals();
                  }}
                >
                  {language === 'zh' ? '重置' : 'Reset'}
                </Button>
              </Col>
            </Row>
          </Card>

          {/* Results Summary */}
          {!loading && (
            <div className="mb-4">
              <p className="text-gray-600">
                {language === 'zh' ? 
                  `显示 ${totalElements} 个优惠中的 ${((currentPage - 1) * pageSize) + 1}-${Math.min(currentPage * pageSize, totalElements)} 个` :
                  `Showing ${((currentPage - 1) * pageSize) + 1}-${Math.min(currentPage * pageSize, totalElements)} of ${totalElements} deals`
                }
                {searchKeyword && ` | ${language === 'zh' ? '搜索' : 'Search'}: "${searchKeyword}"`}
              </p>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              className="mb-6"
              onClose={() => setError(null)}
            />
          )}

          {/* Deals Grid */}
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              {deals.map(deal => (
                <Col key={deal.id} xs={24} sm={12} lg={8} xl={6}>
                  <Card
                    hoverable
                    className="h-full"
                    cover={
                      <div className="relative h-48 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
                        <div className="text-4xl">📦</div>
                        {deal.isFeatured && (
                          <Tag color="gold" className="absolute top-2 right-2">
                            <FireOutlined /> {language === 'zh' ? '精选' : 'Featured'}
                          </Tag>
                        )}
                        {deal.discountPercentage > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                            -{Math.round(deal.discountPercentage)}%
                          </div>
                        )}
                      </div>
                    }
                    actions={[
                      <Button 
                        key="view" 
                        type="link" 
                        icon={<EyeOutlined />}
                        onClick={() => handleDealClick(deal.id)}
                      >
                        {language === 'zh' ? '查看' : 'View'}
                      </Button>,
                      deal.couponCode ? (
                        <Button
                          key="copy"
                          type="link"
                          icon={<CopyOutlined />}
                          onClick={() => copyCode(deal.couponCode!)}
                        >
                          {language === 'zh' ? '复制代码' : 'Copy Code'}
                        </Button>
                      ) : (
                        <Button
                          key="get"
                          type="primary"
                          size="small"
                          onClick={() => handleDealClick(deal.id)}
                        >
                          {language === 'zh' ? '获取优惠' : 'Get Deal'}
                        </Button>
                      )
                    ]}
                  >
                    <div className="space-y-3">
                      <h3 className="text-base font-semibold line-clamp-2 min-h-[3rem]">
                        {getTitle(deal)}
                      </h3>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-red-600">
                          {formatPrice(deal.salePrice)}
                        </span>
                        {deal.originalPrice && deal.originalPrice !== deal.salePrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(deal.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 min-h-[2.5rem]">
                        {getDescription(deal)}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          <TagsOutlined className="mr-1" />
                          {getCategoryName(deal.category)}
                        </span>
                        <span className="flex items-center">
                          <ShopOutlined className="mr-1" />
                          {deal.store.name}
                        </span>
                      </div>
                      
                      {deal.couponCode && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded px-2 py-1">
                          <span className="text-xs text-yellow-800">
                            {language === 'zh' ? '优惠券' : 'Coupon'}: <strong>{deal.couponCode}</strong>
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>{deal.clickCount} {language === 'zh' ? '人已获取' : 'clicks'}</span>
                        <span>{language === 'zh' ? '截止' : 'Expires'} {formatDate(deal.expiresAt)}</span>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Spin>

          {/* Pagination */}
          {totalElements > pageSize && (
            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                total={totalElements}
                pageSize={pageSize}
                showTotal={(total, range) => 
                  language === 'zh' ?
                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条` :
                    `${range[0]}-${range[1]} of ${total} items`
                }
                showSizeChanger
                showQuickJumper
                pageSizeOptions={['12', '24', '48', '96']}
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
              />
            </div>
          )}

          {/* Footer Info */}
          <Divider />
          <div className="text-center text-gray-500">
            <p className="mb-2">
              🎉 River-AD 完整演示 - 双语优惠平台
            </p>
            <p className="text-sm">
              后端API运行在 localhost:8080 | 前端运行在 localhost:3000
            </p>
          </div>
        </div>
      </Content>
    </Layout>
  );
}