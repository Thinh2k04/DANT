package com.example.aino_1.repository;

import com.example.aino_1.entity.HoaDon;
import com.example.aino_1.entity.TimelineHoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimelineHoaDonInterface extends JpaRepository<TimelineHoaDon, Integer> {
    // Sửa lại tên phương thức đúng
    List<TimelineHoaDon> findAllByHoaDon_Id(Integer hoaDonId);

    // Thêm phương thức tìm trạng thái gần nhất
    TimelineHoaDon findTopByHoaDon_IdOrderByThoiGianCapNhatDesc(Integer hoaDonId);
}
