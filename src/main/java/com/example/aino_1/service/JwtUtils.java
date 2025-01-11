package com.example.aino_1.service;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.aino_1.config.JwtDecoder;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {

    private final JwtDecoder jwtDecoder;

    public JwtUtils(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    private static final String SECRET = "7f6b9cdab9fa82f1e2f63b9f5f3b217f8aadd92b20be30b6f4d69cdeb8325423";

    public static String generateToken(String username, String role) {
        // Gán role với tiền tố "ROLE_" theo yêu cầu của Spring Security
        String roleWithPrefix = "ROLE_" + role;

        // Log thông tin trước khi tạo token
        System.out.println("JwtUtils báo Generating token for USER: " + username + " with role: " + roleWithPrefix);

        return com.auth0.jwt.JWT.create()
                .withSubject(username) // Lưu trữ username
                .withClaim("role", roleWithPrefix) // Lưu trữ role
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // Token có hiệu lực 1 giờ
                .sign(com.auth0.jwt.algorithms.Algorithm.HMAC256(SECRET)); // Tạo token với secret key
    }

    /**
     * Xác thực và trích xuất thông tin từ token
     *
     * @param token JWT token cần xác thực
     * @return Map<String, Object> thông tin giải mã hoặc null nếu token không hợp lệ
     */

    public Map<String, Object> validateToken(String token) {
        DecodedJWT decodedJWT = jwtDecoder.decodeToken(token); // Sử dụng JwtDecoder để giải mã token
        if (decodedJWT == null) {
            return null; // Trả về null nếu token không hợp lệ
        }

        // Trích xuất thông tin từ token
        String username = decodedJWT.getSubject(); // Lấy username từ subject
        String role = decodedJWT.getClaim("role").asString(); // Lấy role từ claim "role"
        Date issuedAt = decodedJWT.getIssuedAt(); // Thời gian tạo token
        Date expiresAt = decodedJWT.getExpiresAt(); // Thời gian hết hạn token

        if (username == null) {
            System.out.println("JwtUtils báo Token không chứa username");
            return null;
        }

        // Log thông tin đã giải mã
        System.out.println("JwtUtils báo Token hợp lệ cho user: " + username);
        System.out.println("Role: " + role);
        System.out.println("Issued at: " + issuedAt);
        System.out.println("Expires at: " + expiresAt);

        // Trả về thông tin đã giải mã dưới dạng Map
        Map<String, Object> tokenDetails = new HashMap<>();
        tokenDetails.put("username", username);
        tokenDetails.put("role", role);
        tokenDetails.put("issuedAt", issuedAt);
        tokenDetails.put("expiresAt", expiresAt);

        return tokenDetails;
    }
}
