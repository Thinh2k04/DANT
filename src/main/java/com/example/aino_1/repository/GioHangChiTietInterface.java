package com.example.aino_1.repository;

import com.example.aino_1.entity.GioHangChiTiet;
import com.example.aino_1.entity.TaiKhoanNguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GioHangChiTietInterface extends JpaRepository<GioHangChiTiet, Integer> {
//    boolean existsByGioHangId(Integer idGioHang);
    List<GioHangChiTiet> findGioHangChiTietByTaiKhoanNguoiDungUsername(String user);

    GioHangChiTiet findGioHangChiTietByTaiKhoanNguoiDungUsernameAndSanPhamChiTiet_Id(String usname, Integer id);
}
