package com.example.aino_1.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.stereotype.Component;

@Component
public class JwtDecoder {
    private static final String SECRET = "7f6b9cdab9fa82f1e2f63b9f5f3b217f8aadd92b20be30b6f4d69cdeb8325423";

    /**
     * Giải mã token
     *
     * @param token JWT token cần giải mã
     * @return DecodedJWT đối tượng sau khi giải mã hoặc null nếu không hợp lệ
     */
    public DecodedJWT decodeToken(String token) {
        try {
            return JWT.require(Algorithm.HMAC256(SECRET))
                    .build()
                    .verify(token);
        } catch (JWTVerificationException e) {
            System.out.println("JwtDecoder báo Lỗi khi giải mã token: " + e.getMessage());
            return null; // Trả về null nếu giải mã thất bại
        }
    }
}
