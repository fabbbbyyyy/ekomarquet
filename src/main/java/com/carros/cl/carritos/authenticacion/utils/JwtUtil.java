package com.carros.cl.carritos.authenticacion.utils;

import com.carros.cl.carritos.authenticacion.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 horas

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Usuario usuario) {
        return Jwts.builder()
                .setSubject(usuario.getCorreo())
                .claim("rolId", usuario.getRol().getId())
                .claim("userId", usuario.getId())
                .claim("nombre", usuario.getNombre()) // Agrega el nombre al JWT
                .claim("apellido", usuario.getApellido()) // Agrega el apellido al JWT
                .claim("rut", usuario.getRut()) // Agrega el rut al JWT
                .claim("email", usuario.getCorreo()) // Agrega el correo explícitamente como claim
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenValid(String token, Usuario usuario) {
        final String correo = getClaims(token).getSubject();
        return (correo.equals(usuario.getCorreo()) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token) {
        final Date expiration = getClaims(token).getExpiration();
        return expiration.before(new Date());
    }
}
