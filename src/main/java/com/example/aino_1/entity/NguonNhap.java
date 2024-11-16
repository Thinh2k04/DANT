package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "nguon_nhap")
@Entity
public class NguonNhap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_nha_cung_ung", nullable = false, length = 30)
    private String tenNhaCungUng;

    @Column(name = "sdt", nullable = false, length = 15)
    private String sdt;

    @Column(name = "email", nullable = false, length = 30)
    private String email;

    @Column(name = "dia_chi", nullable = false, length = 255)
    private String diaChi;

    @Column(name = "ghi_chu", nullable = true, length = 255)
    private String ghiChu;
}