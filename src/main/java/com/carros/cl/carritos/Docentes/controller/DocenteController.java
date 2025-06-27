package com.carros.cl.carritos.Docentes.controller;

import com.carros.cl.carritos.Docentes.model.Docente;
import com.carros.cl.carritos.Docentes.service.DocenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/docentes")
public class DocenteController {
    @Autowired
    private DocenteService docenteService;

    @GetMapping
    public ResponseEntity<List<Docente>> listar() {
        List<Docente> docentes = docenteService.findAll();
        if (docentes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(docentes);
    }

    @PostMapping
    public ResponseEntity<Docente> guardar(@RequestBody Docente docente) {
        int rutLength = String.valueOf(docente.getRut()).length();
        if (rutLength < 7 || rutLength > 8) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
        Docente nuevo = docenteService.save(docente);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Docente> buscar(@PathVariable Long id) {
        Docente docente = docenteService.findById(id);
        if (docente == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(docente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Docente> actualizar(@PathVariable Long id, @RequestBody Docente docente) {
        int rutLength = String.valueOf(docente.getRut()).length();
        if (rutLength < 7 || rutLength > 8) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
        Docente existente = docenteService.findById(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        existente.setNombre(docente.getNombre());
        existente.setApellido(docente.getApellido());
        existente.setDv(docente.getDv());
        existente.setRut(docente.getRut());
        docenteService.save(existente);
        return ResponseEntity.ok(existente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Docente docente = docenteService.findById(id);
        if (docente == null) {
            return ResponseEntity.notFound().build();
        }
        docenteService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint para buscar por rut
    @GetMapping("/rut/{rut}")
    public ResponseEntity<Docente> buscarPorRut(@PathVariable int rut) {
        Docente docente = docenteService.findByRut(rut);
        if (docente == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(docente);
    }
}
