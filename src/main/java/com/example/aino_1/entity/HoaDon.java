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
    @JoinColumn(name = "id_ttkh", referencedColumnName = "id")
    private ThongTinTaiKhoan thongTinTaiKhoan;

    @Column(name = "thoi_gian_lap_hoa_don", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date thoiGianLapHoaDon;

    @Column(name = "tong_tien", nullable = false)
    private Float tongTien;

    @ManyToOne
    @JoinColumn(name = "hinh_thuc_thanh_toan", referencedColumnName = "id", nullable = false)
    private HinhThucThanhToan hinhThucThanhToan;

    @Column(name = "dia_chi_nhan_hang", nullable = false, length = 255)
    private String diaChiNhanHang;

    @ManyToOne
    @JoinColumn(name = "id_cua_hang", referencedColumnName = "id")
    private CuaHang cuaHang;

    @ManyToOne
    @JoinColumn(name = "id_voucher", referencedColumnName = "id")
    private Voucher voucher;

    @Column(name = "trang_thai", nullable = false, length = 20)
    private String trangThai = "Chờ thanh toán";  // Giá trị mặc định là 'Chờ thanh toán'

}
