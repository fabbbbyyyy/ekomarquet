package com.ecomarket_spa.cl.aduanas.authenticacion.controller;
import com.ecomarket_spa.cl.aduanas.authenticacion.utils.JwtUtil;
import com.ecomarket_spa.cl.aduanas.authenticacion.model.Usuario;
import com.ecomarket_spa.cl.aduanas.authenticacion.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        System.out.println("Intento de login con correo: " + usuario.getCorreo());
        Usuario user = usuarioService.findByCorreo(usuario.getCorreo());
        if (user == null) {
            System.out.println("Usuario no encontrado en la base de datos.");
        } else {
            System.out.println("Usuario encontrado: " + user.getCorreo());
            System.out.println("Contraseña recibida: " + usuario.getContra());
            System.out.println("Contraseña en BD: " + user.getContra());
        }
        if (user != null && user.getContra().equals(usuario.getContra())) {
            String token = jwtUtil.generateToken(user.getCorreo());
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.status(401).body("Credenciales inválidas");
    }

}