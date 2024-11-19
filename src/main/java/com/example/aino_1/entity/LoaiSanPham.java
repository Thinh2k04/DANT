package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "loai_san_pham")
@Entity
public class LoaiSanPham {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_loai", nullable = false, length = 50)
    private String tenLoai;

    @Column(name = "trang_thai")
    private Integer trangThai;  // Cột trạng thái, mặc định là 1
}
