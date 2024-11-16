package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cpu")
@Entity
public class Cpu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "hang_san_xuat", nullable = false, length = 20)
    private String hangSanXuat;

    @Column(name = "kien_truc_cong_nghe", nullable = true, length = 30)
    private String kienTrucCongNghe;

    @Column(name = "toc_do_toi_thieu", nullable = true)
    private Integer tocDoToiThieu;

    @Column(name = "toc_do_toi_da", nullable = true)
    private Integer tocDoToiDa;

    @Column(name = "so_nhan", nullable = true)
    private Integer soNhan;

    @Column(name = "so_luong", nullable = true)
    private Integer soLuong;

    @Column(name = "bo_nho_dem", nullable = true)
    private Integer boNhoDem;

    @Column(name = "ten", nullable = false, length = 20)
    private String ten;
}