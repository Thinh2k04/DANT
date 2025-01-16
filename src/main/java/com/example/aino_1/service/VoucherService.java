package com.example.aino_1.service;

import com.example.aino_1.entity.DiscountCampaign;
import com.example.aino_1.entity.HoaDon;
import com.example.aino_1.entity.Voucher;
import com.example.aino_1.repository.HoaDonInterface;
import com.example.aino_1.repository.VoucherInterface;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    @Scheduled(fixedRate = 60000) // Cập nhật mỗi 60 giây
    public void updateActiveVoucher() {
        updateActiveVoucherMain();

    }

    @Transactional
    public void updateActiveVoucherMain() {
        LocalDateTime now = LocalDateTime.now();

        // Lấy danh sách tất cả các DiscountCampaign
        List<Voucher> voucherList = voucherInterface.findAll();

        for (Voucher voucher : voucherList) {
            if (voucher.getThoiGianApDung().isBefore(now) && voucher.getThoiGianHenKet().isAfter(now)) {
                // Trong khoảng thời gian hoạt động, set active = true
                voucher.setTrangThai(1);
            } else {
                // Ngoài khoảng thời gian hoạt động, set active = false
                voucher.setTrangThai(0);
            }
        }

        // Lưu danh sách đã cập nhật
        voucherInterface.saveAll(voucherList);
    }


}
