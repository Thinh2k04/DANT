package com.example.aino_1.serviceImpl;

import com.example.aino_1.entity.SanPham;
import com.example.aino_1.repository.SanPhamInterface;
import com.example.aino_1.serviceInter.SanPhamServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
//dựa trên cách quản lý bean của spring thì service phải đặt annotation ở tầng implements
@Service
public class SanPhamServiceImpl implements SanPhamServiceInter {
    @Autowired
    SanPhamInterface spi;

    @Override
    public List<SanPham> read() {
        return spi.findAll();
    }

    @Override
    public SanPham create(SanPham sanPham) {
        return spi.save(sanPham);
    }

    @Override
    public SanPham update(SanPham sanPham) {
        return spi.save(sanPham);
    }

    @Override
    public void delete(Integer id) {
        spi.deleteById(id);
    }

    @Override
    public SanPham detail(Integer id) {
        return spi.findById(id).get();
    }
}
