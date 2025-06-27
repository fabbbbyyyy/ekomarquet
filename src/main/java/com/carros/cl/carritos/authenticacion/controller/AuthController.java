package com.carros.cl.carritos.authenticacion.controller;

import com.carros.cl.carritos.authenticacion.model.Usuario;
import com.carros.cl.carritos.authenticacion.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        String token = authService.login(usuario.getCorreo(), usuario.getContra());
        if (token != null) {
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.status(401).body("Credenciales inválidas");
    }
}

