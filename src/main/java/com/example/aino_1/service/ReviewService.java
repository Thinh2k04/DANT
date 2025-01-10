package com.example.aino_1.service;

import com.example.aino_1.entity.HoaDonChiTiet;
import com.example.aino_1.entity.Review;
import com.example.aino_1.entity.TaiKhoanNguoiDung;
import com.example.aino_1.repository.HDCTInterFace;
import com.example.aino_1.repository.HoaDonInterface;
import com.example.aino_1.repository.ReviewInterface;
import com.example.aino_1.repository.TaiKhoanNguoiDungInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class ReviewService {
    @Autowired
    private ReviewInterface reviewRepository;

    @Autowired
    private HDCTInterFace hoaDonChiTietRepository;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    TaiKhoanNguoiDungInterface taiKhoanNguoiDungRepository;

    public String addReview(String token, Map<String, Object> requestData) {
        // Giải mã token để lấy username
        String username = jwtUtils.validateToken(token.replace("Bearer ", ""))
                .get("username").toString();

        if (username == null || username.isEmpty()) {
            throw new RuntimeException("Token không hợp lệ hoặc username không tồn tại.");
        }
        System.out.println("ReviewService: username: " + username);

        // Lấy thông tin tài khoản người dùng dựa vào username
        TaiKhoanNguoiDung taiKhoanNguoiDung = taiKhoanNguoiDungRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản người dùng với username: " + username));

        Integer hoaDonChiTietId = Integer.valueOf(requestData.get("hoaDonChiTietId").toString());
        Integer rating = Integer.valueOf(requestData.get("rating").toString());
        String comment = requestData.get("comment").toString();

        // Lấy Hóa đơn chi tiết
        HoaDonChiTiet hoaDonChiTiet = hoaDonChiTietRepository.findById(hoaDonChiTietId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn chi tiết."));

        System.out.println("Revice Service: hoaDonChiTiet: " + hoaDonChiTiet);

        // Kiểm tra nếu tài khoản không khớp
        TaiKhoanNguoiDung ownerTaiKhoanNguoiDung = hoaDonChiTiet.getHoaDon()
                .getThongTinTaiKhoan()
                .getTaiKhoanNguoiDung();

        if (!ownerTaiKhoanNguoiDung.getId().equals(taiKhoanNguoiDung.getId())) {
            throw new RuntimeException("Bạn không có quyền đánh giá sản phẩm này.");
        }

        // Kiểm tra nếu đã có đánh giá cho hóa đơn chi tiết này
        boolean hasReview = reviewRepository.existsByHoaDonChiTiet_Id(hoaDonChiTietId);
        if (hasReview) {
            throw new IllegalArgumentException("Sản phẩm này đã được đánh giá.");
        }

        // Tạo đánh giá mới
        Review review = new Review();
        review.setTaiKhoanNguoiDung(taiKhoanNguoiDung);
        review.setHoaDonChiTiet(hoaDonChiTiet);
        review.setRating(rating);
        review.setComment(comment);
        review.setReviewDate(LocalDateTime.now());

        reviewRepository.save(review);
        return "Đánh giá đã được thêm thành công.";
    }

}
