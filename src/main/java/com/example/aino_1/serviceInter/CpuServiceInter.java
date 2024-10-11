package com.example.aino_1.serviceInter;

import com.example.aino_1.entity.Cpu;

import java.util.List;

public interface CpuServiceInter {
    List<Cpu> read();

    Cpu create(Cpu cpu);

    Cpu update(Cpu cpu);

    void delete(Integer maSo);
}
