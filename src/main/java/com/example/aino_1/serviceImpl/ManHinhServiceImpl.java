package com.example.aino_1.serviceImpl;

import com.example.aino_1.entity.ManHinh;
import com.example.aino_1.repository.ManHinhInterface;
import com.example.aino_1.serviceInter.ManHinhServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
//dựa trên cách quản lý bean của spring thì service phải đặt annotation ở tầng implements
@Service
public class ManHinhServiceImpl implements ManHinhServiceInter {
    @Autowired
    ManHinhInterface mhi;

    @Override
    public List<ManHinh> read() {
        return mhi.findAll();
    }

    @Override
    public ManHinh create(ManHinh manHinh) {
        return mhi.save(manHinh);
    }

    @Override
    public ManHinh update(ManHinh manHinh) {
        return mhi.save(manHinh);
    }

    @Override
    public void delete(Integer maSo) {
        mhi.deleteById(maSo);
    }
}
