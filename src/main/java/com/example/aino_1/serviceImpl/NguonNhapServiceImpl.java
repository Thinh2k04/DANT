package com.example.aino_1.serviceImpl;

import com.example.aino_1.entity.NguonNhap;
import com.example.aino_1.repository.NguonNhapInterface;
import com.example.aino_1.serviceInter.NguonNhapServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
//dựa trên cách quản lý bean của spring thì service phải đặt annotation ở tầng implements
@Service
public class NguonNhapServiceImpl implements NguonNhapServiceInter {
    @Autowired
    NguonNhapInterface nni;

    @Override
    public List<NguonNhap> read() {
        return nni.findAll();
    }

    @Override
    public NguonNhap create(NguonNhap nguonNhap) {
        return nni.save(nguonNhap);
    }

    @Override
    public NguonNhap update(NguonNhap nguonNhap) {
        return nni.save(nguonNhap);
    }

    @Override
    public void delete(String maNhaCungUng) {
        nni.deleteById(maNhaCungUng);
    }
}
