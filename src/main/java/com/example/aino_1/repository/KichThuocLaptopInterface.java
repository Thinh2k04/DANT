package com.example.aino_1.repository;

import com.example.aino_1.entity.KichThuocLapTop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KichThuocLaptopInterface extends JpaRepository<KichThuocLapTop, Integer> {
List<KichThuocLapTop> findAllByTrangThai(int trangThai);
}
