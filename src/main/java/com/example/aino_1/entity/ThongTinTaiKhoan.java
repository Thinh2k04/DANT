package com.example.aino_1.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "thong_tin_tai_khoan")
@Entity
public class ThongTinTaiKhoan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ho_ten", length = 50)
    private String hoTen;

    @Column(name = "dia_chi", length = 255)
    private String diaChi;

    @Column(name = "so_cccd", length = 20)
    private String soCccd;

    @Column(name = "so_dien_thoai", nullable = false, length = 11, unique = true)
    private String soDienThoai;

    @Column(name = "email", length = 50)
    private String email;

    @ManyToOne
    @JoinColumn(name = "id_tai_khoan")
    private TaiKhoanNguoiDung taiKhoanNguoiDung;
}