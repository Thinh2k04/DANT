package com.example.aino_1.repository;

import com.example.aino_1.entity.Imei;
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


}
