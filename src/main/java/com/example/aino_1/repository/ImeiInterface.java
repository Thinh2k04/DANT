package com.example.aino_1.repository;

import com.example.aino_1.entity.Imei;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImeiInterface extends JpaRepository<Imei,Integer> {
    Optional<Imei> findByImei(String imei);
}
