package com.example.aino_1.config;
import org.springframework.security.authentication.AbstractAuthenticationToken;
public class JwtAuthenticationToken extends AbstractAuthenticationToken{
    private final String username;
    private final String token;

    public JwtAuthenticationToken(String username, String token) {
        super(null);
        this.username = username;
        this.token = token;
        setAuthenticated(false);
    }

    @Override
    public Object getCredentials() {
        return token;
    }

    @Override
    public Object getPrincipal() {
        return username;
    }
}
