package com.riverad.repository;

import com.riverad.model.Deal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {
    
    @Query("SELECT d FROM Deal d WHERE d.isActive = true AND d.expiresAt > :now ORDER BY d.createdAt DESC")
    Page<Deal> findActiveDeals(@Param("now") LocalDateTime now, Pageable pageable);
    
    @Query("SELECT d FROM Deal d WHERE d.isActive = true AND d.expiresAt > :now AND " +
           "(LOWER(d.titleEn) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.titleZh) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Deal> searchActiveDeals(@Param("keyword") String keyword, @Param("now") LocalDateTime now, Pageable pageable);
    
    @Query("SELECT d FROM Deal d WHERE d.category.id = :categoryId AND d.isActive = true AND d.expiresAt > :now ORDER BY d.createdAt DESC")
    Page<Deal> findActiveDealsByCategory(@Param("categoryId") Long categoryId, @Param("now") LocalDateTime now, Pageable pageable);
    
    @Query("SELECT d FROM Deal d WHERE d.store.id = :storeId AND d.isActive = true AND d.expiresAt > :now ORDER BY d.createdAt DESC")
    Page<Deal> findActiveDealsByStore(@Param("storeId") Long storeId, @Param("now") LocalDateTime now, Pageable pageable);
    
    @Query("SELECT d FROM Deal d WHERE d.isActive = true AND d.expiresAt > :now ORDER BY d.clickCount DESC")
    List<Deal> findPopularDeals(@Param("now") LocalDateTime now, Pageable pageable);
    
    @Query("SELECT COUNT(d) FROM Deal d WHERE d.isActive = true AND d.expiresAt > :now")
    long countActiveDeals(@Param("now") LocalDateTime now);
}