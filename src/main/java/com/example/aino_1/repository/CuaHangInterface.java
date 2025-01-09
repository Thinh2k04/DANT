package com.example.aino_1.repository;


import com.example.aino_1.entity.CuaHang;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CuaHangInterface extends JpaRepository<CuaHang,Integer> {
    List<CuaHang> findAllByTrangThai(Integer trangThai);
}
