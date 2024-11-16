//package com.example.aino_1.entity;
//
//import com.example.aino_1.entity.TaiKhoanNguoiDung;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//
//import java.util.Collection;
//import java.util.Collections;
//
////AccountDetail ko mapping mà sẽ xử lý các logic bảo mật nên cần tách riêng
////các phương thức được ghi đè trong này sẽ được loadUserByUsername trong AccountServiceImpl xử lý
//public class TaiKhoanNguoiDungDetail implements UserDetails {
//    private TaiKhoanNguoiDung tknd;
//
//    public TaiKhoanNguoiDungDetail(TaiKhoanNguoiDung tknd) {
//        this.tknd = tknd;
//    }
//
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));
//    }
//
//    @Override
//    public String getPassword() {
//        return tknd.getMatKhau();
//    }
//
//    @Override
//    public String getUsername() {
//        return tknd.getTenTaiKhoan();
//    }
//
//    @Override
//    public boolean isAccountNonExpired() {
//        return true;
//    }
//
//    @Override
//    public boolean isAccountNonLocked() {
//        return true;
//    }
//
//    @Override
//    public boolean isCredentialsNonExpired() {
//        return true;
//    }
//
//    @Override
//    public boolean isEnabled() {
//        return true;
//    }
//}
