package com.example.aino_1.dto;

import com.example.aino_1.entity.HoaDon;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HoaDonDTO {
    private String maHoaDon;
    private String tenCuaHang;
    private LocalDateTime thoiGianLapHoaDon;
    private Float tongTien;
    private Float phiVanChuyen;
    private String hinhThucThanhToan;
    private String diaChiNhanHang;
    private String cuaHang;
    private Integer trangThaiThanhToan;
    private Integer trangThai;

    // Phương thức tĩnh chuyển đổi từ HoaDon sang HoaDonDTO
    public static HoaDonDTO fromEntity(HoaDon hoaDon) {
        HoaDonDTO dto = new HoaDonDTO();
        dto.setMaHoaDon(hoaDon.getMaHoaDon());
        dto.setTenCuaHang(hoaDon.getCuaHang().getTenCuaHang());
        dto.setThoiGianLapHoaDon(
                hoaDon.getThoiGianLapHoaDon().toInstant()
                        .atZone(ZoneId.systemDefault()).toLocalDateTime());
        dto.setTongTien(hoaDon.getTongTien());
        dto.setPhiVanChuyen(hoaDon.getPhiVanChuyen());
        dto.setHinhThucThanhToan(hoaDon.getHinhThucThanhToan().getTenHinhThuc());
        dto.setDiaChiNhanHang(hoaDon.getDiaChiNhanHang());
        dto.setCuaHang(hoaDon.getCuaHang().getTenCuaHang());
        dto.setTrangThaiThanhToan(hoaDon.getTrangThaiThanhToan());
        dto.setTrangThai(hoaDon.getTrangThai());
        return dto;
    }
}
