package com.example.aino_1.restController;

import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.Gpu;

import com.example.aino_1.repository.GpuInterface;
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
@RequestMapping("/rest/gpu") //đường dẫn chung cho các phương thức http bên dưới
public class GpuRestController {
    @Autowired
    GpuInterface gsi;

    @GetMapping("/getAll")
    public List<Gpu> getAll() {
        return gsi.findAll();
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

    @PostMapping("/del")
    public void delete(@RequestBody Gpu gpu) {
        gpu.setTrangThai(0);
        gsi.save(gpu);
    }
}
