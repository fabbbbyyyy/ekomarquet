package com.carros.cl.carritos.Carros.controller;

import com.carros.cl.carritos.Carros.model.Carro;
import com.carros.cl.carritos.Carros.service.CarroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/carros")
public class CarroController {
    @Autowired
    private CarroService carroService;

    @GetMapping
    public ResponseEntity<List<Carro>> listar() {
        List<Carro> carros = carroService.findAll();
        if (carros.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(carros);
    }

    @PostMapping
    public ResponseEntity<Carro> guardar(@RequestBody Carro carro) {
        Carro carroNuevo = carroService.save(carro);
        return ResponseEntity.status(HttpStatus.CREATED).body(carroNuevo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Carro> buscar(@PathVariable Long id) {
        Carro carro = carroService.findById(id);
        if (carro == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(carro);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Carro> actualizar(@PathVariable Long id, @RequestBody Carro carro) {
        Carro carroExistente = carroService.findById(id);
        if (carroExistente == null) {
            return ResponseEntity.notFound().build();
        }
        carroExistente.setNombreCarro(carro.getNombreCarro());
        carroExistente.setSala(carro.getSala());
        carroExistente.setCantidadEquipos(carro.getCantidadEquipos());
        carroService.save(carroExistente);
        return ResponseEntity.ok(carroExistente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Carro carro = carroService.findById(id);
        if (carro == null) {
            return ResponseEntity.notFound().build();
        }
        carroService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
