package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chuc_vu")
@Entity
public class ChucVu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "vai_tro", nullable = false, length = 30)
    private String vaiTro;

    @Column(name = "trang_thai")
    private Integer trangThai;  // Cột trạng thái, mặc định là 1
}
