package com.example.aino_1.serviceImpl;

import com.example.aino_1.entity.OLuuTru;
import com.example.aino_1.repository.OLuuTruInterface;
import com.example.aino_1.serviceInter.OLuuTruServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
//dựa trên cách quản lý bean của spring thì service phải đặt annotation ở tầng implements
@Service
public class OLuuTruServiceImpl implements OLuuTruServiceInter {
    @Autowired
    OLuuTruInterface olti;

    @Override
    public List<OLuuTru> read() {
        return olti.findAll();
    }

    @Override
    public OLuuTru create(OLuuTru oLuuTru) {
        return olti.save(oLuuTru);
    }

    @Override
    public OLuuTru update(OLuuTru oLuuTru) {
        return olti.save(oLuuTru);
    }

    @Override
    public void delete(Integer maSo) {
        olti.deleteById(maSo);
    }
}
