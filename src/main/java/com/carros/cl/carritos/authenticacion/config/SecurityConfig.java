package com.carros.cl.carritos.authenticacion.config;

import com.carros.cl.carritos.authenticacion.utils.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/index.html",
                    "/",
                    "/login.html",
                    "/css/**",
                    "/js/**",
                    "/images/**","/fonts/**",
                    "/api/v1/auth/login",
                    "/favicon.ico","/api/v1/usuarios/registro"
                ).permitAll()
                .requestMatchers("/*.html").permitAll()
                .requestMatchers("/dashboard.html").permitAll()
                // Permisos usuarios sobre /api/v1/usuarios/**
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/usuarios/**").hasAuthority("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/usuarios/**").hasAuthority("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/v1/usuarios/**").hasAuthority("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/v1/usuarios/**").hasAuthority("ADMIN")
                // Permisos docentes sobre /api/v1/docentes/**
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/docentes/**").hasAuthority("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/docentes/**").hasAuthority("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/v1/docentes/**").hasAuthority("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/v1/docentes/**").hasAuthority("ADMIN")
                // Permisos carros sobre /api/v1/carros/**
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/carros/**").hasAuthority("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/carros/**").hasAuthority("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/v1/carros/**").hasAuthority("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/v1/carros/**").hasAuthority("ADMIN")
                 // Permisos carros sobre /api/v1/carros/**
                 .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/registro-carros/**").hasAuthority("ADMIN")
                 .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/registro-carros/**").hasAuthority("ADMIN")
                 .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/v1/registro-carros/**").hasAuthority("ADMIN")
                 .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/v1/registro-carros/**").hasAuthority("ADMIN")
                // El resto requiere autenticación (usuarios normales pueden ver otras páginas protegidas)
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
