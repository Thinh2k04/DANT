package com.example.aino_1.serviceInter;

import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.entity.SanPhamChiTiet;

import java.util.List;

public interface SanPhamChiTietServiceInter {
    List<SanPhamChiTiet> read();

    SanPhamChiTiet create(SanPhamChiTiet spct);

    SanPhamChiTiet update(SanPhamChiTiet spct);

    void delete(Integer id);
    SanPhamChiTiet detail(Integer id);
    List<SanPhamChiTietDto> sreach(String tuKhoaTimKiem);
    List<SanPhamChiTietDto> locTheoGia(Double minPrice, Double maxPrice);
    List<SanPhamChiTietDto> locTheoDungLuongRam(Integer dungLuongRam);
    List<SanPhamChiTietDto> locTheoHangSanXuat(String hangSanXuat);
    List<SanPhamChiTietDto> locTheoTamNen(String tamNen);
    List<SanPhamChiTietDto> locTheoCongNgheCPU(String congNgheCPU);
    List<SanPhamChiTietDto> locTheoKichThuoc(Double kichThuoc);
}
