package com.example.aino_1.serviceInter;

import com.example.aino_1.entity.HinhAnh;

import java.util.List;

public interface HinhAnhServiceInter {
    List<HinhAnh> read();

    HinhAnh create(HinhAnh hinhAnh);

    HinhAnh update(HinhAnh hinhAnh);

    void delete(Integer id);
}
