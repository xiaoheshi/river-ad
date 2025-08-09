import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Button, Spin, Typography } from 'antd';
import { ShopOutlined, EyeOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

interface Deal {
  id: number;
  titleZh: string;
  titleEn: string;
  salePrice: number;
  originalPrice: number;
  discountPercentage: number;
  store: { name: string };
  category: { nameZh: string };
  clickCount: number;
}

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/deals')
      .then(res => res.json())
      .then(data => {
        setDeals(data.content || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('获取数据失败:', err);
        setLoading(false);
      });
  }, []);

  const handleDealClick = async (dealId: number, affiliateUrl: string) => {
    try {
      // 联盟追踪
      await fetch('http://localhost:8080/api/affiliate/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, userId: Math.floor(Math.random() * 1000) })
      });
      
      // 模拟跳转（实际项目中会跳转到真实链接）
      alert(`🎉 联盟追踪成功！优惠ID: ${dealId}`);
    } catch (error) {
      console.error('追踪失败:', error);
    }
  };

  return (
    <Layout className="min-h-screen">
      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '64px' }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            🌊 River-AD
          </Title>
          <Text style={{ marginLeft: '16px', color: '#666' }}>
            全球优惠，一键直达
          </Text>
        </div>
      </Header>

      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={1}>🎯 精选优惠</Title>
            <Text type="secondary">
              为您精心挑选的全球优质商品优惠信息
            </Text>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px' }}>
                <Text>正在加载优惠数据...</Text>
              </div>
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {deals.map(deal => (
                <Col key={deal.id} xs={24} sm={12} lg={8} xl={6}>
                  <Card
                    hoverable
                    actions={[
                      <Button
                        key="view"
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleDealClick(deal.id, `https://example.com/deal/${deal.id}`)}
                      >
                        获取优惠
                      </Button>
                    ]}
                    style={{ height: '100%' }}
                  >
                    <div style={{ height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <Title level={4} style={{ fontSize: '16px', lineHeight: '1.4', marginBottom: '8px' }}>
                          {deal.titleZh}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '12px' }}>
                          {deal.titleEn}
                        </Text>
                      </div>
                      
                      <div>
                        <div style={{ marginBottom: '8px' }}>
                          <Text strong style={{ fontSize: '18px', color: '#f5222d' }}>
                            ${deal.salePrice}
                          </Text>
                          {deal.originalPrice && (
                            <>
                              <Text
                                delete
                                type="secondary"
                                style={{ marginLeft: '8px', fontSize: '14px' }}
                              >
                                ${deal.originalPrice}
                              </Text>
                              <Text
                                strong
                                style={{ 
                                  marginLeft: '8px', 
                                  color: '#f5222d', 
                                  fontSize: '12px',
                                  background: '#fff1f0',
                                  padding: '2px 6px',
                                  borderRadius: '4px'
                                }}
                              >
                                -{Math.round(deal.discountPercentage)}%
                              </Text>
                            </>
                          )}
                        </div>
                        
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          <ShopOutlined style={{ marginRight: '4px' }} />
                          {deal.store.name} | {deal.category.nameZh}
                        </div>
                        
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                          {deal.clickCount} 人已获取
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {!loading && deals.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px' }}>
              <Text type="secondary">暂无优惠数据，请确保后端服务正在运行</Text>
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
}