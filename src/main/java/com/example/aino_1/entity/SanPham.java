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
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "san_pham")
@Entity
public class SanPham {
    @Id
    /*trường id cứ là số thì tự động tăng hết kẻo gặp lỗi phải đặt id trước khi persist
    /còn ko thì hoặc là đặt thủ công hoặc gọi ra từ api*/
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "ten_san_pham")
    private String tenSanPham;
    @Column(name = "hang_san_xuat")
    private String hangSanXuat;
    @Column(name = "nam_san_xuat")
    private Integer namSanXuat;
    @Column(name = "trong_luong", precision = 3, scale = 2)
    private BigDecimal trongLuong;
    /*lưu tên của file, file được lưu vào /resources/static/asset/image của server chứ ko lưu
    vào cookie, lưu ý tuyệt đối ko để tên file quá dài*/
    @Column(name = "hinh_anh")
    private String hinhAnh;
    @Column(name = "mau_sac")
    private String mauSac;
    @Column(name = "chat_lieu")
    private String chatLieu;
    @Column(name = "gioi_thieu")
    private String gioiThieu;
    @Column(name = "thoi_han_bao_hanh")
    private LocalDateTime thoiHanBaoHanh;
    @ManyToOne
    @JoinColumn(name = "ma_loai")
    private LoaiSanPham loaiSanPham;
    @ManyToOne
    @JoinColumn(name = "ma_nha_cung_ung")
    private NguonNhap nguonNhap;
    //jsonignore để tránh vòng lặp vô hạn khi mapping 2 chiều
    @JsonIgnore
    @OneToMany(mappedBy = "sanPham")
    List<SanPhamChiTiet> spct;
}
