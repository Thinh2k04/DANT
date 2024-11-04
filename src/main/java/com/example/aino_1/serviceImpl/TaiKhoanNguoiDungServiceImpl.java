package com.example.aino_1.serviceImpl;

import com.example.aino_1.entity.TaiKhoanNguoiDungDetail;
import com.example.aino_1.entity.TaiKhoanNguoiDung;
import com.example.aino_1.repository.TaiKhoanNguoiDungInterface;
import com.example.aino_1.serviceInter.JWTServiceInter;
import com.example.aino_1.serviceInter.TaiKhoanNguoiDungServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

//dựa trên cách quản lý bean của spring thì service phải đặt annotation ở tầng implements
@Service
public class TaiKhoanNguoiDungServiceImpl implements TaiKhoanNguoiDungServiceInter, UserDetailsService {
    @Autowired
    TaiKhoanNguoiDungInterface tkndi;
    @Autowired
    /*trì hoãn việc khởi tạo bean lập tức, chỉ khởi tạo khi được yêu cầu tới
    tránh lỗi vòng lặp phụ thuộc, nên dùng cho bean ít được gọi tới hơn*/
    @Lazy
    AuthenticationManager aum;
    @Autowired
    @Lazy
    JWTServiceInter js;

    @Override
    public String verify(TaiKhoanNguoiDung tknd) {
        Authentication auth =
                //thực hiện xác thực với instance đã được tiêm vào
                aum.authenticate(new UsernamePasswordAuthenticationToken(tknd.getTenTaiKhoan(), tknd.getMatKhau()));
        //khi login sẽ kiểm tra auth có được xác thực hay ko(tk mk có đúng hay ko)
        if (auth.isAuthenticated()) {
            return js.generateToken(tknd.getTenTaiKhoan());
        } else {
            return "fail";
        }
    }

    //ghi đè phương thức từ UserDetailsService
    //UserDetailsService được dùng trong AuthenticationProvider trong SecurityConfig
    @Override
    //lấy ra tk từ tên đăng nhập
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<TaiKhoanNguoiDung> tknd = Optional.ofNullable(tkndi.findByUsername(username));
        if (tknd == null) {
            System.out.println("404 not found!");
            throw new UsernameNotFoundException("404 not found!");
        }
        return new TaiKhoanNguoiDungDetail(tknd.get());
    }

    /*đặt số vòng băm là 2^12 vòng, số vòng ko có tác dụng chống brute-force
        nhưng có thể tăng thời gian xử lý của mỗi lần brute-force*/
    private BCryptPasswordEncoder e = new BCryptPasswordEncoder(12);

    @Override
    public List<TaiKhoanNguoiDung> read() {
        return tkndi.findAll();
    }

    @Override
    public TaiKhoanNguoiDung create(TaiKhoanNguoiDung tknd) {
        tknd.setMatKhau(e.encode(tknd.getMatKhau()));
        tknd.setMatKhau(tknd.getMatKhau());
        return tkndi.save(tknd);
    }

    @Override
    public TaiKhoanNguoiDung update(TaiKhoanNguoiDung taiKhoanNguoiDung) {
        return tkndi.save(taiKhoanNguoiDung);
    }

    @Override
    public void delete(Integer id) {
        tkndi.deleteById(id);
    }

}
