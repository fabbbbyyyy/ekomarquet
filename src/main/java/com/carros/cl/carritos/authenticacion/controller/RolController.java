package com.carros.cl.carritos.authenticacion.controller;

import com.carros.cl.carritos.authenticacion.model.Rol;
import com.carros.cl.carritos.authenticacion.service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
public class RolController {
    @Autowired
    private RolService rolService;

    @GetMapping
    public ResponseEntity<List<Rol>> listar(){
        List<Rol>roles =rolService.findAll();
        if (roles.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        return  ResponseEntity.ok(roles);
    }
    @PostMapping
    public ResponseEntity<Rol> guardar(@RequestBody Rol rol){
        Rol rolNuevo = rolService.save(rol);
        return ResponseEntity.status(HttpStatus.CREATED).body(rolNuevo);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Rol> buscar(@PathVariable Long id){
        try{
            Rol rol = rolService.findById(id);
            return ResponseEntity.ok(rol);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<Rol> actualizar(@PathVariable Long id,@RequestBody Rol rol) {
        try {
            Rol roll = rolService.findById(id);
            roll.setId(id);
            roll.setNombre(rol.getNombre());
            roll.setDescripcion(rol.getDescripcion());
            roll.setPermisosJson(rol.getPermisosJson());

            rolService.save(roll);
            return ResponseEntity.ok(rol);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

}
