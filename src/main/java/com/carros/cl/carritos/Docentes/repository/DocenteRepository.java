package com.carros.cl.carritos.Docentes.repository;

import com.carros.cl.carritos.Docentes.model.Docente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocenteRepository extends JpaRepository<Docente, Long> {
    Docente findByRut(int rut);
}
