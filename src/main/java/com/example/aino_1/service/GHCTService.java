package com.example.aino_1.service;


import com.example.aino_1.dto.GHCTDTO;
import com.example.aino_1.entity.GioHangChiTiet;
import com.example.aino_1.repository.GioHangChiTietInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GHCTService {

    @Autowired
    GioHangChiTietInterface gioHangChiTietInterface;


    public List<GHCTDTO> getGioHangChiTiet(String username) {
        // Lấy danh sách GioHangChiTiet từ cơ sở dữ liệu dựa trên tên người dùng
        List<GioHangChiTiet> list = gioHangChiTietInterface.findGioHangChiTietByTaiKhoanNguoiDungUsername(username);

        // Chuyển đổi danh sách từ entity sang DTO
        List<GHCTDTO> listDto = new ArrayList<>();
        for (GioHangChiTiet entity : list) {
            listDto.add(GHCTDTO.fromEntity(entity));
        }

        return listDto;
    }



}
