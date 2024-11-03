package com.example.aino_1.serviceInter;

import org.springframework.security.core.userdetails.UserDetails;

public interface JWTServiceInter {
    String generateToken(String username);

    String extractUsername(String token);

    boolean validateToken(String token, UserDetails userDetails);
}
