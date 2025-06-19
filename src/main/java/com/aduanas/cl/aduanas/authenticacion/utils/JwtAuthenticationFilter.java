package com.aduanas.cl.aduanas.authenticacion.utils;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            try {
                Claims claims = jwtUtil.getClaims(token);
                request.setAttribute("claims", claims);
                // Asignar autoridad según el rol extraído del JWT
                Object rolIdObj = claims.get("rolId");
                String authority = "USER";
                if (rolIdObj != null) {
                    String rolStr = rolIdObj.toString();
                    if (rolStr.equals("1") || rolStr.equals("1L")) authority = "ADMIN";
                    else if (rolStr.equals("2") || rolStr.equals("2L")) authority = "INSPECTOR";
                    else if (rolStr.equals("3") || rolStr.equals("3L")) authority = "FUNCIONARIO";
                    else if (rolStr.equals("4") || rolStr.equals("4L")) authority = "VIAJERO";
                    else if (rolStr.equals("5") || rolStr.equals("5L")) authority = "TRANSPORTISTA";
                    else if (rolIdObj instanceof Integer && ((Integer)rolIdObj) == 1) authority = "ADMIN";
                    else if (rolIdObj instanceof Integer && ((Integer)rolIdObj) == 2) authority = "INSPECTOR";
                    else if (rolIdObj instanceof Integer && ((Integer)rolIdObj) == 3) authority = "FUNCIONARIO";
                    else if (rolIdObj instanceof Integer && ((Integer)rolIdObj) == 4) authority = "VIAJERO";
                    else if (rolIdObj instanceof Integer && ((Integer)rolIdObj) == 5) authority = "TRANSPORTISTA";
                }
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        claims.getSubject(), null, Collections.singletonList(new SimpleGrantedAuthority(authority)));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token inválido");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.equals("/index.html") ||
                path.equals("/") ||
                path.equals("/login.html") ||
                path.startsWith("/css/") ||
                path.startsWith("/js/") ||
                path.startsWith("/img/") ||
                path.equals("/api/v1/auth/login");
    }
}
