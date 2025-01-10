package com.example.aino_1.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "review")
@Entity
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "tai_khoan_id", referencedColumnName = "id")
    private TaiKhoanNguoiDung taiKhoanNguoiDung; // Người đánh giá

    @OneToOne
    @JoinColumn(name = "hoa_don_chi_tiet_id", referencedColumnName = "id")
    private HoaDonChiTiet hoaDonChiTiet; // Hóa đơn chi tiết liên quan

    @Column
    private Integer rating; // Số sao (1-5)

    @Column
    private String comment; // Nội dung đánh giá

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime reviewDate; // Thời gian đánh giá

}
