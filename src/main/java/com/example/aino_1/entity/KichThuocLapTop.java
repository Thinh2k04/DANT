package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "kich_thuoc_laptop")
@Entity
public class KichThuocLapTop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "kich_thuoc", nullable = false)
    private BigDecimal kichThuoc;

    @Column(name = "trang_thai")
    private Integer trangThai;  // Cột trạng thái, mặc định là 1

}
