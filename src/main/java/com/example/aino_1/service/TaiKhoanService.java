package com.example.aino_1.service;

import com.example.aino_1.entity.*;
import com.example.aino_1.repository.GioHangInterface;
import com.example.aino_1.repository.TaiKhoanNguoiDungInterface;
import com.example.aino_1.repository.ThongTinTaiKhoaninterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TaiKhoanService {

    @Autowired
    TaiKhoanNguoiDungInterface taiKhoanNguoiDungInterface;

    @Autowired
    ThongTinTaiKhoaninterface thongTinTaiKhoaninterface;


    @Autowired
    GioHangInterface ghsi;

    public Boolean addTaiKhoan(TaiKhoanNguoiDung tknd) {
        try {
            // Bước 1: Lưu sản phẩm
            if (tknd == null) {
                throw new IllegalArgumentException("Thông tin sản phẩm không được để trống.");
            }
            TaiKhoanNguoiDung saveTKNG = taiKhoanNguoiDungInterface.save(tknd);

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

    public List<Map<String, String>> getTaiKhoan() {
        List<TaiKhoanNguoiDung> listTaiKhoanNguoiDung = taiKhoanNguoiDungInterface.findAll();
        List<ThongTinTaiKhoan> listThongTinTaiKhoan = thongTinTaiKhoaninterface.findAll();

        // Tạo Map để tìm thông tin tài khoản theo ID
        Map<Integer, ThongTinTaiKhoan> thongTinMap = listThongTinTaiKhoan.stream()
                .collect(Collectors.toMap(ThongTinTaiKhoan::getId, tt -> tt)); // Đảm bảo lấy ID phù hợp

        // Tạo danh sách chứa id, hoTen và chucVu, loại bỏ chức vụ "USER"
        return listTaiKhoanNguoiDung.stream()
                .filter(taiKhoan -> !"USER".equalsIgnoreCase(taiKhoan.getChucVu())) // Loại bỏ các tài khoản chức vụ "USER"
                .map(taiKhoan -> {
                    ThongTinTaiKhoan thongTin = thongTinMap.get(taiKhoan.getId());
                    if (thongTin != null) {
                        Map<String, String> result = new HashMap<>();
                        result.put("id", String.valueOf(taiKhoan.getId())); // Chuyển `id` thành chuỗi
                        result.put("hoTen", thongTin.getHoTen());
                        result.put("chucVu", taiKhoan.getChucVu());
                        return result;
                    }
                    return null;
                })
                .filter(Objects::nonNull) // Loại bỏ các phần tử null
                .collect(Collectors.toList());
    }


}
