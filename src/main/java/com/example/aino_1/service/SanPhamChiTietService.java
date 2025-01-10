package com.example.aino_1.service;

import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.entity.HinhAnh;
import com.example.aino_1.entity.Imei;
import com.example.aino_1.entity.SanPham;
import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.repository.HinhAnhInterface;
import com.example.aino_1.repository.ImeiInterface;
import com.example.aino_1.repository.SanPhamChiTietInterface;
import com.example.aino_1.repository.SanPhamInterface;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SanPhamChiTietService {

    @Autowired
    SanPhamInterface spsi;

    @Autowired
    SanPhamChiTietInterface spctsi;

    @Autowired
    ImeiInterface imsi;

    @Autowired
    HinhAnhInterface hasi;
    @Autowired
    private ImeiInterface imeiInterface;

    public Boolean saveSanPhamChiTietWithImage(SanPhamChiTiet spct, SanPham sp, List<String> urlImg) {
        try {
            // Kiểm tra sản phẩm và sản phẩm chi tiết
            if (spct == null || sp == null) {
                throw new IllegalArgumentException("Sản phẩm chi tiết hoặc sản phẩm không được để trống");
            }

            // Kiểm tra ID sản phẩm
            Integer idSanPham = sp.getId();
            if (idSanPham == null) {
                throw new IllegalArgumentException("ID sản phẩm không được để trống");
            }

            // Tìm sản phẩm trong cơ sở dữ liệu
            SanPham sanPham = spsi.findById(idSanPham)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + idSanPham));

            // Gán sản phẩm vào sản phẩm chi tiết và lưu
            spct.setSanPham(sanPham);
            SanPhamChiTiet savedSpct = spctsi.save(spct);

            // Lưu hình ảnh nếu danh sách URL hợp lệ
            if (urlImg != null && !urlImg.isEmpty()) {
                urlImg.stream()
                        .filter(url -> url != null && !url.isEmpty()) // Loại bỏ URL null hoặc rỗng
                        .forEach(url -> {
                            HinhAnh hinhAnh = new HinhAnh();
                            hinhAnh.setDuongDanHinhAnh(url);
                            hinhAnh.setSanPhamChiTiet(savedSpct);
                            hasi.save(hinhAnh);
                        });
            }

//            // Lưu hình ảnh nếu danh sách URL hợp lệ
//            if (listImei != null && !listImei.isEmpty()) {
//                listImei.stream()
//                        .filter(url -> url != null && !url.isEmpty()) // Loại bỏ URL null hoặc rỗng
//                        .forEach(url -> {
//                            Imei imei = new Imei();
//                            imei.setImei(url);
//                            imei.setSpct(savedSpct);
//                            imsi.save(imei);
//                        });
//            }

            return true;
        } catch (Exception e) {
            // Log lỗi
            System.err.println("Lỗi khi lưu sản phẩm chi tiết hoặc hình ảnh: " + e.getMessage());
            e.printStackTrace();
            return false;
        }

}
    @Transactional
    public void updateSanPhamChiTietWithImage(SanPhamChiTiet sp, List<String> urlImg) {
//        SanPham existingSanPham = sanPhamInterface.findById(sp.getId()).orElse(null);

//        if (existingSanPham != null) {
//            // Nếu sản phẩm tồn tại, cập nhật thông tin
//            existingSanPham.setTenSanPham(sp.getTenSanPham());
//            existingSanPham.setNamSanXuat(sp.getNamSanXuat());
//            existingSanPham.setTrongLuong(sp.getTrongLuong());
//            existingSanPham.setGioiThieu(sp.getGioiThieu());
//            existingSanPham.setThoiHanBaoHanh(sp.getThoiHanBaoHanh());
//            existingSanPham.setPin(sp.getPin());
//
//            // Cập nhật loại sản phẩm nếu có thay đổi
//            if (sp.getLoaiSanPham() != null) {
//                LoaiSanPham loaiSanPham = loaiSanPhamInterface.findById(sp.getLoaiSanPham().getId()).get();
//                existingSanPham.setLoaiSanPham(loaiSanPham);
//            }
//
//            // Cập nhật nguồn nhập nếu có thay đổi
//            if (sp.getNguonNhap() != null) {
//                NguonNhap nguonNhap = nguonNhapInterface.findById(sp.getNguonNhap().getId()).get();
//                existingSanPham.setNguonNhap(nguonNhap);
//            }
//
//            // Cập nhật chất liệu nếu có thay đổi
//            if (sp.getChatLieu() != null) {
//                ChatLieu chatLieu = chatLieuInterface.findById(sp.getChatLieu().getId()).get();
//                existingSanPham.setChatLieu(chatLieu);
//            }
//
//            // Cập nhật kích thước laptop nếu có thay đổi
//            if (sp.getKichThuocLaptop() != null) {
//                KichThuocLapTop kichThuocLapTop = kichThuocLaptopInterface.findById(sp.getKichThuocLaptop().getId()).get();
//                existingSanPham.setKichThuocLaptop(kichThuocLapTop);
//            }

        // Lưu thông tin sản phẩm đã cập nhật vào cơ sở dữ liệu
//            SanPham updatedSanPham = sanPhamInterface.save(existingSanPham);

        spctsi.save(sp);

        // Nếu có danh sách URL hình ảnh mới, cập nhật hình ảnh
        if (urlImg != null && !urlImg.isEmpty()) {
            // Xóa các ảnh cũ liên quan đến sản phẩm này (nếu cần thiết)
            hasi.deleteBySanPhamId(sp.getId());

            // Thêm các ảnh mới
            for (String url : urlImg) {
                HinhAnh hinhAnh = new HinhAnh();
                hinhAnh.setDuongDanHinhAnh(url);
                hinhAnh.setSanPhamChiTiet(sp);
                hasi.save(hinhAnh);
            }
        }

    }

    public List<SanPhamChiTietDto> getListForHome(){
        List<SanPhamChiTietDto> listSPCTDTO = spctsi.getAllDTO();
        List<SanPhamChiTietDto> listHome = new ArrayList<>()    ;
        for (SanPhamChiTietDto spctdto : listSPCTDTO
        ) {
            if(spctdto.getTrangThai() == 1){
                listHome.add(spctdto);
            }
        }
        return listHome;
    }

    public List<SanPhamChiTietDto> getListThungRac(){
        List<SanPhamChiTietDto> listSPCTDTO = spctsi.getAllDTO();
        List<SanPhamChiTietDto> listHome = new ArrayList<>()    ;
        for (SanPhamChiTietDto spctdto : listSPCTDTO
        ) {
            if(spctdto.getTrangThai() == 0){
                listHome.add(spctdto);
            }
        }
        return listHome;
    }

}
