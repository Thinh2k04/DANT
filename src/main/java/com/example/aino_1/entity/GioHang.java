package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "gio_hang")
@Entity
public class GioHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_tai_khoan", referencedColumnName = "id")
    private TaiKhoanNguoiDung taiKhoanNguoiDung;  // Liên kết với bảng tai_khoan_nguoi_dung qua khóa ngoại

    @Column(name = "trang_thai")
    private Integer trangThai;  // Trạng thái của giỏ hàng
}