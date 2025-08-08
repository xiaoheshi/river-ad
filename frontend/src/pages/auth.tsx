import React, { useState, useEffect } from 'react';
import { Layout, Card, Tabs, Row, Col, message } from 'antd';
import { LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/hooks/useAuth';

const { Content } = Layout;
const { TabPane } = Tabs;

const AuthPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('login');

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      message.info('您已登录，正在跳转...');
      router.push('/');
      return;
    }

    // Handle tab from URL query
    const tab = router.query.tab as string;
    if (tab && (tab === 'login' || tab === 'register')) {
      setActiveTab(tab);
    }
  }, [isAuthenticated, router]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    router.replace(`/auth?tab=${key}`, undefined, { shallow: true });
  };

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <Head>
        <title>{activeTab === 'login' ? '登录' : '注册'} - River-AD</title>
        <meta name="description" content="登录或注册 River-AD，开始您的优惠购物之旅" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Layout className="min-h-screen bg-gray-50">
        <Content className="flex items-center justify-center p-4">
          <div className="w-full max-w-6xl">
            <Row justify="center" align="middle" gutter={[32, 32]}>
              {/* Left Column - Branding */}
              <Col xs={0} lg={12}>
                <div className="text-center lg:text-left">
                  <div className="mb-8">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                      欢迎来到
                      <span className="block text-blue-600">River-AD</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      发现全球最优惠的购物机会
                      <br />
                      精选优质商品，享受超值折扣
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">精准推荐</h3>
                      <p className="text-gray-600 text-sm">
                        根据您的喜好，智能推荐最适合的优惠信息
                      </p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">💰</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">超值折扣</h3>
                      <p className="text-gray-600 text-sm">
                        独家优惠券，让您享受更多购物优惠
                      </p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">⚡</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">实时更新</h3>
                      <p className="text-gray-600 text-sm">
                        第一时间获取最新优惠，绝不错过好价格
                      </p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">🌍</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">全球商品</h3>
                      <p className="text-gray-600 text-sm">
                        汇集全球优质商家，品质有保障
                      </p>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Right Column - Auth Forms */}
              <Col xs={24} lg={12}>
                <Card 
                  className="shadow-xl border-0"
                  bodyStyle={{ padding: '2rem' }}
                >
                  <Tabs 
                    activeKey={activeTab} 
                    onChange={handleTabChange}
                    centered
                    size="large"
                    className="auth-tabs"
                  >
                    <TabPane
                      tab={
                        <span className="flex items-center space-x-2">
                          <LoginOutlined />
                          <span>登录</span>
                        </span>
                      }
                      key="login"
                    >
                      <LoginForm onSwitchToRegister={() => handleTabChange('register')} />
                    </TabPane>
                    
                    <TabPane
                      tab={
                        <span className="flex items-center space-x-2">
                          <UserAddOutlined />
                          <span>注册</span>
                        </span>
                      }
                      key="register"
                    >
                      <RegisterForm onSwitchToLogin={() => handleTabChange('login')} />
                    </TabPane>
                  </Tabs>
                </Card>
                
                {/* Additional Info */}
                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>
                    注册即表示您同意我们的{' '}
                    <a href="/terms" className="text-blue-600 hover:text-blue-700">
                      服务条款
                    </a>{' '}
                    和{' '}
                    <a href="/privacy" className="text-blue-600 hover:text-blue-700">
                      隐私政策
                    </a>
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>

      <style jsx global>{`
        .auth-tabs .ant-tabs-tab {
          font-weight: 500;
          font-size: 16px;
        }
        
        .auth-tabs .ant-tabs-tab-active {
          color: #3b82f6 !important;
        }
        
        .auth-tabs .ant-tabs-ink-bar {
          background: #3b82f6 !important;
        }
      `}</style>
    </>
  );
};

export default AuthPage;