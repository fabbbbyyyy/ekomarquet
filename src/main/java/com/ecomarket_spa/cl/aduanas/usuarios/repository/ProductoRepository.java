package com.ecomarket_spa.cl.aduanas.usuarios.repository;

import com.ecomarket_spa.cl.aduanas.usuarios.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
