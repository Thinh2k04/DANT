package com.example.aino_1.dto;

import com.example.aino_1.entity.Imei;
import com.example.aino_1.entity.SanPhamChiTiet;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class HDCTDTO {
    private String tenSanPham;
    private int soLuong;
    private float donGia;
    private String hinhAnhMinhHoa;
    private List<String> listImei ;
}
