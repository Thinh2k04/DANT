package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "san_pham_chi_tiet")
@Entity
public class SanPhamChiTiet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    @Column(name = "trang_thai", nullable = false, length = 20)
    private String trangThai;

    @Column(name = "don_gia", nullable = false)
    private Float donGia;

    @Column(name = "ma_spct", nullable = false, length = 20)
    private String maSpct;

    @ManyToOne
    @JoinColumn(name = "id_sp")
    private SanPham sanPham;

    @ManyToOne
    @JoinColumn(name = "id_ram")
    private Ram ram;

    @ManyToOne
    @JoinColumn(name = "id_o_luu_tru")
    private OLuuTru oLuuTru;

    @ManyToOne
    @JoinColumn(name = "id_man_hinh")
    private ManHinh manHinh;

    @ManyToOne
    @JoinColumn(name = "id_cpu")
    private Cpu cpu;

    @ManyToOne
    @JoinColumn(name = "id_gpu")
    private Gpu gpu;
}