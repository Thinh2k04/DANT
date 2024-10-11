package com.example.aino_1.serviceImpl;

import com.example.aino_1.entity.DonHang;
import com.example.aino_1.repository.DonHangInterface;
import com.example.aino_1.serviceInter.DonHangServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonHangServiceImpl implements DonHangServiceInter {
    @Autowired
    DonHangInterface dhi;

    @Override
    public List<DonHang> read() {
        return dhi.findAll();
    }

    @Override
    public DonHang create(DonHang donHang) {
        return dhi.save(donHang);
    }

    @Override
    public DonHang update(DonHang donHang) {
        return dhi.save(donHang);
    }

    @Override
    public void delete(Integer id) {
        dhi.deleteById(id);
    }
}
