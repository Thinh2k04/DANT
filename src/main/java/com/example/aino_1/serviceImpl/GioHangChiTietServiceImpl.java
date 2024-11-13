package com.example.aino_1.serviceImpl;

import com.example.aino_1.entity.GioHangChiTiet;
import com.example.aino_1.repository.GioHangChiTietInterface;
import com.example.aino_1.repository.GioHangInterface;
import com.example.aino_1.serviceInter.GHCTServiceInter;
import com.example.aino_1.serviceInter.GioHangServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
//dựa trên cách quản lý bean của spring thì service phải đặt annotation ở tầng implements
@Service
public class GioHangChiTietServiceImpl implements GHCTServiceInter {
    @Autowired
    GioHangChiTietInterface ghi;

    @Override
    public List<GioHangChiTiet> read() {
        return ghi.findAll();
    }

    @Override
    public GioHangChiTiet create(GioHangChiTiet ghct) {
        return ghi.save(ghct);
    }

    @Override
    public GioHangChiTiet update(GioHangChiTiet ghct) {
        return ghi.save(ghct);
    }

    @Override
    public void delete(Integer id) {
        ghi.deleteById(id);
    }
}
