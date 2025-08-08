import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

const { Option } = Select;

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  preferredLanguage: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterFormData) => {
    try {
      clearError();
      const { confirmPassword, ...registerData } = values;
      await register(registerData);
      message.success('注册成功！欢迎加入River-AD！');
      router.push('/');
    } catch (err) {
      message.error(error || '注册失败，请重试');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          用户注册
        </h2>
        <p className="text-gray-600">
          已有账户？{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            立即登录
          </button>
        </p>
      </div>

      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        size="large"
        layout="vertical"
        className="space-y-4"
        scrollToFirstError
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="firstName"
            label="名字"
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="请输入名字"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="姓氏"
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="请输入姓氏"
              className="rounded-lg"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="email"
          label="邮箱地址"
          rules={[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '邮箱格式不正确' }
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="请输入邮箱地址"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="preferredLanguage"
          label="首选语言 / Preferred Language"
        >
          <Select
            placeholder="选择语言 / Select Language"
            className="rounded-lg"
            defaultValue="en"
          >
            <Option value="en">🇺🇸 English</Option>
            <Option value="zh">🇨🇳 中文</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6位字符' }
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="请输入密码"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="确认密码"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: '请确认密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次密码输入不一致'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="请确认密码"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            className="rounded-lg"
          />
        </Form.Item>

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
            立即注册
          </Button>
        </Form.Item>
      </Form>

      <Divider className="my-8">
        <span className="text-gray-400 text-sm">或者</span>
      </Divider>

      <div className="text-center">
        <p className="text-gray-600">
          已有账户？{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            立即登录
          </button>
        </p>
      </div>
    </div>
  );
};