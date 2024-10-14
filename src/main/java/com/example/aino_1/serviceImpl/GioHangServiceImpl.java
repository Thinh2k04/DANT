package com.example.aino_1.serviceImpl;

import com.example.aino_1.entity.GioHang;
import com.example.aino_1.repository.GioHangInterface;
import com.example.aino_1.serviceInter.GioHangServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
//dựa trên cách quản lý bean của spring thì service phải đặt annotation ở tầng implements
@Service
public class GioHangServiceImpl implements GioHangServiceInter {
    @Autowired
    GioHangInterface ghi;

    @Override
    public List<GioHang> read() {
        return ghi.findAll();
    }

    @Override
    public GioHang create(GioHang gioHang) {
        return ghi.save(gioHang);
    }

    @Override
    public GioHang update(GioHang gioHang) {
        return ghi.save(gioHang);
    }

    @Override
    public void delete(Integer id) {
        ghi.deleteById(id);
    }
}
