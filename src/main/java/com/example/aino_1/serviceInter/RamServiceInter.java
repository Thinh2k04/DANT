package com.example.aino_1.serviceInter;

import com.example.aino_1.entity.Ram;

import java.util.List;

public interface RamServiceInter {
    List<Ram> read();

    Ram create(Ram ram);

    Ram update(Ram ram);

    void delete(Integer maSo);
}
