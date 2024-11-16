package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "hinh_thuc_thanh_toan")
@Entity
public class HinhThucThanhToan {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_hinh_thuc")
    private String tenHinhThuc;  // Tên hình thức thanh toán

    @Column(name = "trang_thai")
    private Integer trangThai;  // Trạng thái của hình thức thanh toán
}
