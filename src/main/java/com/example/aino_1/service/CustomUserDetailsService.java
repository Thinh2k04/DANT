package com.example.aino_1.service;

import com.example.aino_1.entity.TaiKhoanNguoiDung;
import com.example.aino_1.repository.TaiKhoanNguoiDungInterface;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final TaiKhoanNguoiDungInterface taiKhoanNguoiDungRepository;

    public CustomUserDetailsService(TaiKhoanNguoiDungInterface taiKhoanNguoiDungRepository) {
        this.taiKhoanNguoiDungRepository = taiKhoanNguoiDungRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        TaiKhoanNguoiDung user = taiKhoanNguoiDungRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getChucVu()) // "USER" hoặc "ADMIN"
                .build();
    }
}
