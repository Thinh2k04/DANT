package com.example.aino_1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffDTO {
    private String username;
    private String email;
    private String password;
    private String hoTen;
    private String diaChi;
    private String soCCCD;
    private String soDienThoai;
}
