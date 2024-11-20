package com.example.aino_1.repository;

import com.example.aino_1.entity.TaiKhoanNguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaiKhoanInterface extends JpaRepository<TaiKhoanNguoiDung, Integer> {
}
