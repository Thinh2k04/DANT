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

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tai_khoan_nguoi_dung")
@Entity
public class TaiKhoanNguoiDung {
    @Id
    /*trường id cứ là số thì tự động tăng hết kẻo gặp lỗi phải đặt id trước khi persist
    /còn ko thì hoặc là đặt thủ công hoặc gọi ra từ api*/
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "ten_tai_khoan")
    private String tenTaiKhoan;
    @Column(name = "mat_khau")
    private String matKhau;
//    cột này thừa thãi nên bỏ đi
//    @Column(name = "vai_tro")
//    private String vaiTro;
    @Column(name = "email")
    private String email;
    @ManyToOne
    @JoinColumn(name = "ma_chuc_vu")
    private ChucVu chucVu;
    //jsonignore để tránh vòng lặp vô hạn khi mapping 2 chiều
    @JsonIgnore
    @OneToMany(mappedBy = "taiKhoanNguoiDung")
    List<DonHang> donHang;
}
