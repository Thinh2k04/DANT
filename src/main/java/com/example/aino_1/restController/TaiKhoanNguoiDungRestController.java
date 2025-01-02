package com.example.aino_1.restController;

import com.example.aino_1.config.JwtUtils;
import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.TaiKhoanNguoiDung;

import com.example.aino_1.repository.TaiKhoanNguoiDungInterface;
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

    private final BCryptPasswordEncoder passwordEncoder;

    public TaiKhoanNguoiDungRestController(TaiKhoanNguoiDungInterface taiKhoanInterface) {
        this.taiKhoanInterface = taiKhoanInterface;
        this.passwordEncoder = new BCryptPasswordEncoder(12);
    }

    @GetMapping("/getAll")
    public List<TaiKhoanNguoiDung> getAll(@PathVariable String id) {
        return taiKhoanInterface.findByChucVu(id); //
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody TaiKhoanNguoiDung user) {
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Mã hóa mật khẩu
        taiKhoanInterface.save(user); // Lưu vào repository
        return ResponseEntity.ok("User registered successfully");
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


}

