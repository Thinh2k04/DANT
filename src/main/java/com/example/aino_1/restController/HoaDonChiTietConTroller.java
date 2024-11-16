package com.example.aino_1.restController;

import com.example.aino_1.entity.HinhAnh;
import com.example.aino_1.entity.HoaDonChiTiet;
import com.example.aino_1.repository.HDCTInterFace;
import com.example.aino_1.repository.HinhAnhInterface;
import com.example.aino_1.repository.HoaDonInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/hdct") //đường dẫn chung cho các phương thức http bên dưới
public class HoaDonChiTietConTroller {

    @Autowired
    HDCTInterFace hdctsi;

    @GetMapping("/getAll")
    public List<HoaDonChiTiet> getdata(){
        return hdctsi.findAll();
    }
}
