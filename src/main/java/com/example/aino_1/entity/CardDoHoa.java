package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "card_do_hoa")
@Entity
public class CardDoHoa {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_card", nullable = false, length = 255)
    private String tenCard;

    @Column(name = "trang_thai")
    private Integer trangThai;  // Cột trạng thái, mặc định là 1
}
