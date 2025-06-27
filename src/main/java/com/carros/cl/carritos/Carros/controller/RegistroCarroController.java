package com.carros.cl.carritos.Carros.controller;

import com.carros.cl.carritos.Carros.model.RegistroCarro;
import com.carros.cl.carritos.Carros.service.RegistroCarroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/registro-carros")
public class RegistroCarroController {
    @Autowired
    private RegistroCarroService registroCarroService;

    @PostMapping
    public ResponseEntity<RegistroCarro> registrar(@RequestBody RegistroCarro registroCarro) {
        RegistroCarro nuevo = registroCarroService.save(registroCarro);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @GetMapping
    public ResponseEntity<List<RegistroCarro>> listar() {
        List<RegistroCarro> registros = registroCarroService.findAll();
        if (registros.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(registros);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<RegistroCarro> actualizarEstado(@PathVariable Long id, @RequestBody String nuevoEstado) {
        RegistroCarro registro = registroCarroService.findById(id);
        if (registro == null) {
            return ResponseEntity.notFound().build();
        }
        registro.setEstadoPrestamo(nuevoEstado.replace("\"", "")); // Por si viene como JSON string
        registroCarroService.save(registro);
        return ResponseEntity.ok(registro);
    }
}
