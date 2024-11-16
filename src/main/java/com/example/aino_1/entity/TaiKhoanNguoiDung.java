package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tai_khoan_nguoi_dung")
@Entity
public class TaiKhoanNguoiDung {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_tai_khoan", nullable = false, length = 50)
    private String tenTaiKhoan;

    @Column(name = "mat_khau", nullable = false, length = 50)
    private String matKhau;

    @ManyToOne
    @JoinColumn(name = "id_chuc_vu")
    private ChucVu chucVu;
}
