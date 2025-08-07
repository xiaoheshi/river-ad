package com.riverad.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "categories", indexes = {
    @Index(name = "idx_categories_active", columnList = "is_active, sort_order")
})
public class Category extends BaseEntity {

    @NotBlank(message = "英文分类名不能为空")
    @Size(max = 100, message = "英文分类名长度不能超过100字符")
    @Column(name = "name_en", nullable = false, length = 100)
    private String nameEn;

    @Size(max = 100, message = "中文分类名长度不能超过100字符")
    @Column(name = "name_zh", length = 100)
    private String nameZh;

    @NotBlank(message = "分类标识不能为空")
    @Size(max = 100, message = "分类标识长度不能超过100字符")
    @Column(unique = true, nullable = false, length = 100)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    @Column(name = "icon_url", columnDefinition = "TEXT")
    private String iconUrl;

    @Min(value = 0, message = "排序不能小于0")
    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;

    // Constructors
    public Category() {}

    public Category(String nameEn, String nameZh, String slug) {
        this.nameEn = nameEn;
        this.nameZh = nameZh;
        this.slug = slug;
    }

    public Category(String nameEn, String nameZh, String slug, Category parent) {
        this(nameEn, nameZh, slug);
        this.parent = parent;
    }

    // Business Methods
    public boolean isTopLevel() {
        return parent == null;
    }

    // Getters and Setters
    public String getNameEn() {
        return nameEn;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }

    public String getNameZh() {
        return nameZh;
    }

    public void setNameZh(String nameZh) {
        this.nameZh = nameZh;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public Category getParent() {
        return parent;
    }

    public void setParent(Category parent) {
        this.parent = parent;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}