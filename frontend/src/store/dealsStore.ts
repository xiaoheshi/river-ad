import { create } from 'zustand';
import { Deal, Category, Store, SearchFilters, PaginationParams, PaginatedResponse } from '@/types';
import apiService from '@/services/api';

interface DealsState {
  // Data
  deals: Deal[];
  categories: Category[];
  stores: Store[];
  popularDeals: Deal[];
  currentDeal: Deal | null;
  
  // Pagination & Search
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalElements: number;
  searchFilters: SearchFilters;
  
  // Loading states
  isLoading: boolean;
  isLoadingCategories: boolean;
  isLoadingStores: boolean;
  isLoadingPopular: boolean;
  error: string | null;
  
  // Actions
  fetchDeals: (params?: PaginationParams & SearchFilters) => Promise<void>;
  searchDeals: (keyword: string, params?: PaginationParams) => Promise<void>;
  fetchDealsByCategory: (categoryId: number, params?: PaginationParams) => Promise<void>;
  fetchDealsByStore: (storeId: number, params?: PaginationParams) => Promise<void>;
  fetchDeal: (id: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchStores: () => Promise<void>;
  fetchPopularDeals: (limit?: number) => Promise<void>;
  recordClick: (dealId: number) => Promise<void>;
  
  // Filter & Pagination actions
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  clearFilters: () => void;
  clearError: () => void;
}

export const useDealsStore = create<DealsState>((set, get) => ({
  // Initial state
  deals: [],
  categories: [],
  stores: [],
  popularDeals: [],
  currentDeal: null,
  totalPages: 0,
  currentPage: 0,
  pageSize: 20,
  totalElements: 0,
  searchFilters: {},
  isLoading: false,
  isLoadingCategories: false,
  isLoadingStores: false,
  isLoadingPopular: false,
  error: null,

  // Fetch deals with pagination and filters
  fetchDeals: async (params) => {
    set({ isLoading: true, error: null });
    
    try {
      const { currentPage, pageSize, searchFilters } = get();
      const requestParams = {
        page: params?.page ?? currentPage,
        size: params?.size ?? pageSize,
        ...searchFilters,
        ...params,
      };
      
      const response: PaginatedResponse<Deal> = await apiService.getDeals(requestParams);
      
      set({
        deals: response.content,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        currentPage: response.number,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        deals: [],
        isLoading: false,
        error: error.response?.data?.message || '获取优惠信息失败',
      });
    }
  },

  // Search deals
  searchDeals: async (keyword, params) => {
    set({ isLoading: true, error: null, searchFilters: { keyword } });
    
    try {
      const { currentPage, pageSize } = get();
      const requestParams = {
        page: params?.page ?? currentPage,
        size: params?.size ?? pageSize,
      };
      
      const response: PaginatedResponse<Deal> = await apiService.searchDeals(keyword, requestParams);
      
      set({
        deals: response.content,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        currentPage: response.number,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        deals: [],
        isLoading: false,
        error: error.response?.data?.message || '搜索优惠信息失败',
      });
    }
  },

  // Fetch deals by category
  fetchDealsByCategory: async (categoryId, params) => {
    set({ isLoading: true, error: null, searchFilters: { categoryId } });
    
    try {
      const { currentPage, pageSize } = get();
      const requestParams = {
        page: params?.page ?? currentPage,
        size: params?.size ?? pageSize,
      };
      
      const response: PaginatedResponse<Deal> = await apiService.getDealsByCategory(categoryId, requestParams);
      
      set({
        deals: response.content,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        currentPage: response.number,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        deals: [],
        isLoading: false,
        error: error.response?.data?.message || '获取分类优惠失败',
      });
    }
  },

  // Fetch deals by store
  fetchDealsByStore: async (storeId, params) => {
    set({ isLoading: true, error: null, searchFilters: { storeId } });
    
    try {
      const { currentPage, pageSize } = get();
      const requestParams = {
        page: params?.page ?? currentPage,
        size: params?.size ?? pageSize,
      };
      
      const response: PaginatedResponse<Deal> = await apiService.getDealsByStore(storeId, requestParams);
      
      set({
        deals: response.content,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        currentPage: response.number,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        deals: [],
        isLoading: false,
        error: error.response?.data?.message || '获取商店优惠失败',
      });
    }
  },

  // Fetch single deal
  fetchDeal: async (id) => {
    set({ error: null });
    
    try {
      const deal: Deal = await apiService.getDeal(id);
      set({ currentDeal: deal });
    } catch (error: any) {
      set({
        currentDeal: null,
        error: error.response?.data?.message || '获取优惠详情失败',
      });
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    set({ isLoadingCategories: true });
    
    try {
      const categories: Category[] = await apiService.getCategories();
      set({ categories, isLoadingCategories: false });
    } catch (error: any) {
      set({ 
        categories: [], 
        isLoadingCategories: false,
        error: error.response?.data?.message || '获取分类失败',
      });
    }
  },

  // Fetch stores
  fetchStores: async () => {
    set({ isLoadingStores: true });
    
    try {
      const stores: Store[] = await apiService.getStores();
      set({ stores, isLoadingStores: false });
    } catch (error: any) {
      set({ 
        stores: [], 
        isLoadingStores: false,
        error: error.response?.data?.message || '获取商店失败',
      });
    }
  },

  // Fetch popular deals
  fetchPopularDeals: async (limit = 10) => {
    set({ isLoadingPopular: true });
    
    try {
      const popularDeals: Deal[] = await apiService.getPopularDeals(limit);
      set({ popularDeals, isLoadingPopular: false });
    } catch (error: any) {
      set({ 
        popularDeals: [], 
        isLoadingPopular: false,
        error: error.response?.data?.message || '获取热门优惠失败',
      });
    }
  },

  // Record deal click
  recordClick: async (dealId) => {
    try {
      await apiService.recordClick(dealId);
      // Optionally update click count in local state
      const { deals, currentDeal } = get();
      const updatedDeals = deals.map(deal => 
        deal.id === dealId ? { ...deal, clickCount: deal.clickCount + 1 } : deal
      );
      set({ deals: updatedDeals });
      
      if (currentDeal && currentDeal.id === dealId) {
        set({ currentDeal: { ...currentDeal, clickCount: currentDeal.clickCount + 1 } });
      }
    } catch (error: any) {
      console.error('Failed to record click:', error);
    }
  },

  // Filter and pagination actions
  setSearchFilters: (filters) => {
    set({ searchFilters: { ...get().searchFilters, ...filters } });
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  setPageSize: (size) => {
    set({ pageSize: size, currentPage: 0 });
  },

  clearFilters: () => {
    set({ searchFilters: {}, currentPage: 0 });
  },

  clearError: () => {
    set({ error: null });
  },
}));