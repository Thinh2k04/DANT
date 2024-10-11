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

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ram")
@Entity
public class Ram {
    @Id
    /*trường id cứ là số thì tự động tăng hết kẻo gặp lỗi phải đặt id trước khi persist
    /còn ko thì hoặc là đặt thủ công hoặc gọi ra từ api*/
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_so")
    private Integer maSo;
    @Column(name = "dung_luong")
    private Integer dungLuong;
    @Column(name = "toc_do")
    private Integer tocDo;
    @ManyToOne
    @JoinColumn(name = "id_sp")
    private SanPham sanPham;
}
