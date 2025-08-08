package com.riverad.controller;

import com.riverad.model.Deal;
import com.riverad.service.AffiliateService;
import com.riverad.service.DealService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/affiliate")
public class AffiliateController {

    @Autowired
    private AffiliateService affiliateService;
    
    @Autowired
    private DealService dealService;

    @PostMapping("/track")
    public ResponseEntity<String> trackClick(
            @RequestParam Long dealId,
            @RequestParam(required = false) Long userId,
            HttpServletRequest request) {
        
        try {
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            String referrer = request.getHeader("Referer");
            
            if (affiliateService.isRecentClick(ipAddress, 1)) {
                return ResponseEntity.badRequest().body("点击过于频繁，请稍后再试");
            }
            
            String clickId = affiliateService.trackClick(dealId, userId, ipAddress, userAgent, referrer);
            return ResponseEntity.ok("点击跟踪成功，ID: " + clickId);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/redirect/{clickId}")
    public ResponseEntity<Void> redirectToAffiliate(
            @PathVariable String clickId,
            @RequestParam Long deal,
            @RequestParam(required = false, defaultValue = "0") Long user,
            HttpServletRequest request) {
        
        try {
            Optional<Deal> dealOpt = dealService.getDealById(deal);
            if (dealOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Deal dealEntity = dealOpt.get();
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            String referrer = request.getHeader("Referer");
            
            affiliateService.trackClick(deal, user > 0 ? user : null, ipAddress, userAgent, referrer);
            
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", dealEntity.getAffiliateUrl())
                    .build();
                    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/conversion")
    public ResponseEntity<String> recordConversion(
            @RequestParam String clickId,
            @RequestParam Double orderAmount) {
        
        try {
            affiliateService.recordConversion(clickId, orderAmount);
            return ResponseEntity.ok("转化记录成功");
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/stats/clicks/{dealId}")
    public ResponseEntity<Long> getDealClicks(
            @PathVariable Long dealId,
            @RequestParam(defaultValue = "24") int hours) {
        
        long clicks = affiliateService.getTotalClicksForDeal(dealId, hours);
        return ResponseEntity.ok(clicks);
    }

    @GetMapping("/stats/conversions")
    public ResponseEntity<Long> getTotalConversions(
            @RequestParam(defaultValue = "7") int days) {
        
        long conversions = affiliateService.getTotalConversions(days);
        return ResponseEntity.ok(conversions);
    }

    @GetMapping("/stats/commissions")
    public ResponseEntity<Double> getTotalCommissions(
            @RequestParam(defaultValue = "30") int days) {
        
        Double commissions = affiliateService.getTotalCommissions(days);
        return ResponseEntity.ok(commissions);
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}