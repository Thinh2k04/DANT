package com.example.aino_1.repository;

import com.example.aino_1.dto.SanPhamDTO;
import com.example.aino_1.entity.SanPham;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamInterface extends JpaRepository<SanPham, Integer> {
    @Transactional
    @Modifying
@Query(" select new com.example.aino_1.dto.SanPhamDTO(sp.tenSanPham,sp.namSanXuat,sp.trongLuong,ha.duongDanHinhAnh,lsp.tenLoai) " +
            "FROM SanPham sp " +
            "JOIN HinhAnh ha ON ha.sanPham = sp " +
            "JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id")
    List<SanPhamDTO> findProductDetailsWithImageAndCategory();

}
