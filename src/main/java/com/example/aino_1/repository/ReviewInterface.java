package com.example.aino_1.repository;

import com.example.aino_1.entity.Ram;
import com.example.aino_1.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewInterface extends JpaRepository<Review, Integer> {
    boolean existsByHoaDonChiTiet_Id(Integer hoaDonChiTietId);
}
