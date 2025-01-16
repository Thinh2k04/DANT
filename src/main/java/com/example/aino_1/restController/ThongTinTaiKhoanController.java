package com.example.aino_1.restController;

import com.example.aino_1.dto.TTTKDTO;
import com.example.aino_1.entity.TaiKhoanNguoiDung;
import com.example.aino_1.entity.ThongTinTaiKhoan;
import com.example.aino_1.repository.TaiKhoanNguoiDungInterface;
import com.example.aino_1.repository.ThongTinTaiKhoaninterface;
import com.example.aino_1.service.TaiKhoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/tttk") //đường dẫn chung cho các phương thức http bên dưới
public class ThongTinTaiKhoanController {
    @Autowired
    ThongTinTaiKhoaninterface tttksi;

    @Autowired
    TaiKhoanNguoiDungInterface taiKhoanNguoiDungInterface;

    @Autowired
    TaiKhoanService taiKhoanService;

    @GetMapping("/getAll")
    public List<ThongTinTaiKhoan> getAllSanPhamChiTietDto() {
        return tttksi.findAll();
    }

    @GetMapping("/getById/{id}")
    public ThongTinTaiKhoan getById(@PathVariable Integer id) {
        return tttksi.findById(id).get();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateThongTinNguoiDung(
            @PathVariable Integer id,
            @RequestBody ThongTinTaiKhoan updatedThongTin,
            @RequestHeader("username") String username) {

        // Lấy thông tin tài khoản đang đăng nhập
        Optional<ThongTinTaiKhoan> loggedInUserOpt = tttksi.findThongTinTaiKhoanByTaiKhoanNguoiDungUsername(username);
        if (loggedInUserOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Người dùng không hợp lệ.");
        }

        TaiKhoanNguoiDung loggedInUser = loggedInUserOpt.get().getTaiKhoanNguoiDung();

        // Lấy thông tin tài khoản cần sửa
        Optional<ThongTinTaiKhoan> thongTinOpt = tttksi.findById(id);
        if (thongTinOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Thông tin tài khoản không tồn tại.");
        }

        ThongTinTaiKhoan thongTin = thongTinOpt.get();
        TaiKhoanNguoiDung targetUser = thongTin.getTaiKhoanNguoiDung();

        // Kiểm tra quyền:
        if (loggedInUser.getChucVu().equalsIgnoreCase("User")) {
            // User chỉ được sửa thông tin của chính mình
            if (!loggedInUser.getId().equals(targetUser.getId())) {
                return ResponseEntity.status(403).body("Bạn không có quyền sửa thông tin của người khác.");
            }
        } else if (loggedInUser.getChucVu().equalsIgnoreCase("Admin")) {
            // Admin có thể sửa thông tin của bất kỳ ai, bao gồm cả Staff
        } else {
            // Các vai trò khác (ví dụ: Staff) không được phép sửa thông tin của Staff
            if (targetUser.getChucVu().equalsIgnoreCase("Staff")) {
                return ResponseEntity.status(403).body("Chỉ Admin mới được sửa thông tin của Staff.");
            }
        }

        // Cập nhật thông tin
        thongTin.setHoTen(updatedThongTin.getHoTen());
        thongTin.setDiaChi(updatedThongTin.getDiaChi());
        thongTin.setSoCCCD(updatedThongTin.getSoCCCD());
        thongTin.setSoDienThoai(updatedThongTin.getSoDienThoai());
        thongTin.setEmail(updatedThongTin.getEmail());
        thongTin.setTrangThai(updatedThongTin.getTrangThai());

        tttksi.save(thongTin);
        return ResponseEntity.ok("Thông tin tài khoản đã được cập nhật.");
    }

    @PostMapping("/add")
    public ThongTinTaiKhoan create(@RequestBody ThongTinTaiKhoan tk) {
        return tttksi.save(tk);
    }

    @GetMapping("/timSDT/{SDT}")
    public TTTKDTO timTTTKBySDT(@PathVariable String SDT) {
        return tttksi.timTTTKBySDT(SDT);
    }

    @PostMapping("/del/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        Optional<ThongTinTaiKhoan> optionalThongTinTaiKhoan = tttksi.findById(id);
        Optional<TaiKhoanNguoiDung> optionalTaiKhoanNguoiDung = taiKhoanNguoiDungInterface.findById(optionalThongTinTaiKhoan.get().getId());

        if (!optionalThongTinTaiKhoan.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Thông tin với id: " + id + " không tìm thấy");
        }
        if (!optionalTaiKhoanNguoiDung.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tài khoản với id: " + id + " không tìm thấy");
        }


        ThongTinTaiKhoan thongTinTaiKhoan = optionalThongTinTaiKhoan.get();
        thongTinTaiKhoan.setTrangThai(0);
        ThongTinTaiKhoan saved = tttksi.save(thongTinTaiKhoan);

        TaiKhoanNguoiDung taiKhoanNguoiDung = optionalTaiKhoanNguoiDung.get();
        taiKhoanNguoiDung.setEnabled(0);
        taiKhoanNguoiDungInterface.save(taiKhoanNguoiDung);

        return ResponseEntity.ok(saved);
    }
}
