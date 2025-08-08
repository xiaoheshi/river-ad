package com.riverad.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "affiliate_clicks")
public class AffiliateClick {

    @Id
    @Column(name = "click_id", length = 36)
    private String clickId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deal_id", nullable = false)
    private Deal deal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "referrer", length = 500)
    private String referrer;

    @Column(name = "click_timestamp", nullable = false)
    private LocalDateTime clickTimestamp;

    @Column(name = "converted")
    private Boolean converted = false;

    @Column(name = "conversion_timestamp")
    private LocalDateTime conversionTimestamp;

    @Column(name = "commission_amount", precision = 10, scale = 2)
    private Double commissionAmount;

    public AffiliateClick() {}

    public AffiliateClick(String clickId, Deal deal, String ipAddress) {
        this.clickId = clickId;
        this.deal = deal;
        this.ipAddress = ipAddress;
        this.clickTimestamp = LocalDateTime.now();
    }

    public String getClickId() {
        return clickId;
    }

    public void setClickId(String clickId) {
        this.clickId = clickId;
    }

    public Deal getDeal() {
        return deal;
    }

    public void setDeal(Deal deal) {
        this.deal = deal;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getReferrer() {
        return referrer;
    }

    public void setReferrer(String referrer) {
        this.referrer = referrer;
    }

    public LocalDateTime getClickTimestamp() {
        return clickTimestamp;
    }

    public void setClickTimestamp(LocalDateTime clickTimestamp) {
        this.clickTimestamp = clickTimestamp;
    }

    public Boolean getConverted() {
        return converted;
    }

    public void setConverted(Boolean converted) {
        this.converted = converted;
    }

    public LocalDateTime getConversionTimestamp() {
        return conversionTimestamp;
    }

    public void setConversionTimestamp(LocalDateTime conversionTimestamp) {
        this.conversionTimestamp = conversionTimestamp;
    }

    public Double getCommissionAmount() {
        return commissionAmount;
    }

    public void setCommissionAmount(Double commissionAmount) {
        this.commissionAmount = commissionAmount;
    }
}