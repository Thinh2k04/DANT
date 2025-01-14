package com.example.aino_1.restController;


import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.ManHinh;
import com.example.aino_1.entity.MauSac;
import com.example.aino_1.repository.ManHinhInterface;
import com.example.aino_1.repository.MauSacInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import java.util.Optional;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/mau_sac") //đường dẫn chung cho các phương thức http bên dưới
public class MauSacResstController {
    @Autowired
    MauSacInterface mssi;

    @GetMapping("/getAll")
    public List<MauSac> getAll() {
        return mssi.findAllByTrangThai(1);
    }

    @GetMapping("/getByID/{id}")
    public MauSac getAll(@PathVariable Integer id) {
        return mssi.findById(id).get();
    }

    @PostMapping("/add")
    public MauSac create(@RequestBody MauSac mauSac) {
        return mssi.save(mauSac);
    }

    @PostMapping("/update")
    public MauSac update(@RequestBody MauSac mauSac) {
        return mssi.save(mauSac);
    }

    @PostMapping("/del/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        Optional<MauSac> optionalMauSac = mssi.findById(id);

        if (!optionalMauSac.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ram with ID " + id + " not found");
        }

        MauSac mauSac = optionalMauSac.get();
        mauSac.setTrangThai(0);
        MauSac saved = mssi.save(mauSac);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/getThungRac")
    public void getThungRac(){
        mssi.findAllByTrangThai(0);
    }

}
