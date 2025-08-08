import { useEffect, useState } from 'react';
import { Button, Card, Divider, Spin, Alert } from 'antd';

interface ApiResponse {
  status?: string;
  message?: string;
  timestamp?: string;
  service?: string;
  version?: string;
  success?: boolean;
  backend?: string;
  database?: string;
  cors?: string;
}

export default function ApiTestPage() {
  const [healthData, setHealthData] = useState<ApiResponse | null>(null);
  const [testData, setTestData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testHealthApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/health');
      const data = await response.json();
      setHealthData(data);
    } catch (err) {
      setError('健康检查 API 调用失败: ' + (err as Error).message);
    }
    setLoading(false);
  };

  const testApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/test');
      const data = await response.json();
      setTestData(data);
    } catch (err) {
      setError('测试 API 调用失败: ' + (err as Error).message);
    }
    setLoading(false);
  };

  const testBothApis = async () => {
    await testHealthApi();
    await testApi();
  };

  useEffect(() => {
    testBothApis();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        color: '#3B82F6', 
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        🔗 River-AD API 集成测试
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Health API Test */}
        <Card
          title="💚 健康检查 API"
          extra={
            <Button 
              type="primary" 
              onClick={testHealthApi} 
              loading={loading}
              size="small"
            >
              重新测试
            </Button>
          }
        >
          {healthData ? (
            <div style={{ fontFamily: 'monospace' }}>
              <p><strong>状态:</strong> <span style={{ color: 'green' }}>{healthData.status}</span></p>
              <p><strong>服务:</strong> {healthData.service}</p>
              <p><strong>版本:</strong> {healthData.version}</p>
              <p><strong>消息:</strong> {healthData.message}</p>
              <p><strong>时间:</strong> {healthData.timestamp}</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              {loading ? <Spin size="large" /> : '等待测试...'}
            </div>
          )}
        </Card>

        {/* Test API */}
        <Card
          title="🧪 功能测试 API"
          extra={
            <Button 
              type="primary" 
              onClick={testApi} 
              loading={loading}
              size="small"
            >
              重新测试
            </Button>
          }
        >
          {testData ? (
            <div style={{ fontFamily: 'monospace' }}>
              <p><strong>成功:</strong> <span style={{ color: testData.success ? 'green' : 'red' }}>
                {testData.success ? '✅' : '❌'}</span></p>
              <p><strong>消息:</strong> {testData.message}</p>
              <p><strong>后端:</strong> {testData.backend}</p>
              <p><strong>数据库:</strong> {testData.database}</p>
              <p><strong>CORS:</strong> {testData.cors}</p>
              <p><strong>时间:</strong> {testData.timestamp}</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              {loading ? <Spin size="large" /> : '等待测试...'}
            </div>
          )}
        </Card>
      </div>

      {error && (
        <Alert
          message="API 测试错误"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '2rem' }}
          action={
            <Button size="small" onClick={() => setError(null)}>
              关闭
            </Button>
          }
        />
      )}

      <Card title="🚀 服务状态总览">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ color: '#16A34A' }}>✅ 前端服务</h3>
            <ul style={{ color: '#15803D' }}>
              <li>Next.js 14 开发服务器</li>
              <li>端口: 3000</li>
              <li>状态: 运行中</li>
              <li>TypeScript 支持</li>
              <li>Ant Design 组件库</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ color: healthData?.status === 'UP' ? '#16A34A' : '#DC2626' }}>
              {healthData?.status === 'UP' ? '✅' : '❌'} 后端服务
            </h3>
            <ul style={{ color: healthData?.status === 'UP' ? '#15803D' : '#B91C1C' }}>
              <li>纯 Java HTTP 服务器</li>
              <li>端口: 8080</li>
              <li>状态: {healthData?.status || '未知'}</li>
              <li>CORS: 已配置</li>
              <li>API 版本: {healthData?.version || 'N/A'}</li>
            </ul>
          </div>
        </div>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Button 
            type="primary" 
            size="large" 
            onClick={testBothApis}
            loading={loading}
          >
            🔄 重新测试所有 API
          </Button>
        </div>

        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#F0F9FF', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#1E40AF', fontWeight: 'bold', margin: 0 }}>
            🎉 恭喜！River-AD 前后端服务已成功启动并连接！
          </p>
        </div>
      </Card>
    </div>
  );
}