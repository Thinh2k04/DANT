package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "gpu")
@Entity
public class Gpu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "hang_san_xuat", nullable = false, length = 20)
    private String hangSanXuat;

    @Column(name = "xung_nhip_toi_thieu", nullable = true)
    private Integer xungNhipToiThieu;

    @Column(name = "xung_nhip_toi_da", nullable = true)
    private Integer xungNhipToiDa;

    @Column(name = "vram", nullable = true)
    private Integer vram;

    @Column(name = "dien_ap", nullable = true)
    private Integer dienAp;

    @Column(name = "kien_truc_cong_nghe", nullable = true, length = 30)
    private String kienTrucCongNghe;

    @Column(name = "ten", nullable = false, length = 20)
    private String ten;
}
