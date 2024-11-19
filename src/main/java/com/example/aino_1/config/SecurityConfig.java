//package com.example.aino_1.config;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.web.servlet.FilterRegistrationBean;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Lazy;
//import org.springframework.core.Ordered;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.AuthenticationProvider;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//@Configuration
//@EnableWebSecurity //dùng filter chain tùy chỉnh thay cho mặc định
//@EnableMethodSecurity
//public class SecurityConfig {
//    @Autowired
//    @Lazy
//    private UserDetailsService userDetailsService;
//    @Autowired
//    private JWTFilter jwtFilter;
//
//    @Bean
//    //bộ lọc áp dụng cho http request được spring container quản lý
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        //csrf token là đoạn mã đi kèm xác thực cho post put delete
//        return http
//                .csrf(cs -> cs.disable()) //tắt csrf protection
//                .authorizeHttpRequests(r -> r
//                        /*ko yêu cầu xác thực cho 2 request này (ko chỉ phục vụ cho mục đích test, mà còn vì trong thực tế
//                        yêu cầu xác thực mới cho đăng ký hay đăng nhập là ngu*/
//                        .requestMatchers("/rest/tai_khoan_nguoi_dung/register",
//                                "/rest/tai_khoan_nguoi_dung/login",
//                                "/rest/san_pham_chi_tiet/getAll",
//                                "/rest/san_pham_chi_tiet/getById/{id}",
//                                "/rest/san_pham_chi_tiet/tim_kiem/{tuKhoaTimKiem}",
//                                "rest/ram/getAll",
//                                "/rest/cpu/getAll",
//                                "/rest/gpu/getAll",
//                                "/rest/man_hinh/getAll",
//                                "/rest/o_luu_tru/getAll",
//                                "/rest/o_luu_tru/getAll",
//                                "/rest/san_pham/getAll",
//                          "   /rest/ram/getAll",
//                                "/services.giaohangtietkiem.vn/services/shipment/fee"
//                                )
//                        .permitAll()
//                        //hiển thị trang chủ thì ko yêu cầu xác thực nên cần permit cho đống dưới
//                        //còn lại request nào cũng cần xác thực mới cho phép
//                        .anyRequest().authenticated())
//                //http.formLogin(Customizer.withDefaults()); //xác thực bằng gửi biểu mẫu yêu cầu đăng nhập
//                //xác thực mặc định, gửi thông tin đăng nhập được mã hóa đi kèm với request (để có thể test trên postman)
//                .httpBasic(Customizer.withDefaults())
//                /*ko lưu trữ phiên nên form đăng nhập ko còn tác dụng (ko cmt lại thì httpBasic ko hoạt động)
//                mà sẽ yêu cầu thông tin đăng nhập kèm theo request (dùng httpBasic)*/
//                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                /*addFilterBefore để dùng bộ lọc jwtFilter trước khi dùng bộ lọc UsernamePasswordAuthenticationFilter
//                tức là nếu có jwt thì khỏi xác thực tk mk*/
//                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
//                .build(); //chạy phương thức bảo mật
//    }
//
//    @Bean
//    //định nghĩa phương thức kiểm tra xác thực người dùng có hợp lệ hay ko dựa trên tk mk
//    public AuthenticationProvider authenticationProvider() {
//        //lấy thông tin tk từ csdl được mapping qua entity Account và so sánh mk
//        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
//        /*mỗi khi người dùng nhập mk vào form, mk đó sẽ được băm ra rồi so sánh với mã
//        băm trong csdl, nếu như ko dùng thì sẽ ko băm, thứ được so sánh với mk băm trong
//        csdl là văn bản thuần túy chứ ko phải mk được băm, số vòng băm khác nhau ko ảnh
//        hưởng gì song vẫn nên cùng sd 2^12 (test với postman thì cũng tương tự)
//        */
//        provider.setPasswordEncoder(new BCryptPasswordEncoder(12));
//        provider.setUserDetailsService(userDetailsService);
//        return provider;
//    }
//
//    @Bean
//    //xử lý xác thực (login được hay ko sẽ đưa sang hành động khác nhau)
//    //khi khởi động spring tạo ra 1 instance của AuthenticationManager
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//        return config.getAuthenticationManager();
//    }
//
//    @Bean
//    public FilterRegistrationBean corsFilter() {
//        FilterRegistrationBean bean = new FilterRegistrationBean(new CORSFilter());
//        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
//        return bean;
//    }
//}
