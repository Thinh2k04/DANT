package com.example.aino_1.repository;

import com.example.aino_1.entity.HoaDonChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HDCTInterFace  extends JpaRepository<HoaDonChiTiet, Integer> {
    @Query("SELECT hdct FROM HoaDon hd JOIN HoaDonChiTiet hdct on hd.id = hdct.hoaDon.id WHERE hd.id = :id")
    List<HoaDonChiTiet> findHoaDonWithDetailsById(@Param("id") Integer id);
}