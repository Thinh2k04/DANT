package com.example.aino_1.serviceInter;

import com.example.aino_1.entity.TaiKhoanNguoiDung;

import java.util.List;

public interface TaiKhoanNguoiDungServiceInter {
    List<TaiKhoanNguoiDung> read();

    TaiKhoanNguoiDung create(TaiKhoanNguoiDung taiKhoanNguoiDung);

    TaiKhoanNguoiDung update(TaiKhoanNguoiDung taiKhoanNguoiDung);

    void delete(Integer id);

    String verify(TaiKhoanNguoiDung tknd);
    String getRoleByUsername(String username);
}
