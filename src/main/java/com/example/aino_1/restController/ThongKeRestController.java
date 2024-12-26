package com.example.aino_1.restController;

import com.example.aino_1.entity.Voucher;

import com.example.aino_1.repository.ThongKeInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/thong_ke") //đường dẫn chung cho các phương thức http bên dưới
public class ThongKeRestController {
    @Autowired
    ThongKeInterface tksi;

    @GetMapping("/theoThang")
    public List<Object[]> getMonthlyRevenue() {
        return tksi.getMonthlyRevenue();
    }

    @GetMapping("/thang/{thang}")
    public Object[] getMonth(@PathVariable Integer thang) {
        return tksi.getMonth(thang);
    }

    @GetMapping("/nam/{nam}")
    public Object[] getYear(@PathVariable Integer nam) {
        return tksi.getYear(nam);
    }

    @GetMapping("/theoNam")
    public List<Object[]> getYearlyRevenue() {
        return tksi.getYearlyRevenue();
    }

    @GetMapping("/daThanhToan")
    public Integer soDonHangThanhToan() {
        return tksi.soDonHangThanhToan();
    }

    @GetMapping("/daBan")
    public Integer soSanPhamDaBan() {
        return tksi.soSanPhamDaBan();
    }
    @GetMapping("/tongDoanhThu")
    public Double tongDoanhThu(){
        return tksi.tongdoanhthu();
    }
}