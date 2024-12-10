package com.example.aino_1.restController;


import com.example.aino_1.entity.ManHinh;
import com.example.aino_1.entity.MauSac;
import com.example.aino_1.repository.ManHinhInterface;
import com.example.aino_1.repository.MauSacInterface;
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
@RequestMapping("/rest/mau_sac") //đường dẫn chung cho các phương thức http bên dưới
public class MauSacResstController {
    @Autowired
    MauSacInterface mssi;

    @GetMapping("/getAll")
    public List<MauSac> getAll() {
        return mssi.findAll();
    }

    @PostMapping("/add")
    public MauSac create(@RequestBody MauSac mauSac) {
        return mssi.save(mauSac);
    }

    @PutMapping("/update/{maSo}")
    public MauSac update(@RequestBody MauSac mauSac) {
        return mssi.save(mauSac);
    }

    @DeleteMapping("/del/{maSo}")
    public void delete(@PathVariable Integer maSo) {
        mssi.deleteById(maSo);
    }

}
