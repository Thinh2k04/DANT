package com.example.aino_1.restController;

import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.Gpu;

import com.example.aino_1.repository.GpuInterface;
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
@RequestMapping("/rest/gpu") //đường dẫn chung cho các phương thức http bên dưới
public class GpuRestController {
    @Autowired
    GpuInterface gsi;

    @GetMapping("/getAll")
    public List<Gpu> getAll() {
        return gsi.findAllByTrangThai(1);
    }

    @GetMapping("/getByID/{id}")
    public Gpu getAll(@PathVariable Integer id) {
        return gsi.findById(id).get();
    }

    @PostMapping("/add")
    public Gpu create(@RequestBody Gpu gpu) {
        return gsi.save(gpu);
    }

    @PostMapping("/update")
    public Gpu update(@RequestBody Gpu gpu) {
        return gsi.save(gpu);
    }

    @PostMapping("/del/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        Optional<Gpu> optionalGpu = gsi.findById(id);

        if (!optionalGpu.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ram with ID " + id + " not found");
        }

        Gpu gpu = optionalGpu.get();
        gpu.setTrangThai(0);
        Gpu saved = gsi.save(gpu);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/getThungRac")
    public List<Gpu> getThungRac(){
        return gsi.findAllByTrangThai(0);
    }
}
