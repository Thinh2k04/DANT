package com.example.aino_1.restController;

import com.example.aino_1.entity.HoaDon;
import com.example.aino_1.entity.HoaDonChiTiet;
import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.entity.ThongTinTaiKhoan;
import com.example.aino_1.repository.HoaDonInterface;
import com.example.aino_1.service.HoaDonService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/hoa_don") //đường dẫn chung cho các phương thức http bên dưới
public class HoaDonController {
    @Autowired
    HoaDonInterface hdsi;
    @Autowired
    HoaDonService hdsv;

    @GetMapping("/getAll")
    public List<HoaDon> getAll() {
        return hdsi.findAll();
    }

//    @PostMapping("/add")
//    public HoaDon create(@RequestBody HoaDon HoaDon) {
//        return hdsi.save(HoaDon);
//    }

    @PutMapping("/update/{id}")
    public HoaDon update(@RequestBody HoaDon HoaDon) {
        return hdsi.save(HoaDon);
    }

    @DeleteMapping("/del/{id}")
    public void delete(@PathVariable Integer id) {
        hdsi.deleteById(id);
    }

    @GetMapping("/getById/{id}")
    public HoaDon getByidHD(@PathVariable Integer id){
        return hdsi.findById(id).get();
    }

    @PutMapping("GiveHD")
    public void givehd(){
    }

    @PutMapping("addHD")
    public void addHoaDon(@RequestBody Map<String, Object> requestData) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();

            // Ánh xạ dữ liệu
            ThongTinTaiKhoan tttk = objectMapper.convertValue(requestData.get("tttk"), ThongTinTaiKhoan.class);
            HoaDon hd = objectMapper.convertValue(requestData.get("hd"), HoaDon.class);
            List<HoaDonChiTiet> lhdct = objectMapper.convertValue(
                    requestData.get("lhdct"),
                    new TypeReference<List<HoaDonChiTiet>>() {}
            );
            System.out.println(tttk+" THÔNG TIN TÀI KHOẢN");
            System.out.println("----------------------------------------------------------------");
            System.out.println(hd+" HÓA ĐƠN");
            System.out.println("----------------------------------------------------------------");
            System.out.println(lhdct+" LIST HÓA ĐƠN CHI TIẾT");
            System.out.println("----------------------------------------------------------------");

//            // Kiểm tra dữ liệu đầu vào
//            if (tttk == null || hd == null || lhdct == null) {
//                throw new IllegalArgumentException("Dữ liệu đầu vào không đầy đủ");
//            }

            // Gọi hàm xử lý
            hdsv.hamXuLiHoaDon(tttk, hd, lhdct);

        } catch (Exception e) {
            throw e; // Hoặc trả về phản hồi lỗi cụ thể
        }
    }
}
