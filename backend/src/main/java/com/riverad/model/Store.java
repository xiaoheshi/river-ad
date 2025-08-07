package com.riverad.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

@Entity
@Table(name = "stores", indexes = {
    @Index(name = "idx_stores_active", columnList = "is_active, created_at")
})
public class Store extends BaseEntity {

    @NotBlank(message = "商店名称不能为空")
    @Size(max = 200, message = "商店名称长度不能超过200字符")
    @Column(nullable = false, length = 200)
    private String name;

    @NotBlank(message = "商店标识不能为空")
    @Size(max = 200, message = "商店标识长度不能超过200字符")
    @Column(unique = true, nullable = false, length = 200)
    private String slug;

    @Column(name = "logo_url", columnDefinition = "TEXT")
    private String logoUrl;

    @NotBlank(message = "网站URL不能为空")
    @Column(name = "website_url", nullable = false, columnDefinition = "TEXT")
    private String websiteUrl;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "description_zh", columnDefinition = "TEXT")
    private String descriptionZh;

    @Size(max = 2, message = "国家代码长度为2位")
    @Column(length = 2)
    private String country;

    @Size(max = 3, message = "货币代码长度为3位")
    @Column(length = 3)
    private String currency = "USD";

    @DecimalMin(value = "0.0", message = "佣金率不能小于0")
    @DecimalMax(value = "1.0", message = "佣金率不能大于1")
    @Column(name = "commission_rate", precision = 5, scale = 2)
    private BigDecimal commissionRate = new BigDecimal("0.05");

    @Size(max = 100, message = "联盟网络名称长度不能超过100字符")
    @Column(name = "affiliate_network", length = 100)
    private String affiliateNetwork;

    @Column(name = "is_active")
    private Boolean isActive = true;

    // Constructors
    public Store() {}

    public Store(String name, String slug, String websiteUrl) {
        this.name = name;
        this.slug = slug;
        this.websiteUrl = websiteUrl;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
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

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getCommissionRate() {
        return commissionRate;
    }

    public void setCommissionRate(BigDecimal commissionRate) {
        this.commissionRate = commissionRate;
    }

    public String getAffiliateNetwork() {
        return affiliateNetwork;
    }

    public void setAffiliateNetwork(String affiliateNetwork) {
        this.affiliateNetwork = affiliateNetwork;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}