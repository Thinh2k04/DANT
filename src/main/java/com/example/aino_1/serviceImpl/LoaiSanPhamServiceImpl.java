package com.example.aino_1.serviceImpl;

import com.example.aino_1.entity.LoaiSanPham;
import com.example.aino_1.repository.LoaiSanPhamInterface;
import com.example.aino_1.serviceInter.LoaiSanPhamServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoaiSanPhamServiceImpl implements LoaiSanPhamServiceInter {
    @Autowired
    LoaiSanPhamInterface lspi;

    @Override
    public List<LoaiSanPham> read() {
        return lspi.findAll();
    }

    @Override
    public LoaiSanPham create(LoaiSanPham loaiSanPham) {
        return lspi.save(loaiSanPham);
    }

    @Override
    public LoaiSanPham update(LoaiSanPham loaiSanPham) {
        return lspi.save(loaiSanPham);
    }

    @Override
    public void delete(String maLoai) {
        lspi.deleteById(maLoai);
    }
}
