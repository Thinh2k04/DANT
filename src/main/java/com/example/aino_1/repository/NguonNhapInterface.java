package com.example.aino_1.repository;

import com.example.aino_1.entity.NguonNhap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NguonNhapInterface extends JpaRepository<NguonNhap, Integer> {
    List<NguonNhap> findAllByTrangThai(int trangThai);
}
