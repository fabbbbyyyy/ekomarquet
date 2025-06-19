package com.aduanas.cl.aduanas.authenticacion.repository;

import com.aduanas.cl.aduanas.authenticacion.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RolRepository extends JpaRepository<Rol, Long> {
}
