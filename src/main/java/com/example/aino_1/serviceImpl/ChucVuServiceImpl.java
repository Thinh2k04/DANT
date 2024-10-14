package com.example.aino_1.serviceImpl;

import com.example.aino_1.entity.ChucVu;
import com.example.aino_1.repository.ChucVuInterface;
import com.example.aino_1.serviceInter.ChucVuServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
//dựa trên cách quản lý bean của spring thì service phải đặt annotation ở tầng implements
@Service
public class ChucVuServiceImpl implements ChucVuServiceInter {
    @Autowired
    ChucVuInterface cvi;

    @Override
    public List<ChucVu> read() {
        return cvi.findAll();
    }

    @Override
    public ChucVu create(ChucVu chucVu) {
        return cvi.save(chucVu);
    }

    @Override
    public ChucVu update(ChucVu chucVu) {
        return cvi.save(chucVu);
    }

    @Override
    public void delete(String maChucVu) {
        cvi.deleteById(maChucVu);
    }
}
