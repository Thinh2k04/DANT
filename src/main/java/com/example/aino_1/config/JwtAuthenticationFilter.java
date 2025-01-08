package com.example.aino_1.config;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.example.aino_1.service.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {
        // Lấy token từ header Authorization
        String header = request.getHeader("Authorization");
        System.out.println("JwtAuthenticationFilter: Token from request header: " + header);

        if (header != null ) {
            System.out.println("JwtAuthenticationFilter: Chạy vào if");
            String token = header; // Loại bỏ "Bearer " để lấy token

            try {
                // Giải mã và xác thực token
                Map<String, Object> tokenDetails = jwtUtils.validateToken(token);
                if (tokenDetails != null) {
                    String username = (String) tokenDetails.get("username");
                    String role = (String) tokenDetails.get("role");

                    System.out.println("JwtAuthenticationFilter: Token is valid for user: " + username);
                    System.out.println("Role from token: " + role);

                    // Tạo danh sách quyền từ role
                    List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));

                    // Tạo Authentication object và thiết lập vào SecurityContext
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            username, null, authorities
                    );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    System.out.println("JwtAuthenticationFilter: Invalid token: unable to parse token details");
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                    return;
                }
            } catch (JWTVerificationException e) {
                // Log lỗi nếu token không hợp lệ hoặc đã hết hạn
                System.out.println("JwtAuthenticationFilter: Error during token validation: " + e.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                return;
            }
        }

        System.out.println("JwtAuthenticationFilter: Không chạy vào if");

        // Tiếp tục chuỗi filter nếu không có lỗi
        filterChain.doFilter(request, response);
    }
}
