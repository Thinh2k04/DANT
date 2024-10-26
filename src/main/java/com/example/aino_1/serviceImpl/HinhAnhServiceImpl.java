package com.example.aino_1.serviceImpl;

import com.example.aino_1.entity.HinhAnh;
import com.example.aino_1.repository.HinhAnhInterface;
import com.example.aino_1.serviceInter.HinhAnhServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

//dựa trên cách quản lý bean của spring thì service phải đặt annotation ở tầng implements
@Service
public class HinhAnhServiceImpl implements HinhAnhServiceInter {
    @Autowired
    HinhAnhInterface hi;

    @Override
    public List<HinhAnh> read() {
        return hi.findAll();
    }

    @Override
    public HinhAnh create(HinhAnh hinhAnh) {
        return hi.save(hinhAnh);
    }

    @Override
    public HinhAnh update(HinhAnh hinhAnh) {
        return hi.save(hinhAnh);
    }

    @Override
    public void delete(Integer id) {
        hi.deleteById(id);
    }
}
