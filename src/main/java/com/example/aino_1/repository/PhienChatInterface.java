package com.example.aino_1.repository;

import com.example.aino_1.entity.PhienChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface  PhienChatInterface  extends JpaRepository<PhienChat, Integer> {
    @Query("SELECT p FROM PhienChat p WHERE p.idKhachHang = :idKhachHang AND p.trangThai = 'Active'")
    Optional<PhienChat> findActiveChatByUserId(int idKhachHang);
}
