package com.example.aino_1.restController;

import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.entity.HinhAnh;
import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.repository.SanPhamChiTietInterface;
import com.example.aino_1.service.SanPhamChiTietService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/spctDTO") //đường dẫn chung cho các phương thức http bên dưới
public class SPCTDTORestController {

    @Autowired
    SanPhamChiTietInterface spctsi;

    @Autowired
    SanPhamChiTietService spctsv;

    @GetMapping("/getAll")
    public List<SanPhamChiTietDto> getAllSanPhamChiTietDto() {
        return spctsi.getAllDTO();
    }

//    @GetMapping("/getById/{id}")
//    public SanPhamChiTietDto getById(@PathVariable Integer id) {
//        return spctsi.getSanPhamChiTietById(id);
//    }


    @GetMapping("/getById/{id}")
    public SanPhamChiTietDto getByIDSPCT(@PathVariable Integer id){
        return spctsi.getSanPhamChiTietById(id);
    }

    @PostMapping("/add")
    public void create(@RequestBody Map<String, Object> requestData) {
        // Lấy thông tin sản phẩm từ JSON
        SanPhamChiTiet sanPhamChiTiet = new ObjectMapper().convertValue(requestData.get("sanPhamChiTiet"), SanPhamChiTiet.class);

        // Lấy danh sách URL ảnh từ JSON
        List<String> imageUrls = (List<String>) requestData.get("imageUrls");

        spctsv.saveSanPhamChiTietWithImage(sanPhamChiTiet, imageUrls);
    }

    @PutMapping("/update/{id}")
    public void update(@RequestBody Map<String, Object> requestData) {
        // Lấy thông tin sản phẩm từ JSON
        SanPhamChiTiet SanPhamChiTiet  = new ObjectMapper().convertValue(requestData.get("sanPhamChiTiet"), SanPhamChiTiet.class);

        // Lấy danh sách URL ảnh từ JSON
        List<String> imageUrls = (List<String>) requestData.get("imageUrls");

        spctsv.updateSanPhamChiTietWithImage(SanPhamChiTiet, imageUrls);
    }






    }

