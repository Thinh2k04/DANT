package com.example.aino_1.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "san_pham_chi_tiet")
@Entity
public class SanPhamChiTiet {
    @Id
    /*trường id cứ là số thì tự động tăng hết kẻo gặp lỗi phải đặt id trước khi persist
    /còn ko thì hoặc là đặt thủ công hoặc gọi ra từ api*/
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "so_luong")
    private Integer soLuong;
    @Column(name = "trang_thai")
    private String trangThai;
    @Column(name = "don_gia", precision = 19, scale = 4)
    private BigDecimal donGia;
    @Column(name = "ten_spct")
    private String tenSpct;
    @ManyToOne
    @JoinColumn(name = "id_sp")
    private SanPham sanPham;
    @ManyToOne
    @JoinColumn(name = "ma_so_ram")
    private Ram ram;
    @ManyToOne
    @JoinColumn(name = "ma_so_o_luu_tru")
    private OLuuTru oLuuTru;
    @ManyToOne
    @JoinColumn(name = "ma_so_man_hinh")
    private ManHinh manHinh;
    @ManyToOne
    @JoinColumn(name = "ma_so_cpu")
    private Cpu cpu;
    @ManyToOne
    @JoinColumn(name = "ma_so_gpu")
    private Gpu gpu;
    //jsonignore để tránh vòng lặp vô hạn khi mapping 2 chiều
    @JsonIgnore
    @OneToMany(mappedBy = "sanPhamChiTiet")
    List<GioHang> gioHang;
}
