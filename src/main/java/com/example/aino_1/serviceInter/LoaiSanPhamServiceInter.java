package com.example.aino_1.serviceInter;

import com.example.aino_1.entity.LoaiSanPham;

import java.util.List;

public interface LoaiSanPhamServiceInter {
    List<LoaiSanPham> read();

    LoaiSanPham create(LoaiSanPham loaiSanPham);

    LoaiSanPham update(LoaiSanPham loaiSanPham);

    void delete(String maLoai);
}
