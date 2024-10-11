package com.example.aino_1.restController;

import com.example.aino_1.entity.Cpu;
import com.example.aino_1.serviceInter.CpuServiceInter;
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
@RequestMapping("/rest/cpu") //đường dẫn chung cho các phương thức http bên dưới
public class CpuRestController {
    @Autowired
    CpuServiceInter csi;

    @GetMapping("/getAll")
    public List<Cpu> getAll() {
        return csi.read();
    }

    @PostMapping("/add")
    public Cpu create(@RequestBody Cpu cpu) {
        return csi.create(cpu);
    }

    @PutMapping("/update/{maSo}")
    public Cpu update(@RequestBody Cpu cpu) {
        return csi.update(cpu);
    }

    @DeleteMapping("/del/{maSo}")
    public void delete(@PathVariable Integer maSo) {
        csi.delete(maSo);
    }
}
