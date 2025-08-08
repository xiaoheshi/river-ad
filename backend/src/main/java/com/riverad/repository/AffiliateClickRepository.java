package com.riverad.repository;

import com.riverad.model.AffiliateClick;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AffiliateClickRepository extends JpaRepository<AffiliateClick, String> {
    
    @Query("SELECT COUNT(a) FROM AffiliateClick a WHERE a.deal.id = :dealId AND a.clickTimestamp >= :startTime")
    long countClicksByDealAfter(@Param("dealId") Long dealId, @Param("startTime") LocalDateTime startTime);
    
    @Query("SELECT COUNT(a) FROM AffiliateClick a WHERE a.converted = true AND a.conversionTimestamp >= :startTime")
    long countConversionsAfter(@Param("startTime") LocalDateTime startTime);
    
    @Query("SELECT SUM(a.commissionAmount) FROM AffiliateClick a WHERE a.converted = true AND a.conversionTimestamp >= :startTime")
    Double sumCommissionsAfter(@Param("startTime") LocalDateTime startTime);
    
    @Query("SELECT a FROM AffiliateClick a WHERE a.ipAddress = :ip AND a.clickTimestamp >= :recentTime")
    List<AffiliateClick> findRecentClicksByIp(@Param("ip") String ip, @Param("recentTime") LocalDateTime recentTime);
    
    @Query("SELECT a FROM AffiliateClick a WHERE a.user.id = :userId ORDER BY a.clickTimestamp DESC")
    List<AffiliateClick> findClicksByUserId(@Param("userId") Long userId);
}