package com.example.aino_1.repository;

import com.example.aino_1.entity.TaiKhoanNguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaiKhoanNguoiDungInterface extends JpaRepository<TaiKhoanNguoiDung, Integer> {
    Optional<TaiKhoanNguoiDung> findByUsername(String username);
    List<TaiKhoanNguoiDung> findByChucVu(String chucVu);

    Optional<TaiKhoanNguoiDung> findByEmailAndUsername(String email, String username);


    String username(String username);
}
