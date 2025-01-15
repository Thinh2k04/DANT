package com.example.aino_1.dto;

import com.example.aino_1.entity.ThongTinTaiKhoan;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThongTinTaiKhoanDTO {
    private Integer idTaiKhoan;
    private String hoTen;
    private String diaChi;
    private String soDienThoai;
    private String email;

    // Phương thức tĩnh chuyển đổi từ ThongTinTaiKhoan sang DTO
    public static ThongTinTaiKhoanDTO fromEntity(ThongTinTaiKhoan entity) {
        ThongTinTaiKhoanDTO dto = new ThongTinTaiKhoanDTO();
        dto.setIdTaiKhoan(entity.getId());
        dto.setHoTen(entity.getHoTen());
        dto.setDiaChi(entity.getDiaChi());
        dto.setSoDienThoai(entity.getSoDienThoai());
        dto.setEmail(entity.getEmail());
        return dto;
    }
}

