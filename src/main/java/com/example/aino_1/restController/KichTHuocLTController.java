package com.example.aino_1.restController;

import com.example.aino_1.entity.KichThuocLapTop;
import com.example.aino_1.entity.LoaiSanPham;
import com.example.aino_1.repository.KichThuocLaptopInterface;
import com.example.aino_1.repository.LoaiSanPhamInterface;
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
@RequestMapping("/rest/ktlt") //đường dẫn chung cho các phương thức http bên dưới
public class KichTHuocLTController {

    @Autowired
    KichThuocLaptopInterface ktltsi;

    @GetMapping("/getAll")
    public List<KichThuocLapTop> getAll() {
        return ktltsi.findAll();
    }

    @PostMapping("/add")
    public KichThuocLapTop create(@RequestBody KichThuocLapTop KichThuocLapTop) {
        return ktltsi.save(KichThuocLapTop);
    }

    @PutMapping("/update/{maLoai}")
    public KichThuocLapTop update(@RequestBody KichThuocLapTop KichThuocLapTop) {
        return ktltsi.save(KichThuocLapTop);
    }

    @DeleteMapping("/del/{id}")
    public void delete(@PathVariable Integer id) {
        ktltsi.deleteById(id);
    }
}
