package com.example.aino_1.repository;

import com.example.aino_1.entity.ChucVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChucVuInterface extends JpaRepository<ChucVu, String> {
}
