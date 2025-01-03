package com.example.aino_1.service;

import com.example.aino_1.entity.Imei;
import com.example.aino_1.entity.SanPham;
import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.entity.ThongTinTaiKhoan;
import com.example.aino_1.repository.ImeiInterface;
import com.example.aino_1.repository.SanPhamChiTietInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ImeiService {

    @Autowired
    SanPhamChiTietInterface spctif;

    @Autowired
    ImeiInterface imif;

    public String addOrUpdateImei(Integer idSPCT, List<Imei> listImei) {
        // Tìm sản phẩm chi tiết dựa trên ID
        SanPhamChiTiet spct = spctif.findById(idSPCT)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm chi tiết với ID: " + idSPCT));

        // Danh sách chứa các IMEI đã tồn tại
        List<String> existingImeiList = new ArrayList<>();

        // Kiểm tra trùng lặp IMEI trong cơ sở dữ liệu
        for (Imei im : listImei) {
            // Kiểm tra nếu IMEI đã tồn tại trong DB
            Optional<Imei> existingImei = imif.findByImei(im.getImei());
            if (existingImei.isPresent()) {
                // Nếu IMEI đã tồn tại, thêm vào danh sách các IMEI trùng
                existingImeiList.add(im.getImei());
                // Dừng lại và trả về thông báo nếu có IMEI trùng
                return "IMEI đã tồn tại: " + String.join(", ", existingImeiList) + ". Thêm không thành công!";
            }

            // Nếu IMEI chưa tồn tại, kiểm tra và cập nhật nếu có ID
            if (im.getId() != null) {
                Optional<Imei> existingImeiById = imif.findById(im.getId());
                if (existingImeiById.isPresent()) {
                    // Cập nhật IMEI nếu đã tồn tại
                    Imei imeiToUpdate = existingImeiById.get();
                    imeiToUpdate.setImei(im.getImei());
                    imeiToUpdate.setIdHDCT(im.getIdHDCT());
                    imeiToUpdate.setTrangThai(im.getTrangThai());
                    imeiToUpdate.setSpct(spct);
                    imif.save(imeiToUpdate);
                    continue;
                }
            }

            // Thêm mới IMEI nếu không có ID hoặc không tồn tại trong DB
            im.setSpct(spct);
            imif.save(im);
        }

        return "Thêm hoặc cập nhật IMEI thành công!";
    }


}
