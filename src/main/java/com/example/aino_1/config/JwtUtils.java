package com.example.aino_1.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {
    private static final String SECRET = "7f6b9cdab9fa82f1e2f63b9f5f3b217f8aadd92b20be30b6f4d69cdeb8325423";

    public static String generateToken(String username, String role) {
        // Gán role với tiền tố "ROLE_" theo yêu cầu của Spring Security
        String roleWithPrefix = "ROLE_" + role;


        // Log thông tin trước khi tạo token
        System.out.println("JwtUtils báo Generating token for USER: " + username + " with role: " + roleWithPrefix);

        return JWT.create()
                .withSubject(username)  // Lưu trữ username
                .withClaim("role", roleWithPrefix)  // Lưu trữ role
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // Token có hiệu lực 1 giờ
                .sign(Algorithm.HMAC256(SECRET));  // Tạo token với secret key
    }


    public Map<String, Object> validateToken(String token) {
        try {
            // Xác thực và giải mã token
            DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC256(SECRET))
                    .build()
                    .verify(token);  // Xác thực và giải mã token

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

        } catch (Exception e) {
            System.out.println("JwtUtils báo Lỗi khi giải mã token: " + e.getMessage());
            return null; // Trả về null nếu có lỗi
        }
    }


}
