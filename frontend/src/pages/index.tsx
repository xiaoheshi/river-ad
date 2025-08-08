import React, { useEffect } from 'react';
import { Layout, Row, Col, Typography, Space, Button, Carousel, Divider } from 'antd';
import { 
  SearchOutlined, 
  FireOutlined, 
  StarOutlined,
  TagOutlined,
  ShopOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { DealCard } from '@/components/deals/DealCard';
import { DealGrid } from '@/components/deals/DealGrid';
import { useDealsStore } from '@/store/dealsStore';
import Head from 'next/head';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { 
    deals, 
    popularDeals,
    categories,
    stores,
    isLoading,
    isLoadingPopular,
    fetchDeals,
    fetchPopularDeals,
    fetchCategories,
    fetchStores
  } = useDealsStore();

  useEffect(() => {
    // Fetch initial data
    fetchDeals({ page: 0, size: 8 });
    fetchPopularDeals(6);
    fetchCategories();
    fetchStores();
  }, [fetchDeals, fetchPopularDeals, fetchCategories, fetchStores]);

  const handleSearch = (value: string) => {
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <>
      <Head>
        <title>River-AD - 海外优惠折扣平台</title>
        <meta name="description" content="发现最新最优惠的海外折扣信息，精选全球热门商品优惠券" />
        <meta name="keywords" content="优惠,折扣,海外购物,优惠券,deals,discount" />
      </Head>
      
      <Layout className="min-h-screen bg-gray-50">
        <Header />
        
        <Content>
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <Title level={1} className="text-white mb-6 text-4xl lg:text-6xl">
                发现全球最优惠
              </Title>
              <Paragraph className="text-primary-100 text-lg lg:text-xl mb-8 max-w-2xl mx-auto">
                精选海外优质商品优惠信息，让您轻松享受最低价购物体验
              </Paragraph>
              
              {/* Hero Search */}
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-full p-2 shadow-lg">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder={t('deals.searchPlaceholder')}
                      className="flex-1 px-6 py-4 text-lg border-none outline-none rounded-l-full"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch((e.target as HTMLInputElement).value);
                        }
                      }}
                    />
                    <Button
                      type="primary"
                      size="large"
                      icon={<SearchOutlined />}
                      className="rounded-full px-8 py-4 h-auto"
                      onClick={() => {
                        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                        handleSearch(input.value);
                      }}
                    >
                      搜索
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">500+</div>
                  <div className="text-primary-200">精选优惠</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">50+</div>
                  <div className="text-primary-200">合作商家</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">5000+</div>
                  <div className="text-primary-200">用户信赖</div>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Deals Section */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <FireOutlined className="text-2xl text-red-500" />
                  <Title level={2} className="mb-0">
                    {t('common.popular')} 热门优惠
                  </Title>
                </div>
                <Link href="/deals">
                  <Button type="link" size="large">
                    查看全部 <RightOutlined />
                  </Button>
                </Link>
              </div>
              
              <DealGrid
                deals={popularDeals}
                loading={isLoadingPopular}
                variant="featured"
                showCategory={true}
                showStore={true}
              />
            </div>
          </section>

          <Divider />

          {/* Categories Section */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <TagOutlined className="text-2xl text-blue-500" />
                  <Title level={2} className="mb-0">
                    热门分类
                  </Title>
                </div>
                <Link href="/categories">
                  <Button type="link" size="large">
                    查看全部 <RightOutlined />
                  </Button>
                </Link>
              </div>
              
              <Row gutter={[16, 16]}>
                {categories.slice(0, 8).map((category) => (
                  <Col key={category.id} xs={12} sm={8} md={6} lg={4} xl={3}>
                    <Link href={`/categories/${category.slug}`}>
                      <div className="bg-gray-50 hover:bg-primary-50 rounded-lg p-6 text-center transition-colors cursor-pointer group">
                        {category.iconUrl && (
                          <img 
                            src={category.iconUrl} 
                            alt={category.nameZh}
                            className="w-12 h-12 mx-auto mb-3"
                          />
                        )}
                        <h3 className="font-medium text-gray-900 group-hover:text-primary-600">
                          {category.nameZh}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {category.descriptionZh?.slice(0, 30)}...
                        </p>
                      </div>
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>
          </section>

          {/* Latest Deals Section */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <StarOutlined className="text-2xl text-yellow-500" />
                  <Title level={2} className="mb-0">
                    最新优惠
                  </Title>
                </div>
                <Link href="/deals">
                  <Button type="link" size="large">
                    查看全部 <RightOutlined />
                  </Button>
                </Link>
              </div>
              
              <DealGrid
                deals={deals}
                loading={isLoading}
                showCategory={true}
                showStore={true}
              />
            </div>
          </section>

          {/* Stores Section */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <ShopOutlined className="text-2xl text-green-500" />
                  <Title level={2} className="mb-0">
                    热门商店
                  </Title>
                </div>
                <Link href="/stores">
                  <Button type="link" size="large">
                    查看全部 <RightOutlined />
                  </Button>
                </Link>
              </div>
              
              <Row gutter={[16, 16]}>
                {stores.slice(0, 12).map((store) => (
                  <Col key={store.id} xs={12} sm={8} md={6} lg={4} xl={3}>
                    <Link href={`/stores/${store.slug}`}>
                      <div className="bg-gray-50 hover:bg-primary-50 rounded-lg p-4 text-center transition-colors cursor-pointer group border-2 border-transparent hover:border-primary-200">
                        {store.logoUrl && (
                          <img 
                            src={store.logoUrl} 
                            alt={store.name}
                            className="w-16 h-16 mx-auto mb-3 object-contain"
                          />
                        )}
                        <h3 className="font-medium text-gray-900 group-hover:text-primary-600">
                          {store.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {store.description?.slice(0, 40)}...
                        </p>
                      </div>
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 bg-gradient-to-r from-secondary-600 to-primary-600">
            <div className="max-w-4xl mx-auto text-center">
              <Title level={2} className="text-white mb-4">
                准备好开始省钱了吗？
              </Title>
              <Paragraph className="text-secondary-100 text-lg mb-8">
                加入我们，获取最新优惠信息和独家折扣码
              </Paragraph>
              <Space size="large">
                <Button type="default" size="large" onClick={() => router.push('/deals')}>
                  浏览所有优惠
                </Button>
                <Button type="primary" size="large" onClick={() => router.push('/auth')}>
                  免费注册
                </Button>
              </Space>
            </div>
          </section>
        </Content>
      </Layout>
    </>
  );
};

export default HomePage;