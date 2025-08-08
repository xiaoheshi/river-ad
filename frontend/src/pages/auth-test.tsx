import React, { useState } from 'react';
import { Layout, Card, Button, Form, Input, message, Space, Divider } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

const { Content } = Layout;

export default function AuthTestPage() {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values);
      message.success('登录成功！');
    } catch (error) {
      message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
      await register(values);
      message.success('注册成功！');
    } catch (error) {
      message.error('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    message.info('已退出登录');
  };

  if (isAuthenticated && user) {
    return (
      <Layout className="min-h-screen bg-gray-50">
        <Content className="flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">欢迎回来！</h2>
              <p className="text-gray-600">您已成功登录</p>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">用户信息</h3>
                <div className="text-sm text-green-700">
                  <p><strong>用户ID:</strong> {user.id}</p>
                  <p><strong>邮箱:</strong> {user.email}</p>
                  <p><strong>姓名:</strong> {user.firstName} {user.lastName}</p>
                  <p><strong>语言偏好:</strong> {user.preferredLanguage}</p>
                  <p><strong>认证状态:</strong> {isAuthenticated ? '已认证' : '未认证'}</p>
                </div>
              </div>

              <Space className="w-full" direction="vertical">
                <Button 
                  type="primary" 
                  block 
                  onClick={() => router.push('/full-demo')}
                >
                  查看完整演示
                </Button>
                <Button 
                  block 
                  onClick={() => router.push('/')}
                >
                  返回首页
                </Button>
                <Button 
                  block 
                  danger 
                  onClick={handleLogout}
                >
                  退出登录
                </Button>
              </Space>
            </div>
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">认证测试</h1>
            <p className="text-gray-600">测试登录和注册功能</p>
          </div>

          {/* 快速登录 */}
          <Card title="快速登录测试">
            <Form onFinish={handleLogin} layout="vertical">
              <Form.Item
                name="email"
                label="邮箱"
                initialValue="demo@example.com"
                rules={[{ required: true, type: 'email' }]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
              <Form.Item
                name="password"
                label="密码"
                initialValue="password123"
                rules={[{ required: true, min: 6 }]}
              >
                <Input.Password placeholder="请输入密码" />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                测试登录
              </Button>
            </Form>
          </Card>

          <Divider>或者</Divider>

          {/* 快速注册 */}
          <Card title="快速注册测试">
            <Form onFinish={handleRegister} layout="vertical">
              <Form.Item
                name="firstName"
                label="名字"
                initialValue="测试"
                rules={[{ required: true }]}
              >
                <Input placeholder="请输入名字" />
              </Form.Item>
              <Form.Item
                name="lastName"
                label="姓氏"
                initialValue="用户"
                rules={[{ required: true }]}
              >
                <Input placeholder="请输入姓氏" />
              </Form.Item>
              <Form.Item
                name="email"
                label="邮箱"
                initialValue={`test${Date.now()}@example.com`}
                rules={[{ required: true, type: 'email' }]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
              <Form.Item
                name="password"
                label="密码"
                initialValue="password123"
                rules={[{ required: true, min: 6 }]}
              >
                <Input.Password placeholder="请输入密码" />
              </Form.Item>
              <Form.Item
                name="preferredLanguage"
                label="首选语言"
                initialValue="zh"
              >
                <Input placeholder="zh 或 en" />
              </Form.Item>
              <Button type="default" htmlType="submit" loading={loading} block>
                测试注册
              </Button>
            </Form>
          </Card>

          <div className="text-center">
            <Button type="link" onClick={() => router.push('/auth')}>
              使用完整认证页面
            </Button>
          </div>
        </div>
      </Content>
    </Layout>
  );
}