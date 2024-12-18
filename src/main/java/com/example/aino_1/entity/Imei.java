package com.example.aino_1.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "imei")
@Entity
public class Imei {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "id_spct", nullable = false)
    private Integer idSpct;

    @Column(name = "imei", unique = true, nullable = false)
    private String imei;

    @Column(name = "id_hoa_don_chi_tiet", nullable = false)
    private Integer idHDCT;

    @Column(name = "trang_thai", nullable = false)
    private Integer trangThai;

}
