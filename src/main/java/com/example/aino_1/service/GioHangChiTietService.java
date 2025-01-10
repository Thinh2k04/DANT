package com.example.aino_1.service;


import com.example.aino_1.entity.GioHangChiTiet;
import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.entity.TaiKhoanNguoiDung;
import com.example.aino_1.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GioHangChiTietService {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    ImeiInterface imeiInterface;

    @Autowired
    GioHangChiTietInterface gioHangChiTietInterface;

    @Autowired
    SanPhamChiTietInterface sanPhamChiTietInterface;
    @Autowired
    private TaiKhoanNguoiDungInterface taiKhoanNguoiDungInterface;

    // hàm xử lí cho api /check
    public Map<String, Object> checkGioHang(String token, List<SanPhamChiTiet> listSPCT) {
        String username = null;

        // Kiểm tra token và lấy username
        if (token != null && !token.isEmpty()) {
            Map<String, Object> decodedToken = jwtUtils.validateToken(token.replace("Bearer ", ""));
            if (decodedToken == null || !decodedToken.containsKey("username")) {
                return Map.of(
                        "success", false,
                        "message", "Token không hợp lệ hoặc đã hết hạn."
                );
            }
            username = decodedToken.get("username").toString();
        }

        // Trường hợp user đăng nhập
        if (username != null) {
            // Lấy danh sách giỏ hàng chi tiết từ username
            List<GioHangChiTiet> gioHangChiTietList = gioHangChiTietInterface.findGioHangChiTietByTaiKhoanNguoiDungUsername(username);

            if (gioHangChiTietList.isEmpty()) {
                return Map.of(
                        "success", false,
                        "message", "Giỏ hàng chưa có sản phẩm nào."
                );
            }

            for (GioHangChiTiet gioHangChiTiet : gioHangChiTietList) {
                SanPhamChiTiet spct = gioHangChiTiet.getSanPhamChiTiet();
                Integer soLuongSanPham = gioHangChiTiet.getSoLuong();
                Integer soLuongImei = imeiInterface.findBySpct(spct).size();

                if (soLuongSanPham > soLuongImei) {
                    return Map.of(
                            "success", false,
                            "message", String.format(
                                    "Sản phẩm %s không đủ số lượng IMEI (cần %d, có %d).",
                                    spct.getId(), soLuongSanPham, soLuongImei
                            )
                    );
                }
            }

            return Map.of(
                    "success", true,
                    "message", "Tất cả sản phẩm trong giỏ hàng đủ số lượng."
            );
        } else {
            // Trường hợp user không đăng nhập
            if (listSPCT == null || listSPCT.isEmpty()) {
                return Map.of(
                        "success", false,
                        "message", "Danh sách sản phẩm không hợp lệ hoặc trống."
                );
            }

            for (SanPhamChiTiet spct : listSPCT) {
                Integer soLuongSanPham = spct.getSoLuong(); // Lấy số lượng từ đối tượng sản phẩm
                Integer soLuongImei = imeiInterface.findBySpct(spct).size();

                if (soLuongSanPham > soLuongImei) {
                    return Map.of(
                            "success", false,
                            "message", String.format(
                                    "Sản phẩm %s không đủ số lượng IMEI (cần %d, có %d).",
                                    spct.getId(), soLuongSanPham, soLuongImei
                            )
                    );
                }
            }

            return Map.of(
                    "success", true,
                    "message", "Tất cả sản phẩm đủ số lượng."
            );
        }
    }




    @Transactional
    public Map<String, Object> updateProductQuantityInCart(String token, Integer productId, Integer quantityChange) {
        String username = null;

        // Lấy số lượng tồn kho
        int soLuongImeiSPCT = imeiInterface.findAllBySpctIdAndTrangThai(productId, 0).size();
        System.out.println("Số lượng imei còn lại của sản phẩm: " + soLuongImeiSPCT);

        // Kiểm tra token và lấy username nếu có
        if (token != null && !token.isEmpty()) {
            Map<String, Object> decodedToken = jwtUtils.validateToken(token.replace("Bearer ", ""));
            if (decodedToken == null || !decodedToken.containsKey("username")) {
                return Map.of(
                        "success", false,
                        "productId", productId,
                        "soLuongTonKho", soLuongImeiSPCT,
                        "message", "Token không hợp lệ hoặc đã hết hạn."
                );
            }
            username = decodedToken.get("username").toString();
        }
        System.out.println("GHCT Service: Lấy ra username: " + username);

        if (username != null) {
            GioHangChiTiet existingItem = gioHangChiTietInterface.findGioHangChiTietByTaiKhoanNguoiDungUsernameAndSanPhamChiTiet_Id(username, productId);

            if (existingItem == null) {
                // Thêm sản phẩm mới vào giỏ hàng
                SanPhamChiTiet spct = sanPhamChiTietInterface.findById(productId)
                        .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại."));
                if (soLuongImeiSPCT == 0) {
                    return Map.of(
                            "success", false,
                            "productId", productId,
                            "soLuongTonKho", soLuongImeiSPCT,
                            "message", "Sản phẩm đã hết hàng trong kho."
                    );
                }
                GioHangChiTiet newItem = new GioHangChiTiet();
                TaiKhoanNguoiDung tknd = taiKhoanNguoiDungInterface.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại."));
                newItem.setTaiKhoanNguoiDung(tknd);
                newItem.setSanPhamChiTiet(spct);
                newItem.setSoLuong(quantityChange);
                gioHangChiTietInterface.save(newItem);

                return Map.of(
                        "success", true,
                        "productId", productId,
                        "soLuongTonKho", soLuongImeiSPCT,
                        "message", "Sản phẩm đã được thêm vào giỏ hàng thành công."
                );
            } else {
                // Cập nhật số lượng sản phẩm
                int newQuantity = quantityChange;
                if (newQuantity <= 0) {
                    gioHangChiTietInterface.delete(existingItem);
                    return Map.of(
                            "success", true,
                            "productId", productId,
                            "soLuongTonKho", soLuongImeiSPCT,
                            "message", "Sản phẩm đã bị xóa khỏi giỏ hàng."
                    );
                } else if (newQuantity <= soLuongImeiSPCT) {
                    existingItem.setSoLuong(newQuantity);
                    gioHangChiTietInterface.save(existingItem);
                    return Map.of(
                            "success", true,
                            "productId", productId,
                            "soLuongTonKho", soLuongImeiSPCT,
                            "message", "Cập nhật số lượng sản phẩm trong giỏ hàng thành công."
                    );
                } else {
                    return Map.of(
                            "success", false,
                            "productId", productId,
                            "soLuongTonKho", soLuongImeiSPCT,
                            "message", "Số lượng trong kho không đủ để cập nhật."
                    );
                }
            }
        } else {
            // Không có người dùng đăng nhập
            if (quantityChange > soLuongImeiSPCT) {
                return Map.of(
                        "success", false,
                        "productId", productId,
                        "soLuongTonKho", soLuongImeiSPCT,
                        "message", "Sản phẩm không đủ số lượng trong kho."
                );
            }
            return Map.of(
                    "success", true,
                    "productId", productId,
                    "soLuongTonKho", soLuongImeiSPCT,
                    "message", "Sản phẩm còn đủ hàng trong kho."
            );
        }
    }



    public List<Map<String, Object>> checkSPSoLuong(List<SanPhamChiTiet> listSPCT) {
        List<Map<String, Object>> resultList = new ArrayList<>();

        for (SanPhamChiTiet spct : listSPCT) {
            // Lấy danh sách các IMEI có trạng thái = 0
            long soLuongImei = imeiInterface.findBySpct(spct).stream()
                    .filter(imei -> imei.getTrangThai() == 0) // Lọc các IMEI có trang_thai = 0
                    .count(); // Đếm số lượng

            Integer soLuongSP = spct.getSoLuong(); // Số lượng sản phẩm hiện có
            boolean isSufficient = soLuongSP <= soLuongImei; // Kiểm tra số lượng có đủ hay không

            // Tạo một bản ghi thông tin
            Map<String, Object> record = new HashMap<>();
            record.put("idSpct", spct.getId());
            record.put("soLuong", soLuongImei);
            record.put("message", isSufficient);

            // Thêm vào danh sách kết quả
            resultList.add(record);
        }

        return resultList; // Trả về danh sách thông tin
    }





}
