package com.example.aino_1.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "gpu")
@Entity
public class Gpu {
    @Id
    /*trường id cứ là số thì tự động tăng hết kẻo gặp lỗi phải đặt id trước khi persist
    /còn ko thì hoặc là đặt thủ công hoặc gọi ra từ api*/
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_so")
    private Integer maSo;
    @Column(name = "hang_san_xuat")
    private String hangSanXuat;
    @Column(name = "xung_nhip_toi_thieu")
    private Integer xungNhipToiThieu;
    @Column(name = "xung_nhip_toi_da")
    private Integer xungNhipToiDa;
    @Column(name = "vram")
    private Integer vram;
    @Column(name = "dien_ap")
    private Integer dienAp;
    @Column(name = "kien_truc_cong_nghe")
    private String kienTrucCongNghe;
    @Column(name = "ten")
    private String ten;
    //jsonignore để tránh vòng lặp vô hạn khi mapping 2 chiều
    @JsonIgnore
    @OneToMany(mappedBy = "gpu")
    List<SanPhamChiTiet> spct;
}
