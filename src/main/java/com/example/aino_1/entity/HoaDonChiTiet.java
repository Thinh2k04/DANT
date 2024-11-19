package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hoa_don_chi_tiet")
public class HoaDonChiTiet {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_hoa_don", nullable = false)
    private HoaDon hoaDon;  // Liên kết với bảng hoa_don

    @ManyToOne
    @JoinColumn(name = "id_san_pham_chi_tiet", nullable = false)
    private SanPhamChiTiet sanPhamChiTiet;  // Liên kết với bảng san_pham_chi_tiet

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;  // Số lượng sản phẩm

    @Column(name = "gia", nullable = false)
    private Float gia;  // Giá của sản phẩm trong chi tiết hóa đơn

}
