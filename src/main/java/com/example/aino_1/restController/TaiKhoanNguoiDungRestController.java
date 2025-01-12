package com.example.aino_1.restController;

import com.example.aino_1.service.JwtUtils;
import com.example.aino_1.entity.*;

import com.example.aino_1.repository.TaiKhoanNguoiDungInterface;
import com.example.aino_1.service.TaiKhoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/tai_khoan")
public class TaiKhoanNguoiDungRestController {

    @Autowired
    private TaiKhoanNguoiDungInterface taiKhoanInterface; // Thống nhất tên interface
    @Autowired
    TaiKhoanService tkndsv;

    private final BCryptPasswordEncoder passwordEncoder;



    public TaiKhoanNguoiDungRestController(TaiKhoanNguoiDungInterface taiKhoanInterface) {
        this.taiKhoanInterface = taiKhoanInterface;
        this.passwordEncoder = new BCryptPasswordEncoder(12);
    }

    @GetMapping("/getAllNhanVien")
    public ResponseEntity<?> getAll() {
        List<Map<String, String>> danhSachThongTin = tkndsv.getTaiKhoan();
        return ResponseEntity.ok(danhSachThongTin);
    }


    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody TaiKhoanNguoiDung taiKhoanNguoiDung) {
        try {

            // Mã hóa mật khẩu
            taiKhoanNguoiDung.setPassword(passwordEncoder.encode(taiKhoanNguoiDung.getPassword()));

            // Gọi service để thêm tài khoản
            boolean result = tkndsv.addTaiKhoan(taiKhoanNguoiDung);

            if (result) {
                return ResponseEntity.ok("Thêm tài khoản thành công");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Thêm tài khoản thất bại");
            }
        } catch (IllegalArgumentException e) {
            // Lỗi khi chuyển đổi JSON
            return ResponseEntity.badRequest().body("Dữ liệu không hợp lệ: " + e.getMessage());
        } catch (Exception e) {
            // Các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody TaiKhoanNguoiDung user) {
        Map<String, String> response = new HashMap<>();

        // Tìm người dùng trong cơ sở dữ liệu
        TaiKhoanNguoiDung existingUser = taiKhoanInterface.findByUsername(user.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Giả sử role của người dùng được lưu trong trường "role"
        String role = existingUser.getChucVu();  // Lấy role từ đối tượng người dùng

        // Tạo JWT token với cả username và role
        String token = JwtUtils.generateToken(existingUser.getUsername(), role);


        // Đưa token vào phản hồi
        response.put("role",role);
        response.put("message", "Đăng nhập thành công");
        response.put("token", token);

        // Trả về phản hồi
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getByID/{id}")
    public TaiKhoanNguoiDung getAll(@PathVariable Integer id) {
        return taiKhoanInterface.findById(id).get();
    }


    @PostMapping("/forgatePass")
    public ResponseEntity<String> handleForgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        String username = request.get("username");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email không được để trống.");
        }

        boolean isSuccess = tkndsv.handleForgotPassword(email,username);

        if (isSuccess) {
            return ResponseEntity.ok("Đã gửi mật khẩu tạm thời qua email. Vui lòng kiểm tra hộp thư.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email không tồn tại trong hệ thống.");
        }
    }


}

