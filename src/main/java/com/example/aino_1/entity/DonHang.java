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
@Table(name = "don_hang")
@Entity
public class DonHang {
    @Id
    /*trường id cứ là số thì tự động tăng hết kẻo gặp lỗi phải đặt id trước khi persist
    /còn ko thì hoặc là đặt thủ công hoặc gọi ra từ api*/
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "tong_tien", precision = 19, scale = 4)
    private BigDecimal tongTien;
    @Column(name = "thoi_gian_thanh_toan")
    private LocalDateTime thoiGianThanhToan;
    @Column(name = "hinh_thuc_thanh_toan")
    private String hinhThucThanhToan;
    @Column(name = "dia_chi_nhan_hang")
    private String diaChiNhanHang;
    @Column(name = "trang_thai")
    private String trangThai;
    @Column(name = "sdt")
    private String sdt;
    //gửi đơn vị vận chuyển xong được biên lai có chứa mã vận đơn, cập nhật mã này vào hđ cho người dùng xem
    @Column(name = "ma_phieu_gui")
    private String maPhieuGui;
    @ManyToOne
    @JoinColumn(name = "id_nguoi_dung")
    private TaiKhoanNguoiDung taiKhoanNguoiDung;
    //jsonignore để tránh vòng lặp vô hạn khi mapping 2 chiều
    @JsonIgnore
    @OneToMany(mappedBy = "donHang")
    List<GioHang> gioHang;
    @JsonIgnore
    @OneToMany(mappedBy = "donHang")
    List<Voucher> voucher;
}
