package com.example.aino_1.serviceInter;

import com.example.aino_1.entity.Voucher;

import java.util.List;

public interface VoucherServiceInter {
    List<Voucher> read();

    Voucher create(Voucher voucher);

    Voucher update(Voucher voucher);

    void delete(Integer id);
}
