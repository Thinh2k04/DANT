package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "TimelineHoaDon")
@Entity
public class TimelineHoaDon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_hoa_don", referencedColumnName = "id")
    private HoaDon hoaDon;

    private Integer trangThai;

    private Timestamp thoiGianCapNhat;

    private String nguoiCapNhat;

    private String lyDo;

    @Column(name = "role") // Ánh xạ với cột role trong cơ sở dữ liệu
    private String role;
}
