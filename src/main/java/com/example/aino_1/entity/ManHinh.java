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

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "man_hinh")
@Entity
public class ManHinh {
    @Id
    /*trường id cứ là số thì tự động tăng hết kẻo gặp lỗi phải đặt id trước khi persist
    /còn ko thì hoặc là đặt thủ công hoặc gọi ra từ api*/
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_so")
    private Integer maSo;
    @Column(name = "kich_thuoc", precision = 3, scale = 1)
    private BigDecimal kichThuoc;
    @Column(name = "do_phan_giai")
    private String doPhanGiai;
    @Column(name = "tan_so_quet")
    private Integer tanSoQuet;
    @Column(name = "tam_nen")
    private String tamNen;
    @Column(name = "do_sang")
    private Integer doSang;
    @Column(name = "ty_le_man_hinh")
    private String tyLeManHinh;
    @Column(name = "do_phu_mau", precision = 3, scale = 1)
    private BigDecimal doPhuMau;
    //jsonignore để tránh vòng lặp vô hạn khi mapping 2 chiều
    @JsonIgnore
    @OneToMany(mappedBy = "manHinh")
    List<SanPhamChiTiet> spct;
}
