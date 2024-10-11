package com.example.aino_1.serviceImpl;

import com.example.aino_1.entity.TaiKhoanNguoiDung;
import com.example.aino_1.repository.TaiKhoanNguoiDungInterface;
import com.example.aino_1.serviceInter.TaiKhoanNguoiDungServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaiKhoanNguoiDungServiceImpl implements TaiKhoanNguoiDungServiceInter {
    @Autowired
    TaiKhoanNguoiDungInterface tkndi;

    @Override
    public List<TaiKhoanNguoiDung> read() {
        return tkndi.findAll();
    }

    @Override
    public TaiKhoanNguoiDung create(TaiKhoanNguoiDung taiKhoanNguoiDung) {
        return tkndi.save(taiKhoanNguoiDung);
    }

    @Override
    public TaiKhoanNguoiDung update(TaiKhoanNguoiDung taiKhoanNguoiDung) {
        return tkndi.save(taiKhoanNguoiDung);
    }

    @Override
    public void delete(Integer id) {
        tkndi.deleteById(id);
    }
}
