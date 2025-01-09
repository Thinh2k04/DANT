package com.example.aino_1.repository;


import com.example.aino_1.entity.CardDoHoa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardDoHoaInterface extends JpaRepository<CardDoHoa,Integer> {

    public List<CardDoHoa> findAllByTrangThai(Integer trangThai);
}
