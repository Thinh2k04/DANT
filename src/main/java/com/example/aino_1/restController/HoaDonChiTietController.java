package com.example.aino_1.restController;

import com.example.aino_1.entity.HoaDonChiTiet;
import com.example.aino_1.repository.HdctInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/hdct")
public class HoaDonChiTietController {
    @Autowired
    HdctInterface hdct;
    @GetMapping("/getAll")
    public List<HoaDonChiTiet> getAll(){
        return hdct.findAll();
    }
}
