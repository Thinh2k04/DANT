package com.example.aino_1.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @Column(name = "hinh_anh_minh_hoa", nullable = false)
    private String hinhAnhMinhHoa;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    @Column(name = "trang_thai", nullable = false, length = 20)
    private Integer trangThai;

    @Column(name = "don_gia", nullable = false)
    private Float donGia;

    @Column(name = "ma_spct", nullable = false, length = 20)
    private String maSpct;

    @ManyToOne
    @JoinColumn(name = "id_sp", referencedColumnName = "id")
    private SanPham sanPham;  // Liên kết với bảng san_pham

    @ManyToOne
    @JoinColumn(name = "id_ram", referencedColumnName = "id")
    private Ram ram;  // Liên kết với bảng ram

    @ManyToOne
    @JsonProperty("oLuuTru")  // Ánh xạ trường JSON "oLuuTru" vào thuộc tính nà
    @JoinColumn(name = "id_o_luu_tru", referencedColumnName = "id")
    private OLuuTru oLuuTru;  // Liên kết với bảng o_luu_tru

    @ManyToOne
    @JoinColumn(name = "id_man_hinh", referencedColumnName = "id")
    private ManHinh manHinh;  // Liên kết với bảng man_hinh

    @ManyToOne
    @JoinColumn(name = "id_cpu", referencedColumnName = "id")
    private Cpu cpu;  // Liên kết với bảng cpu

    @ManyToOne
    @JoinColumn(name = "id_gpu", referencedColumnName = "id")
    private Gpu gpu;  // Liên kết với bảng gpu

    @ManyToOne
    @JoinColumn(name = "id_mau_sac", referencedColumnName = "id")
    private MauSac mauSac;  // Liên kết với bảng MauSac


    @Column(name = "gioi_thieu", length = 300)
    private String gioiThieu;

    @ManyToOne
    @JoinColumn(name = "id_card_do_hoa", referencedColumnName = "id", nullable = true)
    private CardDoHoa cardDoHoa;

}