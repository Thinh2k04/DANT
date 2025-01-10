package com.example.aino_1.repository;

import com.example.aino_1.entity.DiscountCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiscountCampaignInterface extends JpaRepository<DiscountCampaign,Integer> {
    List<DiscountCampaign> findByActiveTrueAndStartDateBeforeAndEndDateAfter(
            LocalDateTime startDate,
            LocalDateTime endDate
    );

}
