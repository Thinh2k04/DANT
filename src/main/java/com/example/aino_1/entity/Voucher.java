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
    private String maVoucher;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    @Column(name = "thoi_gian_hen_ket", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date thoiGianHenKet;

    @Column(name = "so_tien_toi_da")
    private Float soTienToiDa;

    @Column(name = "dieu_kien_ap_dung", nullable = false)
    private Float dieuKienApDung;

    @Column(name = "so_tien_ap_dung")
    private Float soTienApDung;

    @Column(name = "phan_tram_ap_dung")
    private Float phanTramApDung;

    @Column(name = "thoi_gian_ap_dung", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date thoiGianApDung;

    // Kiểm tra ràng buộc điều kiện áp dụng
    @PrePersist
    public void checkVoucherConditions() {
        if ((soTienApDung != null && phanTramApDung == null) || (soTienApDung == null && phanTramApDung != null)) {
            return;  // Điều kiện hợp lệ
        } else {
            throw new IllegalArgumentException("Voucher phải giảm giá theo một trong hai phương thức: số tiền hoặc phần trăm.");
        }
    }
}