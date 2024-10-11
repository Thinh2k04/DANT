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
@Table(name = "loai_san_pham")
@Entity
public class LoaiSanPham {
    @Id
    @Column(name = "ma_loai")
    private String maLoai;
    @Column(name = "ten_loai")
    private String tenLoai;
    //jsonignore để tránh vòng lặp vô hạn khi mapping 2 chiều
    @JsonIgnore
    @OneToMany(mappedBy = "loaiSanPham")
    List<SanPham> sanPham;
}
