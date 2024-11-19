package com.example.aino_1.repository;

import com.example.aino_1.entity.HinhAnh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HinhAnhInterface extends JpaRepository<HinhAnh, Integer> {
    @Modifying
    @Query("DELETE FROM HinhAnh h WHERE h.sanPham.id = :sanPhamId")
    void deleteBySanPhamId(@Param("sanPhamId") Integer sanPhamId);


    @Query("SELECT ha FROM HinhAnh ha WHERE ha.sanPham.id = :idSanPham")
    List<HinhAnh> findAllBySanPhamId(Integer idSanPham);
}
