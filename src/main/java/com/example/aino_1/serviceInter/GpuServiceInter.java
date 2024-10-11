package com.example.aino_1.serviceInter;

import com.example.aino_1.entity.Gpu;

import java.util.List;

public interface GpuServiceInter {
    List<Gpu> read();

    Gpu create(Gpu gpu);

    Gpu update(Gpu gpu);

    void delete(Integer maSo);
}
