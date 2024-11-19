package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "voucher")
@Entity
public class Voucher {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma_voucher", nullable = false, length = 100)
    private String maVoucher;  // Mã voucher

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;  // Số lượng voucher có sẵn

    @Column(name = "thoi_gian_hen_ket", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date thoiGianHenKet;  // Thời gian hết hạn của voucher

    @Column(name = "so_tien_toi_da")
    private Float soTienToiDa;  // Số tiền tối đa có thể áp dụng cho 1 đơn hàng

    @Column(name = "dieu_kien_ap_dung", nullable = false)
    private Float dieuKienApDung;  // Điều kiện áp dụng (giá trị tối thiểu của hóa đơn)

    @Column(name = "so_tien_ap_dung")
    private Float soTienApDung;  // Số tiền giảm (có thể NULL nếu giảm theo %)

    @Column(name = "phan_tram_ap_dung")
    private Float phanTramApDung;  // Phần trăm giảm giá (có thể NULL nếu giảm theo số tiền)

    @Column(name = "thoi_gian_ap_dung", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date thoiGianApDung;  // Thời gian voucher được áp dụng

    @Column(name = "trang_thai")
    private Integer trangThai;  // Trạng thái của voucher
}