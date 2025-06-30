package com.example.aino_1.service;

import com.example.aino_1.dto.StaffDTO;
import com.example.aino_1.entity.*;
import com.example.aino_1.repository.GioHangChiTietInterface;
import com.example.aino_1.repository.TaiKhoanNguoiDungInterface;
import com.example.aino_1.repository.ThongTinTaiKhoaninterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    GioHangChiTietInterface gioHangChiTietInterface;

    public Boolean addTaiKhoanNguoiDungAsUser(TaiKhoanNguoiDung tknd) {
        try {
            // Gán các giá trị mặc định cho TaiKhoanNguoiDung
            tknd.setChucVu("USER"); // Gán chức vụ mặc định là USER
            tknd.setEnabled(1); // Mặc định tài khoản được kích hoạt
            tknd.setCreatedAt(LocalDateTime.now()); // Gán thời gian tạo
            tknd.setUpdatedAt(LocalDateTime.now()); // Gán thời gian cập nhật ban đầu

            // Lưu thông tin tài khoản người dùng
            TaiKhoanNguoiDung savedTKND = taiKhoanNguoiDungInterface.save(tknd);

            // Tự động tạo thông tin chi tiết tài khoản
            ThongTinTaiKhoan thongTin = new ThongTinTaiKhoan();
            // Các thông tin không bắt buộc được để trống (không gán giá trị)
            thongTin.setEmail(savedTKND.getEmail()); // Sử dụng email từ TaiKhoanNguoiDung
            thongTin.setTaiKhoanNguoiDung(savedTKND); // Liên kết với tài khoản người dùng
            thongTin.setTrangThai(1); // Mặc định trạng thái là kích hoạt

            // Lưu thông tin chi tiết tài khoản vào cơ sở dữ liệu
            thongTinTaiKhoaninterface.save(thongTin);

            // Tự động tạo giỏ hàng chi tiết
            GioHangChiTiet ghct = new GioHangChiTiet();
            ghct.setTaiKhoanNguoiDung(savedTKND); // Liên kết giỏ hàng với tài khoản người dùng
            gioHangChiTietInterface.save(ghct); // Lưu giỏ hàng chi tiết

            return true; // Thành công
        } catch (Exception e) {
            // Ghi log lỗi
            System.err.println("Lỗi khi thêm tài khoản người dùng: " + e.getMessage());
            return false; // Thất bại
        }
    }

    public boolean addTaiKhoanNguoiDungAsStaff(StaffDTO staffDTO) {
        try {
            // Tạo và gán giá trị cho TaiKhoanNguoiDung
            TaiKhoanNguoiDung tknd = new TaiKhoanNguoiDung();
            tknd.setUsername(staffDTO.getUsername());
            tknd.setEmail(staffDTO.getEmail());
            tknd.setPassword(staffDTO.getPassword()); // Mã hóa mật khẩu
            tknd.setChucVu("STAFF");
            tknd.setEnabled(Integer.valueOf("NULL"));
            tknd.setCreatedAt(LocalDateTime.now());
            tknd.setUpdatedAt(LocalDateTime.now());

            // Lưu tài khoản người dùng
            TaiKhoanNguoiDung savedTKND = taiKhoanNguoiDungInterface.save(tknd);

            // Tạo và gán giá trị cho ThongTinTaiKhoan
            ThongTinTaiKhoan thongTin = new ThongTinTaiKhoan();
            thongTin.setHoTen(staffDTO.getHoTen());
            thongTin.setDiaChi(staffDTO.getDiaChi());
            thongTin.setSoCCCD(staffDTO.getSoCCCD());
            thongTin.setSoDienThoai(staffDTO.getSoDienThoai());
            thongTin.setEmail(savedTKND.getEmail());
            thongTin.setTaiKhoanNguoiDung(savedTKND);
            thongTin.setTrangThai(1);

            // Lưu thông tin chi tiết tài khoản
            thongTinTaiKhoaninterface.save(thongTin);

            return true;
        } catch (Exception e) {
            System.err.println("Lỗi khi thêm tài khoản nhân viên: " + e.getMessage());
            return false;
        }
    }

    public boolean isEmailExists(String email) {
        return taiKhoanNguoiDungInterface.existsByEmail(email);
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

    public boolean isUsernameExists(String username) {
        return taiKhoanNguoiDungInterface.existsByUsername(username);
    }


}
