package com.example.aino_1.restController;

import com.example.aino_1.entity.HinhAnh;
import com.example.aino_1.repository.HinhAnhInterface;
import com.example.aino_1.service.HinhAnhService;
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
import java.util.Map;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/hinh_anh") //đường dẫn chung cho các phương thức http bên dưới
public class HinhAnhRestController {

    @Autowired
    HinhAnhInterface hasi;

    @Autowired
    HinhAnhService hasv;

    @GetMapping("/getAll")
    public List<HinhAnh> getAll() {
        return hasi.findAll();
    }

    @PostMapping("/add")
    public HinhAnh create(@RequestBody HinhAnh hinhAnh) {
        return hasi.save(hinhAnh);
    }

    @PutMapping("/update/{id}")
    public HinhAnh update(@RequestBody HinhAnh hinhAnh) {
        return hasi.save(hinhAnh);
    }

    @DeleteMapping("/del/{id}")
    public void delete(@PathVariable Integer id) {
        hasi.deleteById(id);
    }

    @DeleteMapping("/deleteListImg")
    public void deleteAll(@RequestBody Map<String, List<Integer>> requestData) {
        List<Integer> idDelete = requestData.get("idDelete");
        hasv.DeleteListImg(idDelete);
    }

    @PostMapping("/addListIMG")
    public void AddlisstIMG(@RequestBody List<HinhAnh> listAdd) {
        hasv.AddImg(listAdd);
    }

    @GetMapping("/getAllById/{id}")
    public List<HinhAnh> lha( @PathVariable  Integer id) {
        return hasi.findAllBySanPhamId(id);
    };
}

