package com.example.aino_1.repository;

import com.example.aino_1.entity.OLuuTru;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OLuuTruInterface extends JpaRepository<OLuuTru, Integer> {
    List<OLuuTru> findAllByTrangThai(int trangThai);
}
