package com.example.aino_1.restController;

import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.NguonNhap;
import com.example.aino_1.repository.NguonNhapInterface;
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
@RequestMapping("/rest/nguon_nhap") //đường dẫn chung cho các phương thức http bên dưới
public class NguonNhapRestController {
    @Autowired
    NguonNhapInterface nnsi;

    @GetMapping("/getAll")
    public List<NguonNhap> getAll() {
        return nnsi.findAllByTrangThai(1);
    }

    @GetMapping("/getByID/{id}")
    public NguonNhap getAll(@PathVariable Integer id) {
        return nnsi.findById(id).get();
    }

    @PostMapping("/add")
    public NguonNhap create(@RequestBody NguonNhap nguonNhap) {
        return nnsi.save(nguonNhap);
    }

    @PostMapping("/update")
    public NguonNhap update(@RequestBody NguonNhap nguonNhap) {
        return nnsi.save(nguonNhap);
    }

    @PostMapping("/del/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        Optional<NguonNhap> optionalNguonNhap = nnsi.findById(id);

        if (!optionalNguonNhap.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ram with ID " + id + " not found");
        }

        NguonNhap nguonNhap = optionalNguonNhap.get();
        nguonNhap.setTrangThai(0);
        NguonNhap saved = nnsi.save(nguonNhap);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/getThungRac")
    public List<NguonNhap> getThungRac(){
        return nnsi.findAllByTrangThai(0);
    }
}
