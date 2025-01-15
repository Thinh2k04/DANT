package com.example.aino_1.dto;

import com.example.aino_1.entity.TimelineHoaDon;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimelineHoaDonDTO {
    private Integer hoaDonId;
    private Integer trangThai;
    private String nguoiCapNhat;
    private String lyDo;
    private String role; // Thêm thuộc tính role
    private Long thoiGianCapNhat;

    // Phương thức tĩnh chuyển đổi từ TimelineHoaDon sang DTO
    public static TimelineHoaDonDTO fromEntity(TimelineHoaDon timeline) {
        TimelineHoaDonDTO dto = new TimelineHoaDonDTO();
        dto.setHoaDonId(timeline.getHoaDon().getId());
        dto.setTrangThai(timeline.getTrangThai());
        dto.setNguoiCapNhat(timeline.getNguoiCapNhat());
        dto.setLyDo(timeline.getLyDo());
        dto.setRole(timeline.getRole());
        dto.setThoiGianCapNhat(timeline.getThoiGianCapNhat().getTime());
        return dto;
    }
}

