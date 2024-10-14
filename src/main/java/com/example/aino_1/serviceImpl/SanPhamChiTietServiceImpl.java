package com.example.aino_1.serviceImpl;

import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.repository.SanPhamChiTietInterface;
import com.example.aino_1.serviceInter.SanPhamChiTietServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

//dựa trên cách quản lý bean của spring thì service phải đặt annotation ở tầng implements
@Service
public class SanPhamChiTietServiceImpl implements SanPhamChiTietServiceInter {
    @Autowired
    SanPhamChiTietInterface spcti;

    @Override
    public List<SanPhamChiTiet> read() {
        return spcti.findAll();
    }

    @Override
    public SanPhamChiTiet create(SanPhamChiTiet spct) {
        return spcti.save(spct);
    }

    @Override
    public SanPhamChiTiet update(SanPhamChiTiet spct) {
        return spcti.save(spct);
    }

    @Override
    public void delete(String maDinhDanh) {
        spcti.deleteById(maDinhDanh);
    }
}
