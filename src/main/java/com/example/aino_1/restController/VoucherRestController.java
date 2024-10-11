package com.example.aino_1.restController;

import com.example.aino_1.entity.Voucher;
import com.example.aino_1.serviceInter.VoucherServiceInter;
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
@RequestMapping("/rest/voucher") //đường dẫn chung cho các phương thức http bên dưới
public class VoucherRestController {
    @Autowired
    VoucherServiceInter vsi;

    @GetMapping("/getAll")
    public List<Voucher> getAll() {
        return vsi.read();
    }

    @PostMapping("/add")
    public Voucher create(@RequestBody Voucher voucher) {
        return vsi.create(voucher);
    }

    @PutMapping("/update/{id}")
    public Voucher update(@RequestBody Voucher voucher) {
        return vsi.update(voucher);
    }

    @DeleteMapping("/del/{id}")
    public void delete(@PathVariable Integer id) {
        vsi.delete(id);
    }
}
