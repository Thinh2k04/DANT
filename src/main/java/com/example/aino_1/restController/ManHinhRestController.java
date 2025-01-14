package com.example.aino_1.restController;

import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.ManHinh;
import com.example.aino_1.repository.ManHinhInterface;
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
@RequestMapping("/rest/man_hinh") //đường dẫn chung cho các phương thức http bên dưới
public class ManHinhRestController {
    @Autowired
    ManHinhInterface mhsi;

    @GetMapping("/getAll")
    public List<ManHinh> getAll() {
        return mhsi.findAllByTrangThai(1);
    }

    @GetMapping("/getByID/{id}")
    public ManHinh getAll(@PathVariable Integer id) {
        return mhsi.findById(id).get();
    }

    @PostMapping("/add")
    public ManHinh create(@RequestBody ManHinh manHinh) {
        return mhsi.save(manHinh);
    }

    @PostMapping("/update")
    public ManHinh update(@RequestBody ManHinh manHinh) {
        return mhsi.save(manHinh);
    }

    @PostMapping("/del/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        Optional<ManHinh> manHinhOptional = mhsi.findById(id);

        if (!manHinhOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ram with ID " + id + " not found");
        }

        ManHinh manHinh = manHinhOptional.get();
        manHinh.setTrangThai(0);
        ManHinh saved = mhsi.save(manHinh);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/getThungRac")
    public List<ManHinh> getThungRac(){
        return mhsi.findAllByTrangThai(0);
    }
}
