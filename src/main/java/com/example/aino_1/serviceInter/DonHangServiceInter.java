package com.example.aino_1.serviceInter;

import com.example.aino_1.entity.DonHang;

import java.util.List;

public interface DonHangServiceInter {
    List<DonHang> read();

    DonHang create(DonHang donHang);

    DonHang update(DonHang donHang);

    void delete(Integer id);
}
