package com.example.aino_1.restController;

import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.Ram;
import com.example.aino_1.repository.RamInterface;
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
@RequestMapping("/rest/ram") //đường dẫn chung cho các phương thức http bên dưới
public class RamRestController {
    @Autowired
    RamInterface rsi;

    @GetMapping("/getAll")
    public List<Ram> getAll() {
        return rsi.findAllByTrangThai(1);
    }

    @GetMapping("/getByID/{id}")
    public Ram getAll(@PathVariable Integer id) {
        return rsi.findById(id).get();
    }

    @PostMapping("/add")
    public Ram create(@RequestBody Ram ram) {
        return rsi.save(ram);
    }

    @PostMapping("/update")
    public Ram update(@RequestBody Ram ram) {
        return rsi.save(ram);
    }

    @PostMapping("/del/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        Optional<Ram> optionalRam = rsi.findById(id);

        if (!optionalRam.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ram with ID " + id + " not found");
        }

        Ram ram = optionalRam.get();
        ram.setTrangThai(0);
        Ram savedRam = rsi.save(ram);

        return ResponseEntity.ok(savedRam);
    }

    @GetMapping("/getThungRac")
    public void getThungRac(){
        rsi.findAllByTrangThai(0);
    }
}
