package com.example.aino_1.service;


import com.example.aino_1.entity.*;
import com.example.aino_1.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HoaDonService {

    @Autowired
    ThongTinTaiKhoaninterface tttksi;

    @Autowired
    HoaDonInterface hdsi;

    @Autowired
    HDCTInterFace hdctsi;


    @Autowired
    VoucherInterface vcsi;

    @Autowired
    TaiKhoanInterface tksi;

    @Transactional
    public void hamXuLiHoaDon(ThongTinTaiKhoan ttk, HoaDon hd, List<HoaDonChiTiet> lhdct) {
//        // Lưu thông tin tài khoản
//        ThongTinTaiKhoan stttk = tttksi.save(ttk);
        System.out.println("CHạy vào phần hóa đơn service");

        // Kiểm tra nếu khách hàng không đăng nhập
        if (ttk.getTaiKhoanNguoiDung() == null) {
            System.out.println("Chạy vào phần xử lí tiafk hoản người dùng null");
            // Không xử lý TaiKhoanNguoiDung, tiếp tục lưu ThongTinTaiKhoan
            ThongTinTaiKhoan savedThongTinTaiKhoan = tttksi.save(ttk);
            hd.setThongTinTaiKhoan(savedThongTinTaiKhoan);
            // Liên kết tài khoản vào hóa đơn
            hd.setThongTinTaiKhoan(savedThongTinTaiKhoan);

        } else {
            // Lưu TaiKhoanNguoiDung nếu tồn tại
            System.out.println("Chạy vào phần xử lí tiafk hoản người dùng not null");
            TaiKhoanNguoiDung savedTaiKhoanNguoiDung = tksi.save(ttk.getTaiKhoanNguoiDung());
            ttk.setTaiKhoanNguoiDung(savedTaiKhoanNguoiDung);
            ThongTinTaiKhoan savedThongTinTaiKhoan = tttksi.save(ttk);
            hd.setThongTinTaiKhoan(savedThongTinTaiKhoan);
            // Liên kết tài khoản vào hóa đơn
            hd.setThongTinTaiKhoan(savedThongTinTaiKhoan);

        }

        System.out.println("Hoàn thành bước xử lí người dùng, tới bước kiểm tra didaj chỉ nhận hàng: " + hd.getDiaChiNhanHang());

        if (hd.getDiaChiNhanHang() == null || hd.getDiaChiNhanHang().isEmpty()) {
            System.out.println("Chạy vào phần xử lý địa chỉ nhận hàng null hoặc trống");
            String diaChiCuaHang = hd.getCuaHang().getTinh() +" "+ hd.getCuaHang().getHuyen() +" "+ hd.getCuaHang().getPhuong() +" "+ hd.getCuaHang().getSoNha();
            System.out.println("Địa chỉ của hàng: " + diaChiCuaHang);

            hd.setDiaChiNhanHang(diaChiCuaHang);
        }


        HoaDon shd = hdsi.save(hd);

        // Liên kết hóa đơn và lưu danh sách chi tiết
        for (HoaDonChiTiet hdct : lhdct) {
            hdct.setHoaDon(shd);
        }
        hdctsi.saveAll(lhdct); // Lưu theo batch
    }

}
