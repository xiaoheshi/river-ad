import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  PaginatedResponse, 
  AuthRequest, 
  RegisterRequest, 
  AuthResponse,
  User,
  Deal,
  Category,
  Store,
  SearchFilters,
  PaginationParams 
} from '@/types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.api.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth API
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  }

  async validateToken(token: string): Promise<{ valid: boolean; message: string }> {
    const response = await this.api.post<{ valid: boolean; message: string }>('/auth/validate', { token });
    return response.data;
  }

  // Deals API
  async getDeals(params: PaginationParams & SearchFilters): Promise<PaginatedResponse<Deal>> {
    const response = await this.api.get<PaginatedResponse<Deal>>('/deals', { params });
    return response.data;
  }

  async searchDeals(keyword: string, params: PaginationParams): Promise<PaginatedResponse<Deal>> {
    const response = await this.api.get<PaginatedResponse<Deal>>('/deals/search', {
      params: { keyword, ...params }
    });
    return response.data;
  }

  async getDealsByCategory(categoryId: number, params: PaginationParams): Promise<PaginatedResponse<Deal>> {
    const response = await this.api.get<PaginatedResponse<Deal>>(`/deals/category/${categoryId}`, { params });
    return response.data;
  }

  async getDealsByStore(storeId: number, params: PaginationParams): Promise<PaginatedResponse<Deal>> {
    const response = await this.api.get<PaginatedResponse<Deal>>(`/deals/store/${storeId}`, { params });
    return response.data;
  }

  async getPopularDeals(limit: number = 10): Promise<Deal[]> {
    const response = await this.api.get<Deal[]>('/deals/popular', {
      params: { limit }
    });
    return response.data;
  }

  async getDeal(id: number): Promise<Deal> {
    const response = await this.api.get<Deal>(`/deals/${id}`);
    return response.data;
  }

  async recordClick(dealId: number): Promise<{ message: string; clickCount: number; dealId: number }> {
    const response = await this.api.post<{ message: string; clickCount: number; dealId: number }>(`/deals/${dealId}/click`);
    return response.data;
  }

  // Categories API
  async getCategories(): Promise<Category[]> {
    const response = await this.api.get<Category[]>('/categories');
    return response.data;
  }

  // Stores API  
  async getStores(): Promise<Store[]> {
    const response = await this.api.get<Store[]>('/stores');
    return response.data;
  }

  // Affiliate API
  async trackAffiliate(dealId: number, userId?: number): Promise<{ message: string; clickId: string; timestamp: string }> {
    const response = await this.api.post<{ message: string; clickId: string; timestamp: string }>('/affiliate/track', {
      dealId,
      userId
    });
    return response.data;
  }

  async getAffiliateStats(dealId: number, hours: number = 24): Promise<number> {
    const response = await this.api.get<number>(`/affiliate/stats/clicks/${dealId}`, {
      params: { hours }
    });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await this.api.get('/health');
    return response.data;
  }

  // Generic request method
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.api.request<T>(config);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;