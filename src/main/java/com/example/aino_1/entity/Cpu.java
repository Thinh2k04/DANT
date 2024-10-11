package com.example.aino_1.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cpu")
@Entity
public class Cpu {
    @Id
    /*trường id cứ là số thì tự động tăng hết kẻo gặp lỗi phải đặt id trước khi persist
    /còn ko thì hoặc là đặt thủ công hoặc gọi ra từ api*/
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_so")
    private Integer maSo;
    @Column(name = "hang_san_xuat")
    private String hangSanXuat;
    @Column(name = "kien_truc_cong_nghe")
    private String kienTrucCongNghe;
    @Column(name = "toc_do_toi_thieu")
    private Integer tocDoToiThieu;
    @Column(name = "toc_do_toi_da")
    private Integer tocDoToiDa;
    @Column(name = "so_nhan")
    private Integer soNhan;
    @Column(name = "so_luong")
    private Integer soLuong;
    @Column(name = "bo_nho_dem")
    private Integer boNhoDem;
    @Column(name = "ten")
    private String ten;
    /*nếu chỉ truy vấn bảng sp từ bảng linh kiện phục vụ cho chức năng tìm kiếm dựa trên cầu hình sau này
    thì chỉ cần đặt liên kết ở bảng linh kiện (mapping 1 chiều)*/
    @OneToOne
    @JoinColumn(name = "ma_so")
    private SanPham sanPham;
}
