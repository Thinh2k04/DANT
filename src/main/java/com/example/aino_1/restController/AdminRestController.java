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

    @GetMapping("/dashboard")
    public ResponseEntity<String> getDashboard(@RequestHeader("Authorization") String token) {
        System.out.println("AdminRestController: Received token for dashboard: " + token);

//        // Loại bỏ "Bearer " nếu có trong token
//        if (token.startsWith("Bearer ")) {
//            token = token.substring(7); // Cắt "Bearer " ra khỏi token
//        }

        if (isValidToken(token)) {
            return ResponseEntity.ok("Welcome to the Admin Dashboard");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
    }

    private boolean isValidToken(String token) {
        // Giải mã và kiểm tra tính hợp lệ của token
        Map<String, Object> tokenDetails = jwtUtils.validateToken(token); // Lấy chi tiết token dưới dạng Map
        boolean isValid = tokenDetails != null && tokenDetails.get("username") != null; // Kiểm tra token và username
        System.out.println("Is token valid: " + isValid);
        return isValid;
    }


    @GetMapping("/adminSPCT")
    public List<SanPhamChiTietDto> getSanPhamChiTietADMIN() {
        List<SanPhamChiTietDto> listDiCout = discountService.getActiveDiscountsOrProducts();
        int i = 0;
        for (SanPhamChiTietDto dto : listDiCout) {
            List<ImeiDTO> dtoList =  imeiService.getListImeiBySanPhamChiTietAdmin(dto.getIdSanPham());
            dto.setSoLuong(dtoList.size()) ;
            listDiCout.set(i, dto);
            i ++;
        }
        return listDiCout;
    }

}
