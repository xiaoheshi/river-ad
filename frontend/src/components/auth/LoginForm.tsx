import React, { useState } from 'react';
import { Form, Input, Button, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values: LoginFormData) => {
    try {
      clearError();
      await login(values);
      message.success('登录成功！');
      router.push('/');
    } catch (err) {
      message.error(error || '登录失败，请重试');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          用户登录
        </h2>
        <p className="text-gray-600">
          没有账户？{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            立即注册
          </button>
        </p>
      </div>

      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        size="large"
        layout="vertical"
        className="space-y-4"
      >
        <Form.Item
          name="email"
          label="邮箱地址"
          rules={[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '邮箱格式不正确' }
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="请输入邮箱地址"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6位字符' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="请输入密码"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            className="rounded-lg"
          />
        </Form.Item>

        <div className="flex items-center justify-between mb-6">
          <div></div>
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-500"
            onClick={() => {
              message.info('忘记密码功能即将推出');
            }}
          >
            忘记密码？
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="w-full h-12 text-lg font-medium rounded-lg bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700"
          >
            立即登录
          </Button>
        </Form.Item>
      </Form>

      <Divider className="my-8">
        <span className="text-gray-400 text-sm">或者</span>
      </Divider>

      <div className="text-center">
        <p className="text-gray-600">
          没有账户？{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            立即注册
          </button>
        </p>
      </div>
    </div>
  );
};