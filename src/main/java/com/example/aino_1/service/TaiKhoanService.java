package com.example.aino_1.service;

import com.example.aino_1.entity.*;
import com.example.aino_1.repository.GioHangChiTietInterface;
import com.example.aino_1.repository.TaiKhoanNguoiDungInterface;
import com.example.aino_1.repository.ThongTinTaiKhoaninterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TaiKhoanService {

    @Autowired
    EmailService emailService;

    @Autowired
    TaiKhoanNguoiDungInterface taiKhoanNguoiDungInterface;

    @Autowired
    ThongTinTaiKhoaninterface thongTinTaiKhoaninterface;


    @Autowired
    GioHangChiTietInterface gioHangChiTietInterface;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder; // Đảm bảo được tự động khởi tạo

    public Boolean addTaiKhoan(TaiKhoanNguoiDung tknd) {
        try {
            // Bước 1: Lưu sản phẩm
            if (tknd == null) {
                throw new IllegalArgumentException("Thông tin sản phẩm không được để trống.");
            }
            TaiKhoanNguoiDung saveTKNG = taiKhoanNguoiDungInterface.save(tknd);

            GioHangChiTiet ghct = new GioHangChiTiet();
            ghct.setTaiKhoanNguoiDung(tknd);
            GioHangChiTiet saveGioHangChiTiet = gioHangChiTietInterface.save(ghct);


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


    public boolean changePassword(String username, String oldPassword, String newPassword) {
        // Tìm tài khoản theo username
        Optional<TaiKhoanNguoiDung> optionalTaiKhoan = taiKhoanNguoiDungInterface.findByUsername(username);

        if (optionalTaiKhoan.isEmpty()) {
            return false; // Không tìm thấy tài khoản
        }

        TaiKhoanNguoiDung taiKhoan = optionalTaiKhoan.get();

        // Kiểm tra mật khẩu cũ
        if (!passwordEncoder.matches(oldPassword, taiKhoan.getPassword())) {
            return false; // Mật khẩu cũ không đúng
        }

        // Cập nhật mật khẩu mới
        taiKhoan.setPassword(passwordEncoder.encode(newPassword));
        taiKhoanNguoiDungInterface.save(taiKhoan);

        return true;
    }

    public boolean handleForgotPassword(String email, String username) {
        // Tìm tài khoản theo email
        Optional<TaiKhoanNguoiDung> optionalTaiKhoan = taiKhoanNguoiDungInterface.findByEmailAndUsername(email,username);

        if (optionalTaiKhoan.isEmpty()) {
            return false; // Không tìm thấy tài khoản
        }

        TaiKhoanNguoiDung taiKhoan = optionalTaiKhoan.get();

        // Tạo mật khẩu tạm thời
        String temporaryPassword = UUID.randomUUID().toString().substring(0, 8);
        taiKhoan.setPassword(passwordEncoder.encode(temporaryPassword));

        // Cập nhật mật khẩu mới trong cơ sở dữ liệu
        taiKhoanNguoiDungInterface.save(taiKhoan);

        // Tạo nội dung email
        String subject = "Khôi phục mật khẩu";
        String messageContent = "Xin chào,\n\n" +
                "Mật khẩu tạm thời của bạn là: " + temporaryPassword + "\n\n" +
                "Vui lòng đổi mật khẩu ngay sau khi đăng nhập.\n\n" +
                "Trân trọng,\nĐội ngũ hỗ trợ.";

        // Gửi email
        try {
            emailService.sendEmailWithAttachment(email, subject, messageContent, null, null); // Không có file đính kèm
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
