package com.aduanas.cl.aduanas.authenticacion.config;

import com.aduanas.cl.aduanas.authenticacion.utils.JwtAuthenticationFilter;
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
                .requestMatchers("/usuarios.html").permitAll()
                // Solo admin puede acceder a la API de usuarios
                .requestMatchers("/api/v1/usuarios/**").hasAuthority("ADMIN")
                // Permitir GET de trámites a admin, viajero, transportista, inspector y funcionario
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/tramites/**").hasAnyAuthority("ADMIN", "INSPECTOR", "FUNCIONARIO")
                // Permitir POST/PUT/DELETE solo a admin, viajero y transportista
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/tramites/**").hasAnyAuthority("ADMIN", "VIAJERO", "TRANSPORTISTA")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/v1/tramites/**").hasAnyAuthority("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/v1/tramites/**").hasAnyAuthority("ADMIN")
                // Permitir PATCH solo a admin, inspector y funcionario
                .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/v1/tramites/**").hasAnyAuthority("ADMIN", "INSPECTOR", "FUNCIONARIO")
                // El resto requiere autenticación (usuarios normales pueden ver otras páginas protegidas)
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
