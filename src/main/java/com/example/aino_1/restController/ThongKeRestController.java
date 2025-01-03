package com.example.aino_1.restController;

import com.example.aino_1.dto.ThongKeDTO;
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

    @GetMapping("/getToday/{ngay}")
    public List<ThongKeDTO> getTongTienTheoNgay(@PathVariable String ngay) {
        return tksi.findTongTienTheoNgay(ngay);
    }

    @GetMapping("/theoNgay")
    public List<ThongKeDTO> getDailyRevenue() {
        return tksi.getDailyRevenue();
    }

    @GetMapping("/theoThang")
    public List<ThongKeDTO> getMonthlyRevenue() {
        return tksi.getMonthlyRevenue();
    }

    @GetMapping("/thang/{thang}")
    public ThongKeDTO getMonth(@PathVariable Integer thang) {
        return tksi.getMonth(thang);
    }

    @GetMapping("/nam/{nam}")
    public ThongKeDTO getYear(@PathVariable Integer nam) {
        return tksi.getYear(nam);
    }

    @GetMapping("/theoNam")
    public List<ThongKeDTO> getYearlyRevenue() {
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