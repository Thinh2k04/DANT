package com.example.aino_1.restController;

import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.Gpu;
import com.example.aino_1.entity.Imei;
import com.example.aino_1.repository.ImeiInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/imei")
public class ImeiController {

    @Autowired
    ImeiInterface ii;

    @GetMapping("/getAll")
    public List<Imei> getdata(){
        return ii.findAll();
    }




    @PostMapping("/add")
    public Imei create(@RequestBody Imei gpu) {
        return ii.save(gpu);
    }

    @PostMapping("/update")
    public Imei update(@RequestBody Imei gpu) {
        return ii.save(gpu);
    }

    @DeleteMapping("/del/{maSo}")
    public void delete(@PathVariable Integer maSo) {
        ii.deleteById(maSo);
    }


}
