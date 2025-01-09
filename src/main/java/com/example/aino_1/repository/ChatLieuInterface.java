package com.example.aino_1.repository;

import com.example.aino_1.entity.ChatLieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ChatLieuInterface extends JpaRepository<ChatLieu, Integer> {
    List<ChatLieu> findAllByTrangThai(Integer trangThai);
}
