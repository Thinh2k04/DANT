package com.example.aino_1.repository;

import com.example.aino_1.entity.MauSac;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface MauSacInterface extends JpaRepository<MauSac,Integer> {

    List<MauSac> findAllByTrangThai(int trangThai);
}
