package com.example.aino_1.service;

import com.example.aino_1.repository.HoaDonInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

@Service
public class OrderCodeGenerator {

    @Autowired
    private HoaDonInterface hoaDonInterface;

    /**
     * Kiểm tra và tạo mã đơn hàng không trùng.
     */
    public String generateUniqueOrderCode() {
        String orderCode;
        do {
            orderCode = generateOrderCodeWithTimestamp(); // Tạo mã mới
        } while (hoaDonInterface.findHoaDonByMaHoaDon(orderCode) != null); // Kiểm tra mã trong CSDL
        return orderCode;
    }

    /**
     * Tạo mã đơn hàng với timestamp và số ngẫu nhiên.
     */
    private static String generateOrderCodeWithTimestamp() {
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String randomStr = String.format("%04d", new Random().nextInt(10000)); // Tạo số ngẫu nhiên 4 chữ số
        return "ORD-" + timestamp + "-" + randomStr;
    }
}
