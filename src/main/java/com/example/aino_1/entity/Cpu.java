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

    @Column(name = "kien_truc_cong_nghe", length = 30)
    private String kienTrucCongNghe;

    @Column(name = "toc_do_toi_thieu")
    private Integer tocDoToiThieu;

    @Column(name = "toc_do_toi_da")
    private Integer tocDoToiDa;

    @Column(name = "so_nhan")
    private Integer soNhan;

    @Column(name = "so_luong")
    private Integer soLuong;

    @Column(name = "bo_nho_dem")
    private Integer boNhoDem;

    @Column(name = "ten", nullable = false, length = 20)
    private String ten;

    @Column(name = "trang_thai", columnDefinition = "INT DEFAULT 1")
    private Integer trangThai;
}