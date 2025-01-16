package com.example.aino_1.repository;

import com.example.aino_1.dto.TTTKDTO;
import com.example.aino_1.entity.ThongTinTaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ThongTinTaiKhoaninterface extends JpaRepository<ThongTinTaiKhoan,Integer> {

    @Query("SELECT new com.example.aino_1.dto.TTTKDTO(" +
            "tttk.hoTen,tttk.soDienThoai,tttk.diaChi,tttk.email,tttk.soCCCD" +
            ")" +
            "FROM ThongTinTaiKhoan tttk where tttk.soDienThoai = :SDT"

    )
    TTTKDTO timTTTKBySDT(@Param("SDT") String SDT);

    // tìm kiếm thông tin tài khoản người dùng bằng username
    Optional<ThongTinTaiKhoan> findThongTinTaiKhoanByTaiKhoanNguoiDungUsername(String username);
}
