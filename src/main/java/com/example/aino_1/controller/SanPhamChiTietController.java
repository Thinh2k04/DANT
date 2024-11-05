package com.example.aino_1.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SanPhamChiTietController {
    @GetMapping("/hello")
    public String hello(){
        return "layout/index.html";
    }

}
