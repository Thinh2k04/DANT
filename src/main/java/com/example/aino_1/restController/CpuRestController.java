package com.example.aino_1.restController;

import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.Cpu;
import com.example.aino_1.repository.CpuInterface;
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
@RequestMapping("/rest/cpu") //đường dẫn chung cho các phương thức http bên dưới
public class CpuRestController {
    @Autowired
    CpuInterface csi;

    @GetMapping("/getAll")
    public List<Cpu> getAll() {
        return csi.findAllByTrangThai(1);
    }

    @GetMapping("/getByID/{id}")
    public Cpu getAll(@PathVariable Integer id) {
        return csi.findById(id).get();
    }

    @PostMapping("/add")
    public Cpu create(@RequestBody Cpu cpu) {
        return csi.save(cpu);
    }

    @PostMapping("/update")
    public Cpu update(@RequestBody Cpu cpu) {
        return csi.save(cpu);
    }

    @PostMapping("/del/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        Optional<Cpu> optionalCpu = csi.findById(id);

        if (!optionalCpu.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ram with ID " + id + " not found");
        }

        Cpu cpu = optionalCpu.get();
        cpu.setTrangThai(0);
        Cpu saved = csi.save(cpu);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/getThungRac")
    public void getThungRac(){
        csi.findAllByTrangThai(0);
    }
}
