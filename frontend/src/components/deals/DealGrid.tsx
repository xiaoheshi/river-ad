import React from 'react';
import { Row, Col, Spin, Empty, Pagination, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Deal } from '@/types';
import { DealCard } from './DealCard';

interface DealGridProps {
  deals: Deal[];
  loading?: boolean;
  error?: string | null;
  showCategory?: boolean;
  showStore?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  
  // Pagination
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  totalElements?: number;
  onPageChange?: (page: number, size?: number) => void;
  
  // Actions
  onRetry?: () => void;
  
  className?: string;
}

export const DealGrid: React.FC<DealGridProps> = ({
  deals,
  loading = false,
  error,
  showCategory = true,
  showStore = true,
  variant = 'default',
  currentPage = 1,
  totalPages = 0,
  pageSize = 20,
  totalElements = 0,
  onPageChange,
  onRetry,
  className = ''
}) => {
  const { t } = useTranslation();

  if (loading && deals.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spin size="large" tip={t('common.loading')} />
      </div>
    );
  }

  if (error && deals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          {onRetry && (
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              onClick={onRetry}
            >
              重新加载
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <Empty
          description={t('deals.noResults')}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  const getColumnConfig = () => {
    switch (variant) {
      case 'compact':
        return {
          xs: 24,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24,
        };
      case 'featured':
        return {
          xs: 24,
          sm: 24,
          md: 12,
          lg: 8,
          xl: 6,
        };
      default:
        return {
          xs: 24,
          sm: 12,
          md: 12,
          lg: 8,
          xl: 6,
        };
    }
  };

  const columnConfig = getColumnConfig();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Results Summary */}
      {totalElements > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {t('common.showing')} {((currentPage - 1) * pageSize) + 1} {t('common.to')}{' '}
            {Math.min(currentPage * pageSize, totalElements)} {t('common.of')} {totalElements} {t('common.results')}
          </p>
          {loading && deals.length > 0 && (
            <Spin size="small" />
          )}
        </div>
      )}

      {/* Deal Grid */}
      <Row gutter={[16, 16]} className="relative">
        {loading && deals.length > 0 && (
          <div className="absolute inset-0 bg-white bg-opacity-50 z-10 flex items-center justify-center">
            <Spin size="large" />
          </div>
        )}
        
        {deals.map((deal) => (
          <Col key={deal.id} {...columnConfig}>
            <DealCard
              deal={deal}
              variant={variant}
              showCategory={showCategory}
              showStore={showStore}
            />
          </Col>
        ))}
      </Row>

      {/* Error Message for partial failures */}
      {error && deals.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            {onRetry && (
              <Button 
                type="link" 
                size="small"
                icon={<ReloadOutlined />} 
                onClick={onRetry}
                className="text-red-600 hover:text-red-700"
              >
                重试
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex justify-center pt-8">
          <Pagination
            current={currentPage}
            total={totalElements}
            pageSize={pageSize}
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} of ${total} deals`
            }
            showSizeChanger
            showQuickJumper
            pageSizeOptions={['20', '40', '60', '100']}
            onChange={onPageChange}
            onShowSizeChange={onPageChange}
            className="text-center"
          />
        </div>
      )}
    </div>
  );
};