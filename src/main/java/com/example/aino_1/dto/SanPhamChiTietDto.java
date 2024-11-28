package com.example.aino_1.dto;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class SanPhamChiTietDto {
    private Integer id;
    private Integer soLuong;
    private String tenSanPham;
    private String chatLieu;
    private String gioiThieu;
    private Integer dungLuongRam;
    private Integer dungLuong;
    private String doPhanGiai;
    private Float kichThuocLaptop;
    private String tamNen;
    private Integer tanSoQuet;
    private Integer soNhan;
    private String kienTrucCongNghe;
    private String tenCPU;
    private String maSpct; // Thêm trường mã sản phẩm chi tiết
    private String hinhAnhMinhHoa;
    private Float donGia;
    private Integer idSanPham;
    private String gpu;
    private Float trongLuong;
    private Integer pin;
    private String thoiHanBaoHanh; 
    // Phương thức tạo tên sản phẩm chi tiết
    public String getTenSanPhamChiTiet() {
        return String.format(
                "Laptop %s %s/%dGB/%dGB/%.1f\" %s/Win11",
                this.tenSanPham,
                this.tenCPU,
                this.dungLuongRam,
                this.dungLuong,
                this.kichThuocLaptop,
                this.doPhanGiai
        );
    }
}
