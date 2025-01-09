package com.example.aino_1.repository;

import com.example.aino_1.entity.Gpu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GpuInterface extends JpaRepository<Gpu, Integer> {
    List<Gpu> findAllByTrangThai(Integer trangThai);

}
