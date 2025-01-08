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

    public Map<String, Object> checkGioHang(String username) {
        // Lấy danh sách giỏ hàng chi tiết theo username
        List<GioHangChiTiet> gioHangChiTietList = gioHangChiTietInterface.findGioHangChiTietByTaiKhoanNguoiDungUsername(username);

        // Kiểm tra xem danh sách giỏ hàng chi tiết có rỗng không
        if (gioHangChiTietList.isEmpty()) {
            return Map.of(
                    "success", false,
                    "message", "Giỏ hàng chưa có sản phẩm nào."
            );
        }

        // Kiểm tra số lượng sản phẩm và số lượng IMEI
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
