package com.example.aino_1.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SanPhamDTO {
    private String tenSanPham; // Tên sản phẩm
    private Integer namSanXuat; // Năm sản xuất
    private Float trongLuong; // Trọng lượng
    private String tenLoai; // Tên loại sản phẩm
}
