package com.example.aino_1.repository;

import com.example.aino_1.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonInterface extends JpaRepository<HoaDon,Integer> {

    @Query("SELECT h FROM HoaDon h " +
            "JOIN h.voucher v " +
            "JOIN h.thongTinTaiKhoan t " +
            "WHERE t.soDienThoai = :soDienThoai " +
            "AND v.maVoucher = :maVoucher")
    List<HoaDon> findBySoDienThoaiAndMaVoucher(@Param("soDienThoai") String soDienThoai,
                                               @Param("maVoucher") String maVoucher);


    public HoaDon findHoaDonByMaHoaDon(String mahoaDon);
}
