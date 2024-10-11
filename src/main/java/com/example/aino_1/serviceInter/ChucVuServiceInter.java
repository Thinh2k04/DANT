package com.example.aino_1.serviceInter;

import com.example.aino_1.entity.ChucVu;

import java.util.List;

public interface ChucVuServiceInter {
    List<ChucVu> read();

    ChucVu create(ChucVu chucVu);

    ChucVu update(ChucVu chucVu);

    void delete(String maChucVu);
}
