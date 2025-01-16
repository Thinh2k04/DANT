package com.example.aino_1.dto;

import com.example.aino_1.entity.GioHangChiTiet;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GHCTDTO {

    private int id;
    private String tenSanPham;
    private String hinhAnhMinhHoa;
    private Integer soLuong;
    private Float donGia;

    // Phương thức chuyển từ GioHangChiTiet sang GHCTDTO
    public static GHCTDTO fromEntity(GioHangChiTiet entity) {
        GHCTDTO dto = new GHCTDTO();
        dto.setId(entity.getId());
        dto.setTenSanPham(entity.getSanPhamChiTiet().getSanPham().getTenSanPham()); // Lấy tên sản phẩm từ SanPhamChiTiet
        dto.setHinhAnhMinhHoa(entity.getSanPhamChiTiet().getHinhAnhMinhHoa()); // Lấy hình ảnh minh họa
        dto.setSoLuong(entity.getSoLuong());
        dto.setDonGia(entity.getDonGia());
        return dto;
    }
}
