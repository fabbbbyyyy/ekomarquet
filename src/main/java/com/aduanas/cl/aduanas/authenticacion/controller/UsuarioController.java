package com.aduanas.cl.aduanas.authenticacion.controller;

import com.aduanas.cl.aduanas.authenticacion.model.Usuario;
import com.aduanas.cl.aduanas.authenticacion.service.UsuarioService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // Método auxiliar para validar rol de administrador
    private boolean isAdmin(Claims claims) {
        if (claims == null) return false;

        Object rolIdObj = claims.get("rolId");
        Long rolId = null;

        if (rolIdObj instanceof Integer) {
            rolId = ((Integer) rolIdObj).longValue();
        } else if (rolIdObj instanceof Long) {
            rolId = (Long) rolIdObj;
        } else if (rolIdObj instanceof String) {
            try {
                rolId = Long.parseLong((String) rolIdObj);
            } catch (NumberFormatException e) {
                return false;
            }
        }

        return rolId != null && rolId == 1L;
    }

    @GetMapping
    public ResponseEntity<?> listar(HttpServletRequest request) {
        Claims claims = (Claims) request.getAttribute("claims");

        if (!isAdmin(claims)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado: se requiere rol de administrador");
        }

        List<Usuario> usuarios = usuarioService.findAll();
        return usuarios.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(usuarios);
    }

    @PostMapping
    public ResponseEntity<?> guardar(HttpServletRequest request, @RequestBody Usuario usuario) {
        Claims claims = (Claims) request.getAttribute("claims");

        if (!isAdmin(claims)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado: se requiere rol de administrador");
        }

        Usuario usuarioNuevo = usuarioService.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioNuevo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(HttpServletRequest request, @PathVariable Long id) {
        Claims claims = (Claims) request.getAttribute("claims");

        if (!isAdmin(claims)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado: se requiere rol de administrador");
        }

        try {
            Usuario usuario = usuarioService.findById(id);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(HttpServletRequest request, @PathVariable Long id, @RequestBody Usuario usuario) {
        Claims claims = (Claims) request.getAttribute("claims");

        if (!isAdmin(claims)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado: se requiere rol de administrador");
        }

        try {
            Usuario usu = usuarioService.findById(id);
            usu.setId(id);
            usu.setRut(usuario.getRut());
            usu.setRol(usuario.getRol());
            usu.setApellido(usuario.getApellido());
            usu.setNombre(usuario.getNombre());
            usu.setCorreo(usuario.getCorreo());
            usu.setContra(usuario.getContra());

            usuarioService.save(usu);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(HttpServletRequest request, @PathVariable Long id) {
        Claims claims = (Claims) request.getAttribute("claims");

        if (!isAdmin(claims)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado: se requiere rol de administrador");
        }

        try {
            usuarioService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        // Validar que el correo y rut no estén repetidos
        if (usuarioService.findByCorreo(usuario.getCorreo()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El correo ya está registrado");
        }
        if (usuarioService.findAll().stream().anyMatch(u -> u.getRut().equals(usuario.getRut()))) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El RUT ya está registrado");
        }
        // Validar que el rol sea Viajero (4) o Transportista (5)
        Long rolId = usuario.getRol() != null ? usuario.getRol().getId() : null;
        if (rolId == null || !(rolId == 4L || rolId == 5L)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Rol inválido");
        }
        // Guardar usuario
        usuarioService.save(usuario);
        return ResponseEntity.ok("Usuario registrado exitosamente");
    }
}