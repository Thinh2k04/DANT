//package com.example.aino_1.repository;
//
//import com.example.aino_1.entity.TaiKhoanNguoiDung;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//@Repository
//public interface TaiKhoanNguoiDungInterface extends JpaRepository<TaiKhoanNguoiDung, Integer> {
//    @Query("SELECT tknd FROM TaiKhoanNguoiDung tknd WHERE tknd.tenTaiKhoan = :tenTaiKhoan")
//    TaiKhoanNguoiDung findByUsername(@Param("tenTaiKhoan") String tenTaiKhoan);
//
//    @Query("select c.vaiTro from TaiKhoanNguoiDung tknd join ChucVu c on tknd.chucVu.maChucVu = c.maChucVu where tknd.tenTaiKhoan = :tenTaiKhoan")
//    String getRoleByUsername(@Param("tenTaiKhoan") String tenTaiKhoan);
//}
