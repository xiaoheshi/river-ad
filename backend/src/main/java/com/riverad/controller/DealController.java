package com.riverad.controller;

import com.riverad.model.Deal;
import com.riverad.service.DealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/deals")
public class DealController {

    @Autowired
    private DealService dealService;

    @GetMapping("/public")
    public ResponseEntity<Page<Deal>> getDeals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Deal> deals = dealService.getActiveDeals(page, size);
        return ResponseEntity.ok(deals);
    }

    @GetMapping("/public/search")
    public ResponseEntity<Page<Deal>> searchDeals(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Deal> deals = dealService.searchDeals(keyword, page, size);
        return ResponseEntity.ok(deals);
    }

    @GetMapping("/public/category/{categoryId}")
    public ResponseEntity<Page<Deal>> getDealsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Deal> deals = dealService.getDealsByCategory(categoryId, page, size);
        return ResponseEntity.ok(deals);
    }

    @GetMapping("/public/store/{storeId}")
    public ResponseEntity<Page<Deal>> getDealsByStore(
            @PathVariable Long storeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Deal> deals = dealService.getDealsByStore(storeId, page, size);
        return ResponseEntity.ok(deals);
    }

    @GetMapping("/public/popular")
    public ResponseEntity<List<Deal>> getPopularDeals(
            @RequestParam(defaultValue = "10") int limit) {
        List<Deal> deals = dealService.getPopularDeals(limit);
        return ResponseEntity.ok(deals);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Deal> getDeal(@PathVariable Long id) {
        Optional<Deal> deal = dealService.getDealById(id);
        if (deal.isPresent()) {
            return ResponseEntity.ok(deal.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/public/{id}/click")
    public ResponseEntity<String> recordClick(@PathVariable Long id) {
        dealService.incrementClickCount(id);
        return ResponseEntity.ok("点击记录成功");
    }

    @GetMapping("/public/stats")
    public ResponseEntity<String> getStats() {
        long totalDeals = dealService.getTotalActiveDeals();
        return ResponseEntity.ok("当前活跃优惠数量: " + totalDeals);
    }
}