package com.example.aino_1.serviceImpl;

import com.example.aino_1.repository.ThongKeInterface;
import com.example.aino_1.serviceInter.ThongKeServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

//dựa trên cách quản lý bean của spring thì service phải đặt annotation ở tầng implements
@Service
public class ThongKeServiceImpl implements ThongKeServiceInter {
    @Autowired
    ThongKeInterface tki;

    @Override
    public List<Object[]> getMonthlyRevenue() {
        return tki.getMonthlyRevenue();
    }

    @Override
    public List<Object[]> getYearlyRevenue() {
        return tki.getYearlyRevenue();
    }

    @Override
    public Integer soDonHangThanhToan() {
        return tki.soDonHangThanhToan();
    }

//    @Override
//    public Integer soKhachHangDangKy(){
//        return tki.soKhachHangDangKy();
//    }

    @Override
    public Double tongDoanhThu(){
        return tki.tongdoanhthu();
    }
}