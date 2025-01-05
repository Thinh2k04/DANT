
package com.example.aino_1.repository;

import com.example.aino_1.dto.ThongKeDTO;
import com.example.aino_1.entity.GioHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThongKeInterface extends JpaRepository<GioHang, Integer> {
    // Thống kê doanh thu theo ngày hôm nay
    @Query("""
    SELECT new com.example.aino_1.dto.ThongKeDTO(
        FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM-dd'), 
        SUM(hd.tongTien)) 
    FROM HoaDon hd 
    WHERE hd.trangThaiThanhToan = 1 
    AND FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM-dd') = :ngay 
    GROUP BY FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM-dd')                                                                 
""")
    List<ThongKeDTO> findTongTienTheoNgay(@Param("ngay") String ngay);

    // Thống kê doanh thu theo từng ngày
    @Query("""
            SELECT new com.example.aino_1.dto.ThongKeDTO(
            FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM-dd'), 
            SUM(hd.tongTien)) 
            FROM HoaDon hd
            WHERE hd.trangThaiThanhToan = 1
            GROUP BY FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM-dd')
            ORDER BY FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM-dd')
            """)
    List<ThongKeDTO> getDailyRevenue();
    // Thống kê doanh thu theo tháng
    @Query( """
            SELECT new com.example.aino_1.dto.ThongKeDTO(
            FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM'), 
            SUM(hd.tongTien)) 
            FROM HoaDon hd
            WHERE hd.trangThaiThanhToan = 1
            GROUP BY FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM')
            ORDER BY FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM')
            """)
    List<ThongKeDTO> getMonthlyRevenue();
    // Thống kê doanh thu theo từng tháng
    @Query( """
            SELECT new com.example.aino_1.dto.ThongKeDTO(
            FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM'), 
            SUM(hd.tongTien)) 
            FROM HoaDon hd
            WHERE hd.trangThaiThanhToan = 1 AND FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM') = :thang
            GROUP BY FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM')
            ORDER BY FORMAT(hd.thoiGianLapHoaDon, 'yyyy-MM')
            """)
    ThongKeDTO getMonth(@Param("thang") String thang);

    @Query("""
            SELECT new com.example.aino_1.dto.ThongKeDTO(
            FORMAT(hd.thoiGianLapHoaDon, 'yyyy'), 
            SUM(hd.tongTien)) 
            FROM HoaDon hd
            WHERE hd.trangThaiThanhToan = 1 AND FORMAT(hd.thoiGianLapHoaDon, 'yyyy') = :nam
            GROUP BY FORMAT(hd.thoiGianLapHoaDon, 'yyyy')
            ORDER BY FORMAT(hd.thoiGianLapHoaDon, 'yyyy')
            """)
    ThongKeDTO getYear(@Param("nam") Integer nam);

    //  Thống kê doanh thu theo năm
    @Query("""
            SELECT new com.example.aino_1.dto.ThongKeDTO(
            FORMAT(hd.thoiGianLapHoaDon, 'yyyy'), 
            SUM(hd.tongTien)) 
            FROM HoaDon hd
            WHERE hd.trangThaiThanhToan = 1 
            GROUP BY FORMAT(hd.thoiGianLapHoaDon, 'yyyy')
            ORDER BY FORMAT(hd.thoiGianLapHoaDon, 'yyyy')
            """)
    List<ThongKeDTO> getYearlyRevenue();

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
