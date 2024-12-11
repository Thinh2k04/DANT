package com.example.aino_1.repository;

import com.example.aino_1.entity.GioHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThongKeInterface extends JpaRepository<GioHang, Integer> {
    // Thống kê doanh thu theo tháng
    @Query(value = """
            SELECT FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM') , SUM(hd.tongTien) 
            FROM HoaDon hd
            WHERE hd.trangThaiThanhToan = 1
            GROUP BY FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM')
            ORDER BY FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM')
            """)
    List<Object[]> getMonthlyRevenue();
    //  Thống kê doanh thu theo năm
    @Query("""
            SELECT YEAR(hd.thoiGianLapHoaDon), SUM(hd.tongTien)
            FROM HoaDon hd
            WHERE hd.trangThaiThanhToan = 1
            GROUP BY YEAR(hd.thoiGianLapHoaDon)
            ORDER BY YEAR(hd.thoiGianLapHoaDon)
            """)
    List<Object[]> getYearlyRevenue();

    // đếm số đơn thanh toán
    @Query("""
            SELECT COUNT(hd.id) FROM HoaDon hd WHERE hd.trangThaiThanhToan = 1
            """)
    Integer soDonHangThanhToan();
    //số khách hàng đăng ký tài khoản
//    @Query("""
//            select COUNT(tknd.id) from TaiKhoanNguoiDung tknd
//            JOIN ChucVu cv
//            on cv.maChucVu = tknd.chucVu.maChucVu
//            where cv.vaiTro = 'CUSTOMER'
//            """)
//    Integer soKhachHangDangKy();
    //tổng doanh thu
    @Query("""
            SELECT SUM(hd.tongTien) FROM HoaDon hd WHERE hd.trangThaiThanhToan = 1
            """)
    Double tongdoanhthu();
}