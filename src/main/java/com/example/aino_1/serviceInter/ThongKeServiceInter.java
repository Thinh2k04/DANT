package com.example.aino_1.serviceInter;

import com.example.aino_1.entity.Voucher;

import java.math.BigDecimal;
import java.util.List;

public interface ThongKeServiceInter {
    List<Object[]> getMonthlyRevenue();

    List<Object[]> getYearlyRevenue();

    Integer soDonHangThanhToan();
    //    Integer soKhachHangDangKy();
    Double tongDoanhThu();
}