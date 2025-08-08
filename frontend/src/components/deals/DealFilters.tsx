import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Select, 
  Slider, 
  Button, 
  Space, 
  Divider, 
  Collapse,
  InputNumber,
  Row,
  Col,
  Tag
} from 'antd';
import { 
  FilterOutlined, 
  ClearOutlined, 
  SearchOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { SearchFilters, Category, Store } from '@/types';
import { useDealsStore } from '@/store/dealsStore';

const { Option } = Select;
const { Panel } = Collapse;

interface DealFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  onReset: () => void;
  loading?: boolean;
  className?: string;
}

export const DealFilters: React.FC<DealFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
  loading = false,
  className = ''
}) => {
  const { t } = useTranslation();
  const { categories, stores, fetchCategories, fetchStores } = useDealsStore();
  const [form] = Form.useForm();
  const [isExpanded, setIsExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    fetchCategories();
    fetchStores();
  }, [fetchCategories, fetchStores]);

  useEffect(() => {
    form.setFieldsValue(filters);
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      setPriceRange([filters.minPrice || 0, filters.maxPrice || 1000]);
    }
  }, [filters, form]);

  const handleFilterChange = (changedFields: any, allFields: any) => {
    const newFilters: SearchFilters = {};
    
    Object.keys(allFields).forEach(key => {
      const value = allFields[key];
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value) && value.length === 0) return;
        newFilters[key as keyof SearchFilters] = value;
      }
    });

    onFiltersChange(newFilters);
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
    const [min, max] = value;
    const newFilters = { ...filters };
    
    if (min > 0) newFilters.minPrice = min;
    else delete newFilters.minPrice;
    
    if (max < 1000) newFilters.maxPrice = max;
    else delete newFilters.maxPrice;
    
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    form.resetFields();
    setPriceRange([0, 1000]);
    onReset();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categoryId) count++;
    if (filters.storeId) count++;
    if (filters.minPrice && filters.minPrice > 0) count++;
    if (filters.maxPrice && filters.maxPrice < 1000) count++;
    if (filters.sortBy && filters.sortBy !== 'newest') count++;
    return count;
  };

  const renderActiveFilters = () => {
    const activeFilters: React.ReactNode[] = [];
    
    if (filters.categoryId) {
      const category = categories.find(c => c.id === filters.categoryId);
      if (category) {
        activeFilters.push(
          <Tag 
            key="category" 
            closable 
            onClose={() => onFiltersChange({ ...filters, categoryId: undefined })}
          >
            分类: {category.nameZh}
          </Tag>
        );
      }
    }
    
    if (filters.storeId) {
      const store = stores.find(s => s.id === filters.storeId);
      if (store) {
        activeFilters.push(
          <Tag 
            key="store" 
            closable 
            onClose={() => onFiltersChange({ ...filters, storeId: undefined })}
          >
            商店: {store.name}
          </Tag>
        );
      }
    }
    
    if (filters.minPrice && filters.minPrice > 0) {
      activeFilters.push(
        <Tag 
          key="minPrice" 
          closable 
          onClose={() => onFiltersChange({ ...filters, minPrice: undefined })}
        >
          最低价: ${filters.minPrice}
        </Tag>
      );
    }
    
    if (filters.maxPrice && filters.maxPrice < 1000) {
      activeFilters.push(
        <Tag 
          key="maxPrice" 
          closable 
          onClose={() => onFiltersChange({ ...filters, maxPrice: undefined })}
        >
          最高价: ${filters.maxPrice}
        </Tag>
      );
    }
    
    return activeFilters;
  };

  const MobileFilters = () => (
    <div className="lg:hidden">
      <Button
        type="default"
        icon={<FilterOutlined />}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mb-4"
      >
        筛选 {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
        {isExpanded ? <UpOutlined className="ml-2" /> : <DownOutlined className="ml-2" />}
      </Button>
      
      {isExpanded && (
        <Card className="mb-4">
          <Form
            form={form}
            layout="vertical"
            onValuesChange={handleFilterChange}
            size="small"
          >
            <Form.Item name="sortBy" label={t('deals.sortBy')}>
              <Select placeholder="选择排序方式" allowClear>
                <Option value="newest">{t('deals.sortNewest')}</Option>
                <Option value="price_low">{t('deals.sortPriceLow')}</Option>
                <Option value="price_high">{t('deals.sortPriceHigh')}</Option>
                <Option value="popularity">{t('deals.sortPopularity')}</Option>
              </Select>
            </Form.Item>
            
            <Form.Item name="categoryId" label={t('deals.filters.category')}>
              <Select placeholder="选择分类" allowClear loading={!categories.length}>
                {categories.map(category => (
                  <Option key={category.id} value={category.id}>
                    {category.nameZh}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item name="storeId" label={t('deals.filters.store')}>
              <Select placeholder="选择商店" allowClear loading={!stores.length}>
                {stores.map(store => (
                  <Option key={store.id} value={store.id}>
                    {store.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item label={`${t('deals.filters.priceRange')} ($${priceRange[0]} - $${priceRange[1]})`}>
              <Slider
                range
                min={0}
                max={1000}
                value={priceRange}
                onChange={handlePriceRangeChange}
                marks={{
                  0: '$0',
                  250: '$250',
                  500: '$500',
                  750: '$750',
                  1000: '$1000+'
                }}
                className="px-2"
              />
            </Form.Item>
            
            <Row gutter={8}>
              <Col span={12}>
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />}
                  onClick={onSearch}
                  loading={loading}
                  block
                >
                  应用筛选
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  icon={<ClearOutlined />}
                  onClick={handleReset}
                  block
                >
                  重置
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      )}
    </div>
  );

  const DesktopFilters = () => (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <FilterOutlined className="mr-2" />
            筛选条件
          </span>
          {getActiveFiltersCount() > 0 && (
            <Tag color="blue">{getActiveFiltersCount()} 个筛选</Tag>
          )}
        </div>
      }
      className="hidden lg:block"
      size="small"
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleFilterChange}
        size="small"
      >
        <Form.Item name="sortBy" label={t('deals.sortBy')}>
          <Select placeholder="选择排序方式" allowClear>
            <Option value="newest">{t('deals.sortNewest')}</Option>
            <Option value="price_low">{t('deals.sortPriceLow')}</Option>
            <Option value="price_high">{t('deals.sortPriceHigh')}</Option>
            <Option value="popularity">{t('deals.sortPopularity')}</Option>
          </Select>
        </Form.Item>
        
        <Divider />
        
        <Form.Item name="categoryId" label={t('deals.filters.category')}>
          <Select 
            placeholder="选择分类" 
            allowClear 
            loading={!categories.length}
            showSearch
            filterOption={(input, option) =>
              option?.children.toString().toLowerCase().includes(input.toLowerCase())
            }
          >
            {categories.map(category => (
              <Option key={category.id} value={category.id}>
                {category.nameZh}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item name="storeId" label={t('deals.filters.store')}>
          <Select 
            placeholder="选择商店" 
            allowClear 
            loading={!stores.length}
            showSearch
            filterOption={(input, option) =>
              option?.children.toString().toLowerCase().includes(input.toLowerCase())
            }
          >
            {stores.map(store => (
              <Option key={store.id} value={store.id}>
                {store.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Divider />
        
        <Form.Item label={t('deals.filters.priceRange')}>
          <div className="space-y-3">
            <Slider
              range
              min={0}
              max={1000}
              value={priceRange}
              onChange={handlePriceRangeChange}
              marks={{
                0: '$0',
                500: '$500',
                1000: '$1000+'
              }}
            />
            <Row gutter={8}>
              <Col span={12}>
                <InputNumber
                  min={0}
                  max={1000}
                  value={priceRange[0]}
                  onChange={(value) => handlePriceRangeChange([value || 0, priceRange[1]])}
                  prefix="$"
                  placeholder="最低价"
                  size="small"
                  className="w-full"
                />
              </Col>
              <Col span={12}>
                <InputNumber
                  min={0}
                  max={1000}
                  value={priceRange[1]}
                  onChange={(value) => handlePriceRangeChange([priceRange[0], value || 1000])}
                  prefix="$"
                  placeholder="最高价"
                  size="small"
                  className="w-full"
                />
              </Col>
            </Row>
          </div>
        </Form.Item>
        
        <Divider />
        
        <Space direction="vertical" className="w-full">
          <Button 
            type="primary" 
            icon={<SearchOutlined />}
            onClick={onSearch}
            loading={loading}
            block
          >
            应用筛选
          </Button>
          <Button 
            icon={<ClearOutlined />}
            onClick={handleReset}
            block
          >
            重置筛选
          </Button>
        </Space>
      </Form>
    </Card>
  );

  return (
    <div className={className}>
      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">活跃筛选:</span>
            <Button 
              type="link" 
              size="small" 
              onClick={handleReset}
              className="text-blue-600"
            >
              清除全部
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {renderActiveFilters()}
          </div>
        </div>
      )}
      
      <MobileFilters />
      <DesktopFilters />
    </div>
  );
};