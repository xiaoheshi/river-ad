import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 英文翻译
const enTranslation = {
  common: {
    // Navigation
    home: 'Home',
    deals: 'Deals',
    categories: 'Categories',
    stores: 'Stores',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    profile: 'Profile',
    
    // Actions
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    reset: 'Reset',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    loading: 'Loading...',
    
    // Deals
    originalPrice: 'Original Price',
    salePrice: 'Sale Price',
    discount: 'Discount',
    couponCode: 'Coupon Code',
    expiresAt: 'Expires At',
    viewDeal: 'View Deal',
    getDeal: 'Get Deal',
    copyCode: 'Copy Code',
    popular: 'Popular',
    featured: 'Featured',
    
    // Pagination
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    showing: 'Showing',
    to: 'to',
    results: 'results',
    
    // Status
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
  },
  
  auth: {
    loginTitle: 'Sign In to Your Account',
    registerTitle: 'Create New Account',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    signUp: 'Sign Up',
    signIn: 'Sign In',
    
    // Validation
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 6 characters',
    passwordsNotMatch: 'Passwords do not match',
    
    // Messages
    loginSuccess: 'Login successful',
    registerSuccess: 'Registration successful',
    loginFailed: 'Login failed',
    registerFailed: 'Registration failed',
  },
  
  deals: {
    title: 'Latest Deals',
    searchPlaceholder: 'Search for deals, stores, products...',
    noResults: 'No deals found',
    loadMore: 'Load More',
    sortBy: 'Sort by',
    sortNewest: 'Newest',
    sortPriceLow: 'Price: Low to High',
    sortPriceHigh: 'Price: High to Low',
    sortPopularity: 'Popularity',
    
    filters: {
      category: 'Category',
      store: 'Store',
      priceRange: 'Price Range',
      minPrice: 'Min Price',
      maxPrice: 'Max Price',
    }
  },
  
  categories: {
    title: 'Categories',
    all: 'All Categories',
    viewAll: 'View All',
  },
  
  stores: {
    title: 'Stores',
    all: 'All Stores',
    viewDeals: 'View Deals',
  }
};

// 中文翻译
const zhTranslation = {
  common: {
    // Navigation
    home: '首页',
    deals: '优惠',
    categories: '分类',
    stores: '商店',
    login: '登录',
    register: '注册',
    logout: '退出',
    profile: '个人资料',
    
    // Actions
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    reset: '重置',
    save: '保存',
    cancel: '取消',
    submit: '提交',
    loading: '加载中...',
    
    // Deals
    originalPrice: '原价',
    salePrice: '折扣价',
    discount: '折扣',
    couponCode: '优惠券代码',
    expiresAt: '截止时间',
    viewDeal: '查看优惠',
    getDeal: '获取优惠',
    copyCode: '复制代码',
    popular: '热门',
    featured: '精选',
    
    // Pagination
    previous: '上一页',
    next: '下一页',
    page: '第',
    of: '页，共',
    showing: '显示',
    to: '到',
    results: '条结果',
    
    // Status
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '信息',
  },
  
  auth: {
    loginTitle: '登录您的账户',
    registerTitle: '创建新账户',
    email: '邮箱地址',
    password: '密码',
    confirmPassword: '确认密码',
    firstName: '名',
    lastName: '姓',
    forgotPassword: '忘记密码？',
    noAccount: '没有账户？',
    hasAccount: '已有账户？',
    signUp: '注册',
    signIn: '登录',
    
    // Validation
    emailRequired: '邮箱是必填项',
    emailInvalid: '请输入有效的邮箱地址',
    passwordRequired: '密码是必填项',
    passwordMinLength: '密码至少需要6个字符',
    passwordsNotMatch: '两次输入的密码不一致',
    
    // Messages
    loginSuccess: '登录成功',
    registerSuccess: '注册成功',
    loginFailed: '登录失败',
    registerFailed: '注册失败',
  },
  
  deals: {
    title: '最新优惠',
    searchPlaceholder: '搜索优惠、商店、产品...',
    noResults: '未找到相关优惠',
    loadMore: '加载更多',
    sortBy: '排序方式',
    sortNewest: '最新',
    sortPriceLow: '价格：低到高',
    sortPriceHigh: '价格：高到低',
    sortPopularity: '热门度',
    
    filters: {
      category: '分类',
      store: '商店',
      priceRange: '价格范围',
      minPrice: '最低价格',
      maxPrice: '最高价格',
    }
  },
  
  categories: {
    title: '分类',
    all: '所有分类',
    viewAll: '查看全部',
  },
  
  stores: {
    title: '商店',
    all: '所有商店',
    viewDeals: '查看优惠',
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      zh: { translation: zhTranslation },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;