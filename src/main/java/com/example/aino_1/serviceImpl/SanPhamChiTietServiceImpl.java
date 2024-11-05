package com.example.aino_1.serviceImpl;

import com.example.aino_1.dto.SanPhamChiTietDto;
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
    public void delete(Integer id) {
        spcti.deleteById(id);
    }

    @Override
    public SanPhamChiTiet detail(Integer id) {
        return spcti.findById(id).get();
    }
    @Override
    public List<SanPhamChiTietDto> sreach(String tuKhoaTimKiem) {
        return spcti.timSanPhamTheoTuKhoa(tuKhoaTimKiem);
    }
    @Override
    public List<SanPhamChiTietDto> locTheoGia(Double minPrice, Double maxPrice) {
        return spcti.locTheoGia(minPrice,maxPrice);
    }
    @Override
    public List<SanPhamChiTietDto> locTheoDungLuongRam(Integer dungLuongRam) {
        return spcti.locTheoDungLuongRam(dungLuongRam);
    }
    @Override
    public List<SanPhamChiTietDto> locTheoHangSanXuat(String hangSanXuat) {
        return spcti.locTheoHangSanXuat(hangSanXuat);
    }
    @Override
    public List<SanPhamChiTietDto> locTheoTamNen(String tamNen) {
        return spcti.locTheoTamNen(tamNen);
    }
    @Override
    public List<SanPhamChiTietDto> locTheoCongNgheCPU(String congNgheCPU) {
        return spcti.locTheoCongNgheCPU(congNgheCPU);
    }
    @Override
    public List<SanPhamChiTietDto> locTheoKichThuoc(Double kichThuoc) {
        return spcti.locTheoKichThuoc(kichThuoc);
    }
}
