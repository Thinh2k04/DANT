package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "gio_hang_chi_tiet")
@Entity
public class    GioHangChiTiet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_tai_khoan", referencedColumnName = "id")
    private TaiKhoanNguoiDung taiKhoanNguoiDung;  // Liên kết với bảng gio_hang qua khóa ngoại

    @ManyToOne
    @JoinColumn(name = "id_spct", referencedColumnName = "id")
    private SanPhamChiTiet sanPhamChiTiet;  // Liên kết với bảng san_pham_chi_tiet qua khóa ngoại

    @Column(name = "so_luong")
    private Integer soLuong;  // Số lượng của sản phẩm chi tiết trong giỏ hàng

    @Column(name = "don_gia")
    private BigDecimal donGia;  // Đơn giá của sản phẩm chi tiết trong giỏ hàng

    @Column(name = "trang_thai")
    private Integer trangThai;  // Trạng thái của sản phẩm trong giỏ hàng
}