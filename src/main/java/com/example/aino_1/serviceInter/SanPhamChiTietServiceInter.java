package com.example.aino_1.serviceInter;

import com.example.aino_1.entity.SanPhamChiTiet;

import java.util.List;

public interface SanPhamChiTietServiceInter {
    List<SanPhamChiTiet> read();

    SanPhamChiTiet create(SanPhamChiTiet spct);

    SanPhamChiTiet update(SanPhamChiTiet spct);

    void delete(Integer id);
    SanPhamChiTiet detail(Integer id);
}
