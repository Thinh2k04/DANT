package com.example.aino_1.serviceInter;

import com.example.aino_1.entity.ManHinh;

import java.util.List;

public interface ManHinhServiceInter {
    List<ManHinh> read();

    ManHinh create(ManHinh manHinh);

    ManHinh update(ManHinh manHinh);

    void delete(Integer maSo);
}
