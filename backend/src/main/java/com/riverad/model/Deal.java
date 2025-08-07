package com.riverad.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "deals", indexes = {
    @Index(name = "idx_deals_active_featured", columnList = "is_active, is_featured, created_at"),
    @Index(name = "idx_deals_category", columnList = "category_id, is_active"),
    @Index(name = "idx_deals_store", columnList = "store_id, is_active"),
    @Index(name = "idx_deals_price_range", columnList = "sale_price, currency, is_active")
})
public class Deal extends BaseEntity {

    @NotBlank(message = "英文标题不能为空")
    @Size(max = 500, message = "英文标题长度不能超过500字符")
    @Column(name = "title_en", nullable = false, length = 500)
    private String titleEn;

    @Size(max = 500, message = "中文标题长度不能超过500字符")
    @Column(name = "title_zh", length = 500)
    private String titleZh;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "description_zh", columnDefinition = "TEXT")
    private String descriptionZh;

    @Size(max = 200, message = "英文简短描述长度不能超过200字符")
    @Column(name = "short_description_en", length = 200)
    private String shortDescriptionEn;

    @Size(max = 200, message = "中文简短描述长度不能超过200字符")
    @Column(name = "short_description_zh", length = 200)
    private String shortDescriptionZh;

    @DecimalMin(value = "0.0", inclusive = false, message = "原价必须大于0")
    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @DecimalMin(value = "0.0", inclusive = false, message = "销售价必须大于0")
    @Column(name = "sale_price", precision = 10, scale = 2)
    private BigDecimal salePrice;

    @Size(max = 3, message = "货币代码长度为3位")
    @Column(length = 3)
    private String currency = "USD";

    @Min(value = 0, message = "折扣百分比不能小于0")
    @Max(value = 100, message = "折扣百分比不能大于100")
    @Column(name = "discount_percentage")
    private Integer discountPercentage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @NotBlank(message = "联盟链接不能为空")
    @Column(name = "affiliate_url", nullable = false, columnDefinition = "TEXT")
    private String affiliateUrl;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Size(max = 50, message = "优惠码长度不能超过50字符")
    @Column(name = "coupon_code", length = 50)
    private String couponCode;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Min(value = 0, message = "点击数不能小于0")
    @Column(name = "click_count")
    private Integer clickCount = 0;

    @Min(value = 0, message = "查看数不能小于0")
    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Min(value = 0, message = "转化数不能小于0")
    @Column(name = "conversion_count")
    private Integer conversionCount = 0;

    // Constructors
    public Deal() {}

    public Deal(String titleEn, String titleZh, String affiliateUrl) {
        this.titleEn = titleEn;
        this.titleZh = titleZh;
        this.affiliateUrl = affiliateUrl;
    }

    // Business Methods
    public boolean isExpired() {
        return endDate != null && endDate.isBefore(LocalDateTime.now());
    }

    public boolean isActive() {
        return isActive && !isExpired();
    }

    public Integer calculateDiscountPercentage() {
        if (originalPrice != null && salePrice != null && 
            originalPrice.compareTo(BigDecimal.ZERO) > 0 && 
            salePrice.compareTo(originalPrice) < 0) {
            
            BigDecimal discount = originalPrice.subtract(salePrice);
            BigDecimal percentage = discount.divide(originalPrice, 4, BigDecimal.ROUND_HALF_UP)
                                           .multiply(new BigDecimal("100"));
            return percentage.intValue();
        }
        return 0;
    }

    @PrePersist
    @PreUpdate
    private void updateDiscountPercentage() {
        this.discountPercentage = calculateDiscountPercentage();
    }

    // Getters and Setters
    public String getTitleEn() {
        return titleEn;
    }

    public void setTitleEn(String titleEn) {
        this.titleEn = titleEn;
    }

    public String getTitleZh() {
        return titleZh;
    }

    public void setTitleZh(String titleZh) {
        this.titleZh = titleZh;
    }

    public String getDescriptionEn() {
        return descriptionEn;
    }

    public void setDescriptionEn(String descriptionEn) {
        this.descriptionEn = descriptionEn;
    }

    public String getDescriptionZh() {
        return descriptionZh;
    }

    public void setDescriptionZh(String descriptionZh) {
        this.descriptionZh = descriptionZh;
    }

    public String getShortDescriptionEn() {
        return shortDescriptionEn;
    }

    public void setShortDescriptionEn(String shortDescriptionEn) {
        this.shortDescriptionEn = shortDescriptionEn;
    }

    public String getShortDescriptionZh() {
        return shortDescriptionZh;
    }

    public void setShortDescriptionZh(String shortDescriptionZh) {
        this.shortDescriptionZh = shortDescriptionZh;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }

    public BigDecimal getSalePrice() {
        return salePrice;
    }

    public void setSalePrice(BigDecimal salePrice) {
        this.salePrice = salePrice;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Integer getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(Integer discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getAffiliateUrl() {
        return affiliateUrl;
    }

    public void setAffiliateUrl(String affiliateUrl) {
        this.affiliateUrl = affiliateUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsFeatured() {
        return isFeatured;
    }

    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }

    public Integer getClickCount() {
        return clickCount;
    }

    public void setClickCount(Integer clickCount) {
        this.clickCount = clickCount;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public Integer getConversionCount() {
        return conversionCount;
    }

    public void setConversionCount(Integer conversionCount) {
        this.conversionCount = conversionCount;
    }
}