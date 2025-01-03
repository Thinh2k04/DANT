package com.example.aino_1.service;

import com.example.aino_1.entity.*;
import com.example.aino_1.repository.GioHangInterface;
import com.example.aino_1.repository.TaiKhoanNguoiDungInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class TaiKhoanService {

    @Autowired
    TaiKhoanNguoiDungInterface tkndsi;

    @Autowired
    GioHangInterface ghsi;
    public Boolean addTaiKhoan(TaiKhoanNguoiDung tknd) {
        try {
            // Bước 1: Lưu sản phẩm
            if (tknd == null) {
                throw new IllegalArgumentException("Thông tin sản phẩm không được để trống.");
            }
            TaiKhoanNguoiDung saveTKNG = tkndsi.save(tknd);

            GioHang gioHang = new GioHang();
            gioHang.setTaiKhoanNguoiDung(tknd);
            GioHang saveGioHang = ghsi.save(gioHang);


            return true; // Thành công
        } catch (Exception e) {
            // Ghi log lỗi (nếu có hệ thống log)
            System.err.println("Lỗi khi thêm TaiKhoan: " + e.getMessage());
            return false; // Thất bại
        }
    }

}
