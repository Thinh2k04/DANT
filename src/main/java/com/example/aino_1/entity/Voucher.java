package com.example.aino_1.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "voucher")
@Entity
public class Voucher {
    @Id
    /*trường id cứ là số thì tự động tăng hết kẻo gặp lỗi phải đặt id trước khi persist
    /còn ko thì hoặc là đặt thủ công hoặc gọi ra từ api*/
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "ma_voucher")
    private String maVoucher;
    //0.11 ~ 0.99 tương đương 1 ~ 99%
    @Column(name = "giam_gia", precision = 3, scale = 2)
    private BigDecimal giamGia;
    //tổng gt hđ trước khi áp dụng bất cứ voucher nào khác và sau khi làm tròn >= con số này
    @Column(name = "dieu_kien_ap_dung")
    private Integer dieuKienApDung;
    //ngày cuối cùng còn dùng được voucher
    @Column(name = "thoi_gian_ap_dung")
    private LocalDateTime thoiGianApDung;
    @ManyToOne
    @JoinColumn(name = "id_don_hang")
    private DonHang donHang;
}
