package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hoa_don")
public class HoaDon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_ttkh", nullable = false)
    private ThongTinTaiKhoan thongTinTaiKhoan;  // Liên kết với bảng thong_tin_tai_khoan

    @Column(name = "thoi_gian_lap_hoa_don", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date thoiGianLapHoaDon;  // Thời gian lập hóa đơn

    @Column(name = "tong_tien", nullable = false)
    private Float tongTien;  // Tổng tiền của hóa đơn

    @ManyToOne
    @JoinColumn(name = "hinh_thuc_thanh_toan", nullable = false)
    private HinhThucThanhToan hinhThucThanhToan;  // Liên kết với bảng hinh_thuc_thanh_toan

    @Column(name = "dia_chi_nhan_hang", nullable = true, length = 255)
    private String diaChiNhanHang;  // Địa chỉ nhận hàng

    @ManyToOne
    @JoinColumn(name = "id_cua_hang", nullable = false)
    private CuaHang cuaHang;  // Liên kết với bảng cua_hang

    @ManyToOne
    @JoinColumn(name = "id_voucher", nullable = true)
    private Voucher voucher;  // Liên kết với bảng voucher, có thể NULL

    @Column(name = "trang_thai_thanh_toan", nullable = false)
    private Integer trangThaiThanhToan;  // Trạng thái thanh toán, mặc định là 0

    @Column(name = "trang_thai", nullable = false)
    private Integer trangThai;  // Trạng thái thanh toán, mặc định là 0
}
