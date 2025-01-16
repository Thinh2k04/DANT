package com.example.aino_1.restController;

import com.example.aino_1.dto.ImeiDTO;
import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.service.DiscountService;
import com.example.aino_1.service.ImeiService;
import com.example.aino_1.service.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLOutput;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rest")
public class AdminRestController {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    DiscountService discountService;

    @Autowired
    ImeiService imeiService;



    @GetMapping("/adminSPCT")
    public List<SanPhamChiTietDto> getSanPhamChiTietADMIN() {
        List<SanPhamChiTietDto> listDiCout = discountService.getActiveDiscountsOrProducts();
        int i = 0;
        for (SanPhamChiTietDto dto : listDiCout) {
            // Lấy danh sách IMEI
            List<ImeiDTO> ImeiList = imeiService.getListImeiBySanPhamChiTietAdmin(dto.getIdSanPham());
            System.out.println("Số lượng imei của sản phẩm ID " + dto.getIdSanPham() + " là: " + ImeiList.size());

            // Ghi lại số lượng
            dto.setSoLuong(ImeiList.size());
            System.out.println("Số lượng được set vào DTO: " + dto.getSoLuong());

            // Cập nhật vào danh sách
            listDiCout.set(i, dto);
            i++;
        }

        // In danh sách cuối cùng để kiểm tra
        System.out.println("Danh sách trả về là:");
        listDiCout.forEach(d ->
                System.out.println("Sản phẩm ID: " + d.getIdSanPham() + ", Số lượng: " + d.getSoLuong())
        );

        return listDiCout;
    }
    
}
