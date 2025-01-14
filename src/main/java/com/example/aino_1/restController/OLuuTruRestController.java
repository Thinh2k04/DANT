package com.example.aino_1.restController;

import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.OLuuTru;

import com.example.aino_1.repository.OLuuTruInterface;
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
@RequestMapping("/rest/o_luu_tru") //đường dẫn chung cho các phương thức http bên dưới
public class OLuuTruRestController {
    @Autowired
    OLuuTruInterface oltsi;

    @GetMapping("/getAll")
    public List<OLuuTru> getAll() {
        return oltsi.findAllByTrangThai(1);
    }

    @GetMapping("/getByID/{id}")
    public OLuuTru getAll(@PathVariable Integer id) {
        return oltsi.findById(id).get();
    }

    @PostMapping("/add")
    public OLuuTru create(@RequestBody OLuuTru oLuuTru) {
        return oltsi.save(oLuuTru);
    }

    @PostMapping("/update")
    public OLuuTru update(@RequestBody OLuuTru oLuuTru) {
        return oltsi.save(oLuuTru);
    }

    @PostMapping("/del/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        Optional<OLuuTru> optionalOLuuTru = oltsi.findById(id);

        if (!optionalOLuuTru.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ram with ID " + id + " not found");
        }

        OLuuTru oLuuTru = optionalOLuuTru.get();
        oLuuTru.setTrangThai(0);
        OLuuTru savedRam = oltsi.save(oLuuTru);

        return ResponseEntity.ok(savedRam);
    }

    @GetMapping("/getThungRac")
    public List<OLuuTru> getThungRac(){
        return oltsi.findAllByTrangThai(0);
    }
}
