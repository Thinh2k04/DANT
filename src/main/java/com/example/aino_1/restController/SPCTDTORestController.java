package com.example.aino_1.restController;

import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.repository.SanPhamChiTietInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/spctDTO") //đường dẫn chung cho các phương thức http bên dưới
public class SPCTDTORestController {

    @Autowired
    SanPhamChiTietInterface spctsi;

    @GetMapping("/getAll")
    public List<SanPhamChiTietDto> getAllSanPhamChiTietDto() {
        return spctsi.getAllDTO();
    }

    @GetMapping("/getById/{id}")
    public SanPhamChiTietDto getById(@PathVariable Integer id) {
        return spctsi.getSanPhamChiTietById(id);
    }
}
