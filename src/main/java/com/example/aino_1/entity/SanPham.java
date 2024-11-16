package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "san_pham")
@Entity
public class SanPham {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_loai", nullable = false)
    private LoaiSanPham loaiSanPham;

    @ManyToOne
    @JoinColumn(name = "id_nguon_nhap", nullable = false)
    private NguonNhap nguonNhap;

    @ManyToOne
    @JoinColumn(name = "id_chat_lieu", nullable = false)
    private ChatLieu chatLieu;

    @ManyToOne
    @JoinColumn(name = "kich_thuoc_laptop_id", nullable = true)
    private KichThuocLapTop kichThuocLaptop;

    @Column(name = "ten_san_pham", nullable = false, length = 50)
    private String tenSanPham;

    @Column(name = "nam_san_xuat", nullable = false)
    private Integer namSanXuat;

    @Column(name = "trong_luong", nullable = false)
    private Float trongLuong;

    @Column(name = "gioi_thieu", nullable = true, length = 255)
    private String gioiThieu;

    @Column(name = "thoi_han_bao_hanh", nullable = true)
    private LocalDate thoiHanBaoHanh;
}