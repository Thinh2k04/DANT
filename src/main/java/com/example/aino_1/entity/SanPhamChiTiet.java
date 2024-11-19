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

    @Column(name = "hinh_anh_minh_hoa", nullable = false)
    private String hinhAnhMinhHoa;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    @Column(name = "trang_thai", nullable = false, length = 20)
    private String trangThai;

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

    @Column(name = "trang_thai_spct")
    private Integer trangThaiSpct;  // Trạng thái sản phẩm chi tiết

    @ManyToOne
    @JoinColumn(name = "id_card_do_hoa", referencedColumnName = "id")
    private CardDoHoa cardDoHoa;

}