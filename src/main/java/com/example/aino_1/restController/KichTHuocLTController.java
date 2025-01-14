package com.example.aino_1.restController;

import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.KichThuocLapTop;
import com.example.aino_1.entity.LoaiSanPham;
import com.example.aino_1.repository.KichThuocLaptopInterface;
import com.example.aino_1.repository.LoaiSanPhamInterface;
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
@RequestMapping("/rest/ktlt") //đường dẫn chung cho các phương thức http bên dưới
public class KichTHuocLTController {

    @Autowired
    KichThuocLaptopInterface ktltsi;

    @GetMapping("/getAll")
    public List<KichThuocLapTop> getAll() {
        return ktltsi.findAllByTrangThai(1);
    }

    @GetMapping("/getByID/{id}")
    public KichThuocLapTop getAll(@PathVariable Integer id) {
        return ktltsi.findById(id).get();
    }

    @PostMapping("/add")
    public KichThuocLapTop create(@RequestBody KichThuocLapTop KichThuocLapTop) {
        return ktltsi.save(KichThuocLapTop);
    }

    @PostMapping("/update")
    public KichThuocLapTop update(@RequestBody KichThuocLapTop KichThuocLapTop) {
        return ktltsi.save(KichThuocLapTop);
    }

    @PostMapping("/del/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        Optional<KichThuocLapTop> optionalKichThuocLapTop = ktltsi.findById(id);

        if (!optionalKichThuocLapTop.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Kích thước Laptop với ID " + id + " không tìm thấy");
        }

        KichThuocLapTop kichThuocLapTop = optionalKichThuocLapTop.get();
        kichThuocLapTop.setTrangThai(0);
        KichThuocLapTop saved = ktltsi.save(kichThuocLapTop);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/getThungRac")
    public List<KichThuocLapTop> getThungRac(){
        return ktltsi.findAllByTrangThai(0);
    }
}
