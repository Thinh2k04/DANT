package com.example.aino_1.repository;

import com.example.aino_1.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageInterface  extends JpaRepository<Message, Integer> {

    List<Message> findByIdPhienChat(int idPhienChat);

}
