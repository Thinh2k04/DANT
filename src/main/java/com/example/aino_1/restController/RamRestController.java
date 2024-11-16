package com.example.aino_1.restController;

import com.example.aino_1.entity.Ram;
import com.example.aino_1.repository.RamInterface;
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
@RequestMapping("/rest/ram") //đường dẫn chung cho các phương thức http bên dưới
public class RamRestController {
    @Autowired
    RamInterface rsi;

    @GetMapping("/getAll")
    public List<Ram> getAll() {
        return rsi.findAll();
    }

    @PostMapping("/add")
    public Ram create(@RequestBody Ram ram) {
        return rsi.save(ram);
    }

    @PutMapping("/update/{maSo}")
    public Ram update(@RequestBody Ram ram) {
        return rsi.save(ram);
    }

    @DeleteMapping("/del/{maSo}")
    public void delete(@PathVariable Integer maSo) {
        rsi.deleteById(maSo);
    }
}
