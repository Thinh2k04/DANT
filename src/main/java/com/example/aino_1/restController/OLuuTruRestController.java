package com.example.aino_1.restController;

import com.example.aino_1.entity.OLuuTru;

import com.example.aino_1.repository.OLuuTruInterface;
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
@RequestMapping("/rest/o_luu_tru") //đường dẫn chung cho các phương thức http bên dưới
public class OLuuTruRestController {
    @Autowired
    OLuuTruInterface oltsi;

    @GetMapping("/getAll")
    public List<OLuuTru> getAll() {
        return oltsi.findAll();
    }

    @PostMapping("/add")
    public OLuuTru create(@RequestBody OLuuTru oLuuTru) {
        return oltsi.save(oLuuTru);
    }

    @PutMapping("/update/{maSo}")
    public OLuuTru update(@RequestBody OLuuTru oLuuTru) {
        return oltsi.save(oLuuTru);
    }

    @DeleteMapping("/del/{maSo}")
    public void delete(@PathVariable Integer maSo) {
        oltsi.deleteById(maSo);
    }
}
