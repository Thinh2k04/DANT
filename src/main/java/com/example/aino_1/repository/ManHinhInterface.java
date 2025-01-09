package com.example.aino_1.repository;

import com.example.aino_1.entity.ManHinh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ManHinhInterface extends JpaRepository<ManHinh, Integer> {
    List<ManHinh> findAllByTrangThai(int trangThai);
}
