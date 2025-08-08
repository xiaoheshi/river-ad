package com.riverad.service;

import com.riverad.model.Deal;
import com.riverad.repository.DealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DealService {

    @Autowired
    private DealRepository dealRepository;

    @Transactional(readOnly = true)
    public Page<Deal> getActiveDeals(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return dealRepository.findActiveDeals(LocalDateTime.now(), pageable);
    }

    @Transactional(readOnly = true)
    public Page<Deal> searchDeals(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return dealRepository.searchActiveDeals(keyword, LocalDateTime.now(), pageable);
    }

    @Transactional(readOnly = true)
    public Page<Deal> getDealsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return dealRepository.findActiveDealsByCategory(categoryId, LocalDateTime.now(), pageable);
    }

    @Transactional(readOnly = true)
    public Page<Deal> getDealsByStore(Long storeId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return dealRepository.findActiveDealsByStore(storeId, LocalDateTime.now(), pageable);
    }

    @Transactional(readOnly = true)
    public List<Deal> getPopularDeals(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return dealRepository.findPopularDeals(LocalDateTime.now(), pageable);
    }

    @Transactional(readOnly = true)
    public Optional<Deal> getDealById(Long id) {
        return dealRepository.findById(id);
    }

    public void incrementClickCount(Long dealId) {
        Optional<Deal> dealOpt = dealRepository.findById(dealId);
        if (dealOpt.isPresent()) {
            Deal deal = dealOpt.get();
            deal.setClickCount(deal.getClickCount() + 1);
            dealRepository.save(deal);
        }
    }

    @Transactional(readOnly = true)
    public long getTotalActiveDeals() {
        return dealRepository.countActiveDeals(LocalDateTime.now());
    }
}