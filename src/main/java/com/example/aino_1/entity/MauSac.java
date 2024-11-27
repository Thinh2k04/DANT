package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mau_sac")
@Entity
public class MauSac {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_mau", nullable = false)
    private String tenMau;  // Tên màu sắc

    @Column(name = "ma_hex")
    private String maHex;  // Mã màu HEX (tùy chọn)
}
