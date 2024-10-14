package com.example.aino_1.serviceImpl;

import com.example.aino_1.entity.Voucher;
import com.example.aino_1.repository.VoucherInterface;
import com.example.aino_1.serviceInter.VoucherServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
//dựa trên cách quản lý bean của spring thì service phải đặt annotation ở tầng implements
@Service
public class VoucherServiceImpl implements VoucherServiceInter {
    @Autowired
    VoucherInterface vi;

    @Override
    public List<Voucher> read() {
        return vi.findAll();
    }

    @Override
    public Voucher create(Voucher voucher) {
        return vi.save(voucher);
    }

    @Override
    public Voucher update(Voucher voucher) {
        return vi.save(voucher);
    }

    @Override
    public void delete(Integer id) {
        vi.deleteById(id);
    }
}
