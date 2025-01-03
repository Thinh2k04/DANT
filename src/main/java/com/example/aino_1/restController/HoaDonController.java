package com.example.aino_1.restController;

import com.example.aino_1.entity.*;
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

            // Ánh xạ dữ liệu từ requestData
            ThongTinTaiKhoan tttk = objectMapper.convertValue(requestData.get("tttk"), ThongTinTaiKhoan.class);
            HoaDon hd = objectMapper.convertValue(requestData.get("hd"), HoaDon.class);
            List<Imei> listImei = objectMapper.convertValue(requestData.get("listImei"), new TypeReference<List<Imei>>() {});
            List<HoaDonChiTiet> lhdct = objectMapper.convertValue(requestData.get("lhdct"), new TypeReference<List<HoaDonChiTiet>>() {});

            // Kiểm tra dữ liệu đầu vào
            if (tttk == null) {
                throw new IllegalArgumentException("Dữ liệu thông tin tài khoản không hợp lệ.");
            }
            if (hd == null) {
                throw new IllegalArgumentException("Dữ liệu hóa đơn không hợp lệ.");
            }
            if (lhdct == null || lhdct.isEmpty()) {
                throw new IllegalArgumentException("Danh sách hóa đơn chi tiết không được để trống.");
            }

            // Log dữ liệu để kiểm tra
            System.out.println(tttk + " - Thông tin tài khoản");
            System.out.println("----------------------------------------------------------------");
            System.out.println(hd + " - Hóa đơn");
            System.out.println("----------------------------------------------------------------");
            System.out.println(listImei + " - Danh sách IMEI");
            System.out.println("----------------------------------------------------------------");
            System.out.println(lhdct + " - Danh sách hóa đơn chi tiết");
            System.out.println("----------------------------------------------------------------");

            // Gọi hàm xử lý
            hdsv.hamXuLiHoaDon(tttk, hd, lhdct,listImei);

        } catch (IllegalArgumentException e) {
            // Xử lý lỗi dữ liệu đầu vào
            System.err.println("Lỗi dữ liệu đầu vào: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            // Xử lý lỗi không mong muốn
            System.err.println("Lỗi hệ thống: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }

    }
}
