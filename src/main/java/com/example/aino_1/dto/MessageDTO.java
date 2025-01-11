package com.example.aino_1.dto;

import java.time.LocalDateTime;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor

public class MessageDTO {
    private Integer id; // ID tin nhắn
    private Integer idPhienChat; // ID phiên chat
    private String sender; // Tên người gửi (khách hàng hoặc nhân viên)
    private String content; // Nội dung tin nhắn
    private LocalDateTime timestamp; // Thời gian gửi tin nhắn
    private boolean nguoiGuiDi; // true: khách hàng, false: nhân viên
}
