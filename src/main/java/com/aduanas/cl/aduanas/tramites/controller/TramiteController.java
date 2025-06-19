package com.aduanas.cl.aduanas.tramites.controller;

import com.aduanas.cl.aduanas.authenticacion.model.Usuario;
import com.aduanas.cl.aduanas.authenticacion.service.UsuarioService;
import com.aduanas.cl.aduanas.tramites.model.Tramite;
import com.aduanas.cl.aduanas.tramites.service.TramiteService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tramites")
public class TramiteController {

    @Autowired
    private TramiteService tramiteService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<Tramite>> listar() {
        List<Tramite> tramites = tramiteService.findAll();
        return tramites.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tramites);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tramite> buscar(@PathVariable Long id) {
        Tramite tramite = tramiteService.findById(id);
        return tramite != null ? ResponseEntity.ok(tramite) : ResponseEntity.notFound().build();
    }

    @GetMapping("/tipo/{tipoTramite}")
    public ResponseEntity<List<Tramite>> listarPorTipo(@PathVariable Integer tipoTramite) {
        List<Tramite> tramites = tramiteService.findByTipoTramite(tipoTramite);
        return tramites.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tramites);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Tramite>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<Tramite> tramites = tramiteService.findByUsuarioId(usuarioId);
        return tramites.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tramites);
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Tramite tramite, HttpServletRequest request) {
        Claims claims = (Claims) request.getAttribute("claims");
        if (claims == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }
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
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Rol inválido");
            }
        }
        if (rolId == null || !(rolId == 1L || rolId == 4L || rolId == 5L)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado: solo viajeros, transportistas o administradores pueden crear trámites");
        }
        // Buscar el usuario gestionado y asignarlo al trámite
        if (tramite.getUsuario() == null || tramite.getUsuario().getId() == null) {
            return ResponseEntity.badRequest().body("Usuario requerido");
        }
        Usuario usuario = usuarioService.findById(tramite.getUsuario().getId());
        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        tramite.setUsuario(usuario);
        tramite.setFechaCreacion(LocalDateTime.now());
        Tramite nuevo = tramiteService.save(tramite);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        tramiteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
