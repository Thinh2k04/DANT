package com.example.aino_1.dto;


public class ThongKeDTO {
    private String mocTG;
    private Double tongTien;

    public ThongKeDTO(String mocTG, Double tongTien) {
        this.mocTG = mocTG;
        this.tongTien = tongTien;
    }

    // Getters and Setters
    public String getMocTG() {
        return mocTG;
    }

    public void setMocTG(String mocTG) {
        this.mocTG = mocTG;
    }

    public Double getTongTien() {
        return tongTien;
    }

    public void setTongTien(Double tongTien) {
        this.tongTien = tongTien;
    }
}

