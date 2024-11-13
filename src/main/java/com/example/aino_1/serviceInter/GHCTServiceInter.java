package com.example.aino_1.serviceInter;

import com.example.aino_1.entity.GioHangChiTiet;

import java.util.List;

public interface GHCTServiceInter {
    List<GioHangChiTiet> read();

    GioHangChiTiet create(GioHangChiTiet ghct);

    GioHangChiTiet update(GioHangChiTiet ghct);

    void delete(Integer id);
}
