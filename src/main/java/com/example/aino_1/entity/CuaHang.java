package com.example.aino_1.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cua_hang")
@Entity
public class CuaHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "tinh", nullable = false, length = 20)
    private String tinh;

    @Column(name = "huyen", nullable = false, length = 20)
    private String huyen;

    @Column(name = "phuong", nullable = false, length = 20)
    private String phuong;

    @Column(name = "so_nha", nullable = false, length = 50)
    private String soNha;

    @Column(name = "thoi_gian_mo_cua", nullable = false, length = 5)
    private String thoiGianMoCua;

    @Column(name = "thoi_gian_dong_cua", nullable = false, length = 5)
    private String thoiGianDongCua;
}
