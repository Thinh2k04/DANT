package com.example.aino_1.service;

import com.example.aino_1.entity.HinhAnh;
import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.repository.HinhAnhInterface;
import com.example.aino_1.repository.SanPhamChiTietInterface;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SanPhamChiTietService {

    @Autowired
    SanPhamChiTietInterface spctsi;

    @Autowired
    HinhAnhInterface hasi;

    public void saveSanPhamChiTietWithImage(SanPhamChiTiet spct, List<String> urlImg) {
//        // Bước 1: Lưu sản phẩm mà không có ảnh
//        SanPham sanPham = new SanPham();
//        sanPham.setTenSanPham(sp.getTenSanPham());
//        sanPham.setNamSanXuat(sp.getNamSanXuat());
//        sanPham.setTrongLuong(sp.getTrongLuong());
//        sanPham.setGioiThieu(sp.getGioiThieu());
//        sanPham.setThoiHanBaoHanh(sp.getThoiHanBaoHanh());
//        sanPham.setPin(sp.getPin());
//        sanPham.setTrangThai(sp.getTrangThai());
//
//        // Thiết lập loại sản phẩm
//        LoaiSanPham loaiSanPham = loaiSanPhamInterface.findById(sp.getLoaiSanPham().getId()).get();
//        sanPham.setLoaiSanPham(loaiSanPham);
//        // Thiết lập nguồn nhập
//        NguonNhap nguonNhap = nguonNhapInterface.findById(sp.getNguonNhap().getId()).get();
//        sanPham.setNguonNhap(nguonNhap);
//        // Thiết lập nguồn nhập
//        ChatLieu chatLieu = chatLieuInterface.findById(sp.getChatLieu().getId()).get();
//        sanPham.setChatLieu(chatLieu);
//        // Thiết lập nguồn nhập
//        KichThuocLapTop kichThuocLapTop = kichThuocLaptopInterface.findById(sp.getChatLieu().getId()).get();
//        sanPham.setKichThuocLaptop(kichThuocLapTop);



        SanPhamChiTiet savedSanPhamCT = spctsi.save(spct);

        if (urlImg != null ){
            for (String url : urlImg
            ) {
                // Bước 2: Lưu ảnh với ID sản phẩm
                HinhAnh hinhAnh = new HinhAnh();
                hinhAnh.setDuongDanHinhAnh(url); // Hàm uploadFile để lưu file và trả về đường dẫn
                hinhAnh.setSanPhamChiTiet(savedSanPhamCT); // Gán sản phẩm vào hình ảnh

                // Lưu thông tin ảnh vào cơ sở dữ liệu
                hasi.save(hinhAnh);
            }
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

}
