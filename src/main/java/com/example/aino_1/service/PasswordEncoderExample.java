package com.example.aino_1.service;


import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoderExample {

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    String rawPassword = "123456";
    String encodedPassword = encoder.encode(rawPassword);



}
