import React, { useState } from 'react';
import { Card, Tag, Button, message, Tooltip, Image } from 'antd';
import { 
  EyeOutlined, 
  CopyOutlined, 
  ClockCircleOutlined,
  ShopOutlined,
  TagsOutlined,
  FireOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import dayjs from 'dayjs';
import { Deal } from '@/types';
import { useDealsStore } from '@/store/dealsStore';
import apiService from '@/services/api';

const { Meta } = Card;

interface DealCardProps {
  deal: Deal;
  variant?: 'default' | 'compact' | 'featured';
  showCategory?: boolean;
  showStore?: boolean;
  className?: string;
}

export const DealCard: React.FC<DealCardProps> = ({ 
  deal, 
  variant = 'default',
  showCategory = true,
  showStore = true,
  className = ''
}) => {
  const { t, i18n } = useTranslation();
  const { recordClick } = useDealsStore();
  const [isLoading, setIsLoading] = useState(false);

  const isZh = i18n.language === 'zh';
  const title = isZh ? deal.titleZh : deal.titleEn;
  const description = isZh ? deal.descriptionZh : deal.descriptionEn;
  const categoryName = isZh ? deal.category.nameZh : deal.category.nameEn;

  const discountPercentage = deal.discountPercentage || 
    (deal.originalPrice && deal.salePrice ? 
      Math.round(((deal.originalPrice - deal.salePrice) / deal.originalPrice) * 100) : 0);

  const isExpired = dayjs(deal.expiresAt).isBefore(dayjs());
  const isExpiringSoon = dayjs(deal.expiresAt).diff(dayjs(), 'hours') <= 24;

  const handleDealClick = async () => {
    setIsLoading(true);
    try {
      // Record click for analytics
      await recordClick(deal.id);
      
      // Track affiliate click
      await apiService.trackAffiliate(deal.id);
      
      // Open affiliate URL
      window.open(deal.affiliateUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to track click:', error);
      // Still open the URL even if tracking fails
      window.open(deal.affiliateUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (deal.couponCode) {
      try {
        await navigator.clipboard.writeText(deal.couponCode);
        message.success('优惠券代码已复制');
      } catch (error) {
        message.error('复制失败，请手动复制');
      }
    }
  };

  const renderPrice = () => {
    if (!deal.originalPrice && !deal.salePrice) return null;

    return (
      <div className="flex items-center space-x-2">
        {deal.salePrice && (
          <span className="text-lg font-bold text-red-600">
            ${deal.salePrice}
          </span>
        )}
        {deal.originalPrice && deal.salePrice && (
          <span className="text-sm text-gray-500 line-through">
            ${deal.originalPrice}
          </span>
        )}
        {discountPercentage > 0 && (
          <Tag color="red" className="text-xs font-medium">
            -{discountPercentage}%
          </Tag>
        )}
      </div>
    );
  };

  const renderTags = () => {
    const tags = [];
    
    if (deal.isFeatured) {
      tags.push(
        <Tag key="featured" color="gold" icon={<StarOutlined />}>
          {t('common.featured')}
        </Tag>
      );
    }
    
    if (deal.clickCount > 100) {
      tags.push(
        <Tag key="popular" color="red" icon={<FireOutlined />}>
          {t('common.popular')}
        </Tag>
      );
    }
    
    if (isExpiringSoon && !isExpired) {
      tags.push(
        <Tag key="expiring" color="orange" icon={<ClockCircleOutlined />}>
          即将过期
        </Tag>
      );
    }

    return tags;
  };

  if (variant === 'compact') {
    return (
      <Card
        className={`hover:shadow-md transition-shadow ${className}`}
        bodyStyle={{ padding: '12px' }}
      >
        <div className="flex items-center space-x-3">
          {deal.imageUrl && (
            <Image
              src={deal.imageUrl}
              alt={title}
              width={60}
              height={60}
              className="rounded-lg object-cover"
              fallback="/images/placeholder-deal.png"
            />
          )}
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {title}
            </h4>
            {renderPrice()}
          </div>
          
          <Button
            type="primary"
            size="small"
            loading={isLoading}
            onClick={handleDealClick}
          >
            {t('common.getDeal')}
          </Button>
        </div>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card
        className={`relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200 hover:shadow-xl transition-all duration-300 ${className}`}
        cover={
          deal.imageUrl ? (
            <div className="relative h-48">
              <Image
                src={deal.imageUrl}
                alt={title}
                className="w-full h-48 object-cover"
                fallback="/images/placeholder-deal.png"
              />
              <div className="absolute top-2 left-2">
                <Tag color="gold" icon={<StarOutlined />}>
                  精选优惠
                </Tag>
              </div>
            </div>
          ) : null
        }
        actions={[
          <Button
            key="view"
            type="link"
            icon={<EyeOutlined />}
            onClick={() => window.open(`/deals/${deal.id}`, '_blank')}
          >
            查看详情
          </Button>,
          deal.couponCode ? (
            <Button
              key="copy"
              type="link"
              icon={<CopyOutlined />}
              onClick={handleCopyCode}
            >
              复制代码
            </Button>
          ) : (
            <Button
              key="get"
              type="primary"
              loading={isLoading}
              onClick={handleDealClick}
            >
              {t('common.getDeal')}
            </Button>
          ),
        ]}
      >
        <Meta
          title={
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {title}
              </h3>
              {renderPrice()}
            </div>
          }
          description={
            <div className="space-y-3">
              <p className="text-gray-600 text-sm line-clamp-2">
                {description}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {renderTags()}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  <ClockCircleOutlined className="mr-1" />
                  截止 {dayjs(deal.expiresAt).format('MM/DD')}
                </span>
                <span>{deal.clickCount} 人已获取</span>
              </div>
            </div>
          }
        />
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      className={`hover:shadow-lg transition-all duration-300 ${isExpired ? 'opacity-60' : ''} ${className}`}
      cover={
        deal.imageUrl ? (
          <div className="relative h-48">
            <Image
              src={deal.imageUrl}
              alt={title}
              className="w-full h-48 object-cover"
              fallback="/images/placeholder-deal.png"
            />
            {discountPercentage > 0 && (
              <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm font-bold">
                -{discountPercentage}%
              </div>
            )}
          </div>
        ) : null
      }
      actions={[
        <Link key="view" href={`/deals/${deal.id}`} target="_blank">
          <Button type="link" icon={<EyeOutlined />}>
            查看详情
          </Button>
        </Link>,
        deal.couponCode ? (
          <Tooltip key="copy" title={`代码: ${deal.couponCode}`}>
            <Button type="link" icon={<CopyOutlined />} onClick={handleCopyCode}>
              {t('common.copyCode')}
            </Button>
          </Tooltip>
        ) : (
          <Button
            key="get"
            type="primary"
            loading={isLoading}
            disabled={isExpired}
            onClick={handleDealClick}
          >
            {isExpired ? '已过期' : t('common.getDeal')}
          </Button>
        ),
      ]}
    >
      <Meta
        title={
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
              {title}
            </h3>
            {renderPrice()}
          </div>
        }
        description={
          <div className="space-y-3">
            <p className="text-gray-600 text-sm line-clamp-2">
              {description}
            </p>
            
            <div className="flex flex-wrap gap-1">
              {renderTags()}
            </div>
            
            {(showCategory || showStore) && (
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-3">
                  {showCategory && (
                    <span className="flex items-center">
                      <TagsOutlined className="mr-1" />
                      {categoryName}
                    </span>
                  )}
                  {showStore && (
                    <span className="flex items-center">
                      <ShopOutlined className="mr-1" />
                      {deal.store.name}
                    </span>
                  )}
                </div>
                <span className="flex items-center">
                  <ClockCircleOutlined className="mr-1" />
                  {dayjs(deal.expiresAt).format('MM/DD HH:mm')}
                </span>
              </div>
            )}
            
            <div className="text-xs text-gray-400">
              {deal.clickCount} 人已获取 • {dayjs(deal.createdAt).fromNow()}
            </div>
          </div>
        }
      />
    </Card>
  );
};