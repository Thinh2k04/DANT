package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "message")
@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "id_phien_chat")
    private int idPhienChat;

    @Column(name = "ten_nguoi_gui")
    private String tenNguoiGui; // Tên người gửi (khách hàng/nhân viên)

    @Column(name = "noi_dung")
    private String noiDung;    // Nội dung tin nhắn

    @Column(name = "timestamp")
    private LocalDateTime timestamp; // Thời gian gửi tin nhắn

    @Column(name = "nguoi_gui_di")
    private boolean nguoiGuiDi; // true: khách hàng, false: nhân viên

}
