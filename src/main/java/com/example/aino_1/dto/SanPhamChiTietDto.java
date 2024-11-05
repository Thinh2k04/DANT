package com.example.aino_1.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SanPhamChiTietDto {
    private Integer id;
    private BigDecimal donGia;
    private String tenSanPham;
    private String hangSanXuat;
    private String mauSac;
    private String gioiThieu;
    private Integer dungLuongRam;
    private Integer dungLuongO;
    private String doPhanGiai;
    private BigDecimal kichThuoc;
    private String tamNen;
    private Integer tanSoQuet;
    private Integer soNhan;
    private String kienTrucCongNghe;
    private String tenCpu;
}
