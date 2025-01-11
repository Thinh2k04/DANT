package com.example.aino_1.repository;

import com.example.aino_1.entity.HinhThucThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HinhThucThanhToanInterface extends JpaRepository<HinhThucThanhToan,Integer> {
    List<HinhThucThanhToan> findAllByTrangThai(Integer trangThai);

    HinhThucThanhToan findByid(Integer id);
}
