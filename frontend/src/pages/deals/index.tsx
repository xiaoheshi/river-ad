import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Breadcrumb, Typography, Button, Space } from 'antd';
import { HomeOutlined, TagOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Header } from '@/components/layout/Header';
import { DealFilters } from '@/components/deals/DealFilters';
import { DealGrid } from '@/components/deals/DealGrid';
import { useDealsStore } from '@/store/dealsStore';
import { SearchFilters } from '@/types';

const { Content } = Layout;
const { Title } = Typography;

const DealsPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    deals,
    isLoading,
    error,
    totalPages,
    currentPage,
    pageSize,
    totalElements,
    searchFilters,
    fetchDeals,
    setSearchFilters,
    setCurrentPage,
    clearError
  } = useDealsStore();

  const [localFilters, setLocalFilters] = useState<SearchFilters>({});

  useEffect(() => {
    // Parse URL parameters on mount
    const urlParams = new URLSearchParams(window.location.search);
    const filters: SearchFilters = {};
    
    // Parse category
    const categoryId = urlParams.get('category');
    if (categoryId) filters.categoryId = parseInt(categoryId);
    
    // Parse store
    const storeId = urlParams.get('store');
    if (storeId) filters.storeId = parseInt(storeId);
    
    // Parse price range
    const minPrice = urlParams.get('minPrice');
    const maxPrice = urlParams.get('maxPrice');
    if (minPrice) filters.minPrice = parseInt(minPrice);
    if (maxPrice) filters.maxPrice = parseInt(maxPrice);
    
    // Parse sort
    const sortBy = urlParams.get('sort') as SearchFilters['sortBy'];
    if (sortBy) filters.sortBy = sortBy;
    
    // Parse pagination
    const page = urlParams.get('page');
    if (page) setCurrentPage(parseInt(page) - 1); // Convert to 0-based
    
    setLocalFilters(filters);
    setSearchFilters(filters);
    
    // Fetch deals with initial filters
    fetchDeals({
      page: page ? parseInt(page) - 1 : 0,
      size: pageSize,
      ...filters
    });
  }, []);

  const updateURL = (filters: SearchFilters, page?: number) => {
    const params = new URLSearchParams();
    
    if (filters.categoryId) params.set('category', filters.categoryId.toString());
    if (filters.storeId) params.set('store', filters.storeId.toString());
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.sortBy) params.set('sort', filters.sortBy);
    if (page && page > 0) params.set('page', (page + 1).toString()); // Convert to 1-based
    
    const url = params.toString() ? `/deals?${params.toString()}` : '/deals';
    router.replace(url, undefined, { shallow: true });
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setLocalFilters(newFilters);
  };

  const handleSearch = () => {
    setSearchFilters(localFilters);
    setCurrentPage(0);
    updateURL(localFilters, 0);
    
    fetchDeals({
      page: 0,
      size: pageSize,
      ...localFilters
    });
  };

  const handleReset = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    setSearchFilters(emptyFilters);
    setCurrentPage(0);
    updateURL(emptyFilters, 0);
    
    fetchDeals({ page: 0, size: pageSize });
  };

  const handlePageChange = (page: number, size?: number) => {
    const newPage = page - 1; // Convert to 0-based
    const newSize = size || pageSize;
    
    setCurrentPage(newPage);
    updateURL(searchFilters, newPage);
    
    fetchDeals({
      page: newPage,
      size: newSize,
      ...searchFilters
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    clearError();
    fetchDeals({
      page: currentPage,
      size: pageSize,
      ...searchFilters
    });
  };

  const getPageTitle = () => {
    if (searchFilters.categoryId || searchFilters.storeId) {
      return '筛选结果';
    }
    return t('deals.title');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle()} - River-AD</title>
        <meta name="description" content="发现最新最优惠的海外折扣信息，精选全球热门商品优惠券" />
        <meta name="keywords" content="优惠,折扣,海外购物,优惠券,deals,discount" />
      </Head>

      <Layout className="min-h-screen bg-gray-50">
        <Header />
        
        <Content className="py-6">
          <div className="max-w-7xl mx-auto px-4">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
              <Breadcrumb.Item>
                <Link href="/">
                  <HomeOutlined /> 首页
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <TagOutlined /> 优惠信息
              </Breadcrumb.Item>
            </Breadcrumb>

            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <Title level={1} className="mb-2">
                    {getPageTitle()}
                  </Title>
                  <p className="text-gray-600">
                    发现最新最优惠的购物机会，享受超值折扣
                  </p>
                </div>
                
                <Space>
                  {error && (
                    <Button 
                      icon={<ReloadOutlined />} 
                      onClick={handleRetry}
                      loading={isLoading}
                    >
                      重试
                    </Button>
                  )}
                </Space>
              </div>
            </div>

            <Row gutter={[24, 24]}>
              {/* Filters Sidebar */}
              <Col xs={24} lg={6}>
                <div className="sticky top-6">
                  <DealFilters
                    filters={localFilters}
                    onFiltersChange={handleFiltersChange}
                    onSearch={handleSearch}
                    onReset={handleReset}
                    loading={isLoading}
                  />
                </div>
              </Col>

              {/* Main Content */}
              <Col xs={24} lg={18}>
                <DealGrid
                  deals={deals}
                  loading={isLoading}
                  error={error}
                  currentPage={currentPage + 1} // Convert to 1-based for display
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalElements={totalElements}
                  onPageChange={handlePageChange}
                  onRetry={handleRetry}
                  showCategory={true}
                  showStore={true}
                />
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </>
  );
};

export default DealsPage;