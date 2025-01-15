package com.example.aino_1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HoaDonChiTietDTO {
    private String tenSanPham;
    private String hinhAnhMinhHoa;
    private Integer soLuong;
    private Float donGia;
    private List<String> listImei;
}
