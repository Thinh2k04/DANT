package com.example.aino_1.serviceInter;

import com.example.aino_1.entity.SanPham;

import java.util.List;

public interface SanPhamServiceInter {
    List<SanPham> read();

    SanPham create(SanPham sanPham);

    SanPham update(SanPham sanPham);

    void delete(Integer id);
}
