package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "man_hinh")
@Entity
public class ManHinh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "do_phan_giai")
    private String doPhanGiai;

    @Column(name = "tan_so_quet")
    private Integer tanSoQuet;

    @Column(name = "do_sang")
    private Integer doSang;

    @Column(name = "do_phu_mau")
    private Float doPhuMau;

    @Column(name = "tam_nen")
    private String tamNen;

    @Column(name = "trang_thai")
    private Integer trangThai;  // Cột trạng thái, mặc định là 1
}
