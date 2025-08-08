// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// User Types
export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  preferredLanguage: string;
  preferredCurrency: string;
  timezone: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  preferredLanguage?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  fullName: string;
}

// Deal Types
export interface Deal {
  id: number;
  titleEn: string;
  titleZh: string;
  descriptionEn: string;
  descriptionZh: string;
  originalPrice?: number;
  salePrice?: number;
  discountPercentage?: number;
  dealUrl: string;
  affiliateUrl: string;
  imageUrl?: string;
  couponCode?: string;
  category: Category;
  store: Store;
  expiresAt: string;
  isActive: boolean;
  isFeatured: boolean;
  clickCount: number;
  commissionRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  nameEn: string;
  nameZh: string;
  slug: string;
  descriptionEn?: string;
  descriptionZh?: string;
  iconUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: number;
  name: string;
  slug: string;
  description?: string;
  websiteUrl: string;
  logoUrl?: string;
  commissionRate?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Search & Filter Types
export interface SearchFilters {
  keyword?: string;
  categoryId?: number;
  storeId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'price_low' | 'price_high' | 'popularity';
}

export interface PaginationParams {
  page: number;
  size: number;
}

// Affiliate Types
export interface AffiliateClick {
  clickId: string;
  deal: Deal;
  user?: User;
  ipAddress: string;
  clickTimestamp: string;
  converted: boolean;
  conversionTimestamp?: string;
  commissionAmount?: number;
}

// UI Component Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Language Types
export type Language = 'en' | 'zh';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'CNY';

// Theme Types
export interface ThemeConfig {
  primaryColor: string;
  mode: 'light' | 'dark';
}

// Form Types
export interface FormErrors {
  [key: string]: string | undefined;
}