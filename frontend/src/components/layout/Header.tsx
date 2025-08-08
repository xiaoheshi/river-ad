import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space, Input, Select } from 'antd';
import { 
  UserOutlined, 
  SearchOutlined, 
  GlobalOutlined,
  MenuOutlined,
  HomeOutlined,
  TagOutlined,
  ShopOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const { Header: AntHeader } = Layout;
const { Search } = Input;
const { Option } = Select;

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const handleSearch = (value: string) => {
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    // Update user preference if logged in
    // TODO: Call API to update user preference
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link href="/profile">{t('common.profile')}</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link href="/settings">设置</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        {t('common.logout')}
      </Menu.Item>
    </Menu>
  );

  const navigationItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: t('common.home'),
      href: '/'
    },
    {
      key: 'deals',
      icon: <TagOutlined />,
      label: t('common.deals'),
      href: '/deals'
    },
    {
      key: 'categories',
      icon: <TagOutlined />,
      label: t('common.categories'),
      href: '/categories'
    },
    {
      key: 'stores',
      icon: <ShopOutlined />,
      label: t('common.stores'),
      href: '/stores'
    }
  ];

  return (
    <AntHeader className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              River-AD
            </span>
          </Link>
        </div>

        {/* Navigation - Desktop */}
        <div className="hidden lg:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                router.pathname === item.href
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:block flex-1 max-w-lg mx-8">
          <Search
            placeholder={t('deals.searchPlaceholder')}
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            onSearch={handleSearch}
            className="w-full"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <Select
            value={i18n.language}
            onChange={handleLanguageChange}
            size="small"
            className="w-20"
            suffixIcon={<GlobalOutlined />}
          >
            <Option value="en">🇺🇸</Option>
            <Option value="zh">🇨🇳</Option>
          </Select>

          {/* User Section */}
          {isAuthenticated && user ? (
            <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
              <Space className="cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2">
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  src={user.firstName ? undefined : null}
                  className="bg-primary-600"
                >
                  {user.firstName?.[0]?.toUpperCase()}
                </Avatar>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user.firstName || user.email}
                </span>
              </Space>
            </Dropdown>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth">
                <Button 
                  type="default" 
                  size="middle"
                  icon={<LoginOutlined />}
                  className="hidden sm:flex"
                >
                  {t('common.login')}
                </Button>
                <Button
                  type="text"
                  size="middle"
                  icon={<LoginOutlined />}
                  className="sm:hidden"
                />
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
            className="lg:hidden"
          />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <Search
          placeholder={t('deals.searchPlaceholder')}
          allowClear
          enterButton={<SearchOutlined />}
          size="middle"
          onSearch={handleSearch}
        />
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuVisible && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  router.pathname === item.href
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuVisible(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </AntHeader>
  );
};