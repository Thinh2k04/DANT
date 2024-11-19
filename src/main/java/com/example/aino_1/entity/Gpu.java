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

    @Column(name = "xung_nhip_toi_thieu")
    private Integer xungNhipToiThieu;

    @Column(name = "xung_nhip_toi_da")
    private Integer xungNhipToiDa;

    @Column(name = "vram")
    private Integer vram;

    @Column(name = "dien_ap")
    private Integer dienAp;

    @Column(name = "kien_truc_cong_nghe", length = 30)
    private String kienTrucCongNghe;

    @Column(name = "ten", nullable = false, length = 20)
    private String ten;

    @Column(name = "trang_thai")
    private Integer trangThai;  // Cột trạng thái, mặc định là 1
}
