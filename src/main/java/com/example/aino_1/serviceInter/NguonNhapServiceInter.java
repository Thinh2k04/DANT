package com.example.aino_1.serviceInter;

import com.example.aino_1.entity.NguonNhap;

import java.util.List;

public interface NguonNhapServiceInter {
    List<NguonNhap> read();

    NguonNhap create(NguonNhap nguonNhap);

    NguonNhap update(NguonNhap nguonNhap);

    void delete(String maNhaCungUng);
}
