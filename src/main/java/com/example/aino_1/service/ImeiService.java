package com.example.aino_1.service;

import com.example.aino_1.entity.*;
import com.example.aino_1.repository.HDCTInterFace;
import com.example.aino_1.repository.ImeiInterface;
import com.example.aino_1.repository.SanPhamChiTietInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ImeiService {

    @Autowired
    SanPhamChiTietInterface spctif;

    @Autowired
    ImeiInterface imif;

    @Autowired
    SanPhamChiTietInterface spctInterface;

    @Autowired
    HDCTInterFace hdctInterFace;



    // Hàm cập nhật hoạc thêm Imei
    public Map<String, Object> addOrUpdateImei(Integer idSPCT, List<Imei> listImei) {
        // Tìm sản phẩm chi tiết dựa trên ID
        SanPhamChiTiet spct = spctif.findById(idSPCT)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm chi tiết với ID: " + idSPCT));

        // Lấy số lượng sản phẩm chi tiết
        Integer soLuongSPCT = spct.getSoLuong(); // Lấy số lượng sản phẩm từ đối tượng spct.

        // Lấy danh sách IMEI hiện tại liên quan đến sản phẩm chi tiết
        List<Imei> existingImeis = imif.findBySpct(spct); // Phương thức tìm danh sách IMEI theo spct.

        // Kiểm tra số lượng IMEI đã tồn tại
        if (existingImeis.size() >= soLuongSPCT) {
            // Nếu số lượng IMEI >= số lượng sản phẩm, không cho phép thêm
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Số lượng IMEI đã đạt đến giới hạn của sản phẩm chi tiết.");
            return response;
        }

        // Danh sách chứa các IMEI không hợp lệ hoặc đã tồn tại
        List<String> invalidImeiList = new ArrayList<>();

        // Lọc và kiểm tra các IMEI hợp lệ
        List<Imei> validImeis = new ArrayList<>();
        for (Imei im : listImei) {
            if (im.getImei() == null || im.getImei().isEmpty()) {
                invalidImeiList.add("IMEI trống");
            } else if (imif.findByImei(im.getImei()).isPresent()) {
                invalidImeiList.add(im.getImei());
            } else {
                validImeis.add(im);
            }
        }
        // Nếu có IMEI không hợp lệ hoặc đã tồn tại, trả về thông báo lỗi
        if (!invalidImeiList.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "IMEI không hợp lệ hoặc đã tồn tại: " + String.join(", ", invalidImeiList));
            return response;
        }

        // Kiểm tra tổng số lượng sau khi thêm
        if (existingImeis.size() + validImeis.size() > soLuongSPCT) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Không thể thêm quá số lượng IMEI giới hạn của sản phẩm chi tiết.");
            return response;
        }
        // Thêm IMEI mới vào cơ sở dữ liệu
        for (Imei im : validImeis) {
            im.setSpct(spct);
            imif.save(im);
        }
        // Sét lại trạng thái cho sản phẩm chi tiết sau khi đự thêm imei nếu spct.Trạng thái = 2
        if(spct.getTrangThai() == 2){
            spct.setTrangThai(1);
            spctif.save(spct);
        }

        // Trả về thông báo thành công
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Thêm và cập nhật IMEI thành công.");
        return response;
    }

    // hàm láy ra danh sách imei đang bán của 1 sản phẩm
    public List<Imei> getListImeibySPCT(Integer idSPCT){
         List<Imei> listispct = imif.findAllBySpctIdAndTrangThai(idSPCT,0);
         return listispct;
    }


    // Hàm trả v cho backend biết số lượng imei còn thiếu
    public Integer checkImeiIDSPCT(Integer idSPCT) {
        // Kiểm tra sản phẩm chi tiết (SPCT) có tồn tại hay không
        Optional<SanPhamChiTiet> optionalSPCT = spctInterface.findById(idSPCT);
        if (!optionalSPCT.isPresent()) {
            // Trả về -1 nếu idSPCT không tồn tại
            return -1;
        }

        // Lấy số lượng sản phẩm từ SPCT
        Integer soLuongSPCT = optionalSPCT.get().getSoLuong(); // Giả sử `getSoLuong()` là phương thức lấy số lượng sản phẩm.

        // Lấy danh sách IMEI và lọc danh sách liên quan đến sản phẩm cụ thể
        List<Imei> listImei = imif.findAll();
        long soLuongImeiSPCT = listImei.stream()
                .filter(imei -> imei.getSpct().getId().equals(idSPCT))
                .count();

        // Trả về số lượng sản phẩm còn thiếu IMEI
        return soLuongSPCT - (int) soLuongImeiSPCT;
    }



    // hàm sét imei vào hóa đơn chi tiét
    public String updateImeiToHDCT(List<Imei> imeiList, HoaDonChiTiet hoaDonChiTiet) {

        // cập nhật lại trạng thái của imei
        for (Imei imei : imeiList) {
            imei.setHdct(hoaDonChiTiet);
            imei.setTrangThai(1); // 1 là trạng thái đã sử dụng
        }

        // Lưu lại danh sách IMEI đã cập nhật
        imif.saveAll(imeiList);

        return "Cập nhật trạng thái thành công cho " + imeiList + " IMEI.";
    }

    public boolean checkTinhTrang(Integer idSPCT) {
        List<Imei> listImei = imif.findAllBySpctIdAndTrangThai(idSPCT, 0);
        return listImei == null || listImei.isEmpty();
    }

}
