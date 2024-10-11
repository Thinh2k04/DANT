package com.example.aino_1.serviceInter;

import com.example.aino_1.entity.GioHang;

import java.util.List;

public interface GioHangServiceInter {
    List<GioHang> read();

    GioHang create(GioHang gioHang);

    GioHang update(GioHang gioHang);

    void delete(Integer id);
}
