package com.example.aino_1.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "imei")
@Entity
public class Imei {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_spct", nullable = false)
    private SanPhamChiTiet spct; // Sửa từ 'Spct' thành 'spct'

    @Column(name = "imei", unique = true, nullable = false)
    private String imei;

    @ManyToOne
    @JoinColumn(name = "id_hoa_don_chi_tiet", nullable = true)
    private HoaDonChiTiet hdct; // Tương tự, bạn có thể đổi tên 'HDCT' thành 'hdct'

    @Column(name = "trang_thai")
    private Integer trangThai;
}
