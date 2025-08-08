package com.riverad.service;

import com.riverad.model.AffiliateClick;
import com.riverad.model.Deal;
import com.riverad.model.User;
import com.riverad.repository.AffiliateClickRepository;
import com.riverad.repository.DealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class AffiliateService {

    @Autowired
    private AffiliateClickRepository affiliateClickRepository;
    
    @Autowired
    private DealRepository dealRepository;
    
    @Value("${app.affiliate.default-commission-rate}")
    private Double defaultCommissionRate;

    public String trackClick(Long dealId, Long userId, String ipAddress, String userAgent, String referrer) {
        Optional<Deal> dealOpt = dealRepository.findById(dealId);
        if (dealOpt.isEmpty()) {
            throw new IllegalArgumentException("优惠信息不存在: " + dealId);
        }
        
        Deal deal = dealOpt.get();
        String clickId = UUID.randomUUID().toString();
        
        AffiliateClick click = new AffiliateClick(clickId, deal, ipAddress);
        click.setUserAgent(userAgent);
        click.setReferrer(referrer);
        
        if (userId != null) {
            User user = new User();
            user.setId(userId);
            click.setUser(user);
        }
        
        affiliateClickRepository.save(click);
        
        deal.setClickCount(deal.getClickCount() + 1);
        dealRepository.save(deal);
        
        return clickId;
    }

    public String generateAffiliateUrl(Long dealId, Long userId) {
        String clickId = UUID.randomUUID().toString();
        
        return String.format("/api/affiliate/redirect/%s?deal=%d&user=%d", 
                            clickId, dealId, userId != null ? userId : 0);
    }

    public void recordConversion(String clickId, Double orderAmount) {
        Optional<AffiliateClick> clickOpt = affiliateClickRepository.findById(clickId);
        if (clickOpt.isEmpty()) {
            throw new IllegalArgumentException("点击记录不存在: " + clickId);
        }
        
        AffiliateClick click = clickOpt.get();
        if (click.getConverted()) {
            throw new IllegalArgumentException("此点击已记录转化: " + clickId);
        }
        
        click.setConverted(true);
        click.setConversionTimestamp(LocalDateTime.now());
        
        Double commissionRate = click.getDeal().getCommissionRate();
        if (commissionRate == null) {
            commissionRate = defaultCommissionRate;
        }
        
        Double commissionAmount = orderAmount * commissionRate;
        click.setCommissionAmount(commissionAmount);
        
        affiliateClickRepository.save(click);
    }

    @Transactional(readOnly = true)
    public long getTotalClicksForDeal(Long dealId, int hours) {
        LocalDateTime startTime = LocalDateTime.now().minusHours(hours);
        return affiliateClickRepository.countClicksByDealAfter(dealId, startTime);
    }

    @Transactional(readOnly = true)
    public long getTotalConversions(int days) {
        LocalDateTime startTime = LocalDateTime.now().minusDays(days);
        return affiliateClickRepository.countConversionsAfter(startTime);
    }

    @Transactional(readOnly = true)
    public Double getTotalCommissions(int days) {
        LocalDateTime startTime = LocalDateTime.now().minusDays(days);
        Double total = affiliateClickRepository.sumCommissionsAfter(startTime);
        return total != null ? total : 0.0;
    }

    @Transactional(readOnly = true)
    public boolean isRecentClick(String ipAddress, int minutesThreshold) {
        LocalDateTime recentTime = LocalDateTime.now().minusMinutes(minutesThreshold);
        List<AffiliateClick> recentClicks = affiliateClickRepository.findRecentClicksByIp(ipAddress, recentTime);
        return !recentClicks.isEmpty();
    }

    @Transactional(readOnly = true)
    public List<AffiliateClick> getUserClickHistory(Long userId) {
        return affiliateClickRepository.findClicksByUserId(userId);
    }
}