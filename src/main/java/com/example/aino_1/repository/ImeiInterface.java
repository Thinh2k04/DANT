package com.example.aino_1.repository;

import com.example.aino_1.entity.HoaDonChiTiet;
import com.example.aino_1.entity.Imei;
import com.example.aino_1.entity.SanPhamChiTiet;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImeiInterface extends JpaRepository<Imei, Integer> {

    Optional<Imei> findByImei(String imei);

    @Query(value = "SELECT  * FROM imei WHERE id_spct = :idSpct AND trang_thai = 0", nativeQuery = true)
    List<Imei> findTopImeiBySanPhamChiTietIdAndTrangThaiNative(@Param("idSpct") Integer idSpct);

    List<Imei> findBySpct(SanPhamChiTiet spct);

    List<Imei> findBySpct_Id(Integer spctId);

    List<Imei> findAllBySpctIdAndTrangThai(Integer spctId, Integer trangThai);

    List<Imei> findAllByHdct(HoaDonChiTiet hdct);


    @Query("SELECT e FROM Imei e WHERE e.spct.id = :spctId AND e.trangThai IN :trangThai")
    List<Imei> GetBySpctIdAndTrangThaiIn(@Param("spctId") Integer spctId, @Param("trangThai") List<Integer> trangThai);

}
