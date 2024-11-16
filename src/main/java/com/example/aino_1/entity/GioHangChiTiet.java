package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "gio_hang_chi_tiet")
@Entity
public class GioHangChiTiet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_gio_hang")
    private GioHang gioHang;

    @ManyToOne
    @JoinColumn(name = "id_spct")
    private SanPhamChiTiet sanPhamChiTiet;

    @Column(nullable = false)
    private Integer soLuong;

    @Column(nullable = false)
    private Float donGia;
}