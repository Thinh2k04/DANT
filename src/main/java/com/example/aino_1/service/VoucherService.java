package com.example.aino_1.service;

import com.example.aino_1.entity.HoaDon;
import com.example.aino_1.entity.Voucher;
import com.example.aino_1.repository.HoaDonInterface;
import com.example.aino_1.repository.VoucherInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class VoucherService {
    @Autowired
    HoaDonInterface hdif;

    @Autowired
    VoucherInterface voucherInterface;

    public boolean checkVoucherUsed(String sdt, String maVoucher) {
        System.out.println("VoucherService: CHạy vào luồng kiểm tra voucher với SDT " + sdt);
        // Tìm các hóa đơn đã sử dụng voucher và có số điện thoại trùng khớp
        List<HoaDon> resultHD = hdif.findBySoDienThoaiAndMaVoucher(sdt, maVoucher);

        // Nếu không tìm thấy hóa đơn nào thì voucher chưa được sử dụng
        return resultHD == null || resultHD.isEmpty();
    }

    public Voucher findVoucher(String voucher) {
        List<Voucher> vouchers = voucherInterface.findAll();
        for (Voucher voucher1 : vouchers) {
            if (voucher1.getMaVoucher().equals(voucher)) {
                return voucher1; // Trả về ngay khi tìm thấy
            }
        }
        return null; // Không tìm thấy
    }


}
