package com.example.aino_1.repository;

import com.example.aino_1.entity.GioHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    // Thống kê doanh thu theo từng tháng
    @Query(value = """
            SELECT FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM') , SUM(hd.tongTien) 
            FROM HoaDon hd
            WHERE hd.trangThaiThanhToan = 1 AND MONTH(hd.thoiGianLapHoaDon) = :thang
            GROUP BY FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM')
            ORDER BY FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM')
            """)
    Object[] getMonth(@Param("thang") Integer thang);

    @Query("""
            SELECT YEAR(hd.thoiGianLapHoaDon), SUM(hd.tongTien)
            FROM HoaDon hd
            WHERE hd.trangThaiThanhToan = 1 AND YEAR(hd.thoiGianLapHoaDon) = :nam
            GROUP BY YEAR(hd.thoiGianLapHoaDon)
            ORDER BY YEAR(hd.thoiGianLapHoaDon)
            """)
    Object[] getYear(@Param("nam") Integer nam);

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
  //  số sa phẩm đã bán
    @Query("""
           select COUNT(hdct.soLuong)
           from HoaDonChiTiet hdct
           join HoaDon hd
           on hdct.hoaDon.id = hd.id
           where hd.trangThaiThanhToan = 1
            """)
    Integer soSanPhamDaBan();
    //tổng doanh thu
    @Query("""
            SELECT SUM(hd.tongTien) FROM HoaDon hd WHERE hd.trangThaiThanhToan = 1
            """)
    Double tongdoanhthu();
}