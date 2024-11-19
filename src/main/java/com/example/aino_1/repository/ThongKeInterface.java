//package com.example.aino_1.repository;
//
//import com.example.aino_1.entity.GioHang;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface ThongKeInterface extends JpaRepository<GioHang, Integer> {
//    // Thống kê doanh thu theo tháng
//    @Query(value = """
//            SELECT FORMAT(dh.thoiGianThanhToan, 'yyyy-MM') , SUM(dh.tongTien) AS doanhThu
//            FROM GioHang dh
//            WHERE dh.trangThai = 'Đã thanh toán'
//            GROUP BY FORMAT(dh.thoiGianThanhToan, 'yyyy-MM')
//            ORDER BY FORMAT(dh.thoiGianThanhToan, 'yyyy-MM')
//            """)
//    List<Object[]> getMonthlyRevenue();
//    //  Thống kê doanh thu theo năm
//    @Query("""
//            SELECT YEAR(dh.thoiGianThanhToan), SUM(dh.tongTien) AS doanhThu
//            FROM GioHang dh
//            WHERE dh.trangThai = 'Đã thanh toán'
//            GROUP BY YEAR(dh.thoiGianThanhToan)
//            ORDER BY YEAR(dh.thoiGianThanhToan)
//            """)
//    List<Object[]> getYearlyRevenue();
//
//    // đếm số đơn thanh toán
//    @Query("""
//            SELECT COUNT(dh.id) FROM GioHang dh WHERE dh.trangThai = 'Đã thanh toán'
//            """)
//    Integer soDonHangThanhToan();
//    //số khách hàng đăng ký tài khoản
////    @Query("""
////            select COUNT(tknd.id) from TaiKhoanNguoiDung tknd
////            JOIN ChucVu cv
////            on cv.maChucVu = tknd.chucVu.maChucVu
////            where cv.vaiTro = 'CUSTOMER'
////            """)
////    Integer soKhachHangDangKy();
//    //tổng doanh thu
//    @Query("""
//            SELECT SUM(dh.tongTien) FROM GioHang dh WHERE dh.trangThai = 'Đã thanh toán'
//            """)
//    Double tongdoanhthu();
//}