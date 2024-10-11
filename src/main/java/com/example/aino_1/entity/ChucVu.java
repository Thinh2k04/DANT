package com.example.aino_1.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
@Table(name = "chuc_vu")
@Entity
public class ChucVu {
    @Id
    @Column(name = "ma_chuc_vu")
    private String maChucVu;
    @Column(name = "vai_tro")
    private String vaiTro;
    //jsonignore để tránh vòng lặp vô hạn khi mapping 2 chiều
    @JsonIgnore
    @OneToMany(mappedBy = "chucVu")
    List<TaiKhoanNguoiDung> taiKhoanNguoiDung;
}
