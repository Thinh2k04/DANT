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

    @Column(name = "do_phan_giai", nullable = true, length = 20)
    private String doPhanGiai;

    @Column(name = "tan_so_quet", nullable = true)
    private Integer tanSoQuet;

    @Column(name = "do_sang", nullable = true)
    private Integer doSang;

    @Column(name = "do_phu_mau", nullable = true)
    private Float doPhuMau;

    @Column(name = "tam_nen", nullable = true, length = 10)
    private String tamNen;
}
