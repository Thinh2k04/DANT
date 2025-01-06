package com.example.aino_1.service;

import com.example.aino_1.entity.GioHangChiTiet;
import com.example.aino_1.entity.Imei;
import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.repository.GioHangChiTietInterface;
import com.example.aino_1.repository.GioHangInterface;
import com.example.aino_1.repository.ImeiInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GioHangService {

    @Autowired
    GioHangInterface gioHangInterface;

    @Autowired
    ImeiInterface imeiInterface;

    @Autowired
    GioHangChiTietInterface gioHangChiTietInterface;

    public Map<String, Object> checkGioHang(Integer idGioHang) {
        // Kiểm tra xem giỏ hàng có tồn tại không
        if (!gioHangInterface.existsById(idGioHang)) {
            return Map.of(
                    "success", false,
                    "message", "Giỏ hàng không tồn tại."
            );
        }

        // Kiểm tra xem giỏ hàng có giỏ hàng chi tiết nào không
        boolean isEmpty = !gioHangChiTietInterface.existsByGioHangId(idGioHang);
        if (isEmpty) {
            return Map.of(
                    "success", false,
                    "message", "Giỏ hàng chưa có sản phẩm nào."
            );
        }

        // Lấy danh sách giỏ hàng chi tiết theo id giỏ hàng
        List<GioHangChiTiet> gioHangChiTietList = gioHangChiTietInterface.findByGioHangId(idGioHang);

        // Kiểm tra số lượng sản phẩm và IMEI
        for (GioHangChiTiet gioHangChiTiet : gioHangChiTietList) {
            SanPhamChiTiet spct = gioHangChiTiet.getSanPhamChiTiet();
            Integer soLuongSanPham = spct.getSoLuong();
            Integer soLuongImei = imeiInterface.findBySpct(spct).size();
            Integer soLuongThieu = soLuongSanPham - soLuongImei;

            if (soLuongThieu < 0) {
                return Map.of(
                        "success", false,
                        "message", "IMEI của sản phẩm vượt quá số lượng cho phép."
                );
            }
        }

        // Nếu mọi kiểm tra đều hợp lệ
        return Map.of(
                "success", true,
                "message", "Giỏ hàng hợp lệ. Số lượng IMEI phù hợp với sản phẩm."
        );
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
