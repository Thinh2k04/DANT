package com.example.aino_1.serviceInter;

import com.example.aino_1.entity.OLuuTru;

import java.util.List;

public interface OLuuTruServiceInter {
    List<OLuuTru> read();

    OLuuTru create(OLuuTru oLuuTru);

    OLuuTru update(OLuuTru oLuuTru);

    void delete(Integer maSo);
}
