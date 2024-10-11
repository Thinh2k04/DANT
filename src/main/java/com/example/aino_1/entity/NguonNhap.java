package com.example.aino_1.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "nguon_nhap")
@Entity
public class NguonNhap {
    @Id
    @Column(name = "ma_nha_cung_ung")
    private String maNhaCungUng;
    @Column(name = "ten_nha_cung_ung")
    private String tenNhaCungUng;
    @Column(name = "sdt")
    private String sdt;
    @Column(name = "dia_chi")
    private String diaChi;
    @Column(name = "ghi_chu")
    private String ghiChu;
    //jsonignore để tránh vòng lặp vô hạn khi mapping 2 chiều
    @JsonIgnore
    @OneToMany(mappedBy = "nguonNhap")
    List<SanPham> sanPham;
}
