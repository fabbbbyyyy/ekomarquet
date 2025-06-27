package com.carros.cl.carritos.authenticacion.repository;

import com.carros.cl.carritos.authenticacion.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RolRepository extends JpaRepository<Rol, Long> {
}
