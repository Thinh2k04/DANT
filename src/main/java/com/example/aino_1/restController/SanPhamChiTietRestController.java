package com.example.aino_1.restController;

//import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.repository.SanPhamChiTietInterface;
import com.example.aino_1.service.SanPhamChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/san_pham_chi_tiet") //đường dẫn chung cho các phương thức http bên dưới
public class  SanPhamChiTietRestController {
    @Autowired
    SanPhamChiTietInterface spctsi;
    SanPhamChiTietService spctsv;

    @GetMapping("/getAll")
    public List<SanPhamChiTiet> getAll() {
        return spctsi.findAll();
    }

    @GetMapping("/getById/{id}")
    public SanPhamChiTiet getById(@PathVariable Integer id) {
        return spctsi.findById(id).get();
    }

    @GetMapping("/getIMG/{id}")
    public List<String> getIMG(@PathVariable Integer id) {
        return spctsi.findImagePathsByProductDetailId(id);
    }

    @PostMapping("/add")
    public SanPhamChiTiet create(@RequestBody SanPhamChiTiet spct) {
        return spctsi.save(spct);
    }

    @PutMapping("/update/{id}")
    public SanPhamChiTiet update(@RequestBody SanPhamChiTiet spct) {
        return spctsi.save(spct);
    }

    @DeleteMapping("/del/{id}")
    public void delete(@PathVariable Integer id) {
        spctsi.deleteById(id);
    }

    @GetMapping("/getSPCTByIdSP/{id}")
    public ArrayList<SanPhamChiTietDto> getSPCTByIdSP(@PathVariable Integer id) {
        return spctsi.getSanPhamChiTietByIdSP(id);
    }

    @GetMapping("/tim_kiem/{tuKhoaTimKiem}")
    public List<SanPhamChiTietDto> search(@PathVariable String tuKhoaTimKiem) {
        return spctsi.timSanPhamTheoTuKhoa(tuKhoaTimKiem);
    }

    @GetMapping("/loc/{minPrice}&{maxPrice}&{hangSanXuat}&{oLuuTru}&{congNgheCPU}&{ram}&{manHinh}")
    public List<SanPhamChiTietDto> locSanPham(
            @PathVariable(required = false) Double minPrice,
            @PathVariable(required = false) Double maxPrice,
            @PathVariable(required = false) Integer hangSanXuat,
            @PathVariable(required = false) Integer oLuuTru,
            @PathVariable(required = false) Integer congNgheCPU,
            @PathVariable(required = false) Integer ram,
            @PathVariable(required = false) Integer manHinh
    ) {
        // Gọi service để lấy dữ liệu lọc
        return spctsi.loc(minPrice, maxPrice, hangSanXuat, oLuuTru, congNgheCPU, ram, manHinh);


    }
//    @GetMapping("/locTheoDungLuongRam/{dungLuongRam}")
//    public List<SanPhamChiTietDto> locTheoDungLuongRam(@PathVariable Integer dungLuongRam) {
//        return spctsi.locTheoRam(dungLuongRam);
//    }
//
//    @GetMapping("/locTheoHangSanXuat/{hangSanXuat}")
//    public List<SanPhamChiTietDto> locTheoHangSanXuat(@PathVariable String hangSanXuat) {
//        return spctsi.locTheoHangSanXuat(hangSanXuat);
//    }
//
//    @GetMapping("/locTheoOLuuTru/{oLuuTru}")
//    public List<SanPhamChiTietDto> locTheoOLuuTru(@PathVariable Integer oLuuTru) {
//        return spctsi.locTheoOLuuTru(oLuuTru);
//    }
//    @GetMapping("/locTheoCongNgheCPU/{congNgheCPU}")
//    public List<SanPhamChiTietDto> locTheoCongNgheCPU(@PathVariable String congNgheCPU) {
//        return spctsi.locTheoCongNgheCPU(congNgheCPU);
//    }
}
