package com.example.aino_1.repository;

import com.example.aino_1.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoucherInterface extends JpaRepository<Voucher, Integer> {

    List<Voucher> findAllByTrangThai(int trangThai);
}
