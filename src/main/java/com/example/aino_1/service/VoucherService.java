package com.example.aino_1.service;

import com.example.aino_1.entity.HoaDon;
import com.example.aino_1.repository.HoaDonInterface;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class VoucherService {

    @Autowired
    HoaDonInterface hdif;

    public boolean checkVoucherUsed(String sdt,String maVoucher){
        Boolean result = true;
        System.out.println("VoucherService: CHạy vào luông kiểm tra voucher với SDT");
        List<HoaDon> resultHD =  hdif.findBySoDienThoaiAndMaVoucher(sdt,maVoucher);

       if(resultHD == null){
           return result;
       }else {
           result = false;
           return  result;
       }
    }
}
