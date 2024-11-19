package com.example.aino_1.service;

import com.example.aino_1.entity.HinhAnh;
import com.example.aino_1.repository.HinhAnhInterface;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HinhAnhService {

    @Autowired
    private HinhAnhInterface hasi;

    @Transactional
    public void DeleteListImg(List<Integer> listIMG){
        for (Integer Img : listIMG
             ) {
            hasi.deleteById(Img);
        }
    }


    public void AddImg(List<HinhAnh> listIMG){
        for (HinhAnh Img : listIMG
        ) {
            hasi.save(Img);
        }
    }

}
