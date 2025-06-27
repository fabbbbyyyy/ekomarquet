package com.carros.cl.carritos.Carros.repository;

import com.carros.cl.carritos.Carros.model.Carro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarroRepository extends JpaRepository<Carro, Long> {
    Carro findByNombreCarro(String nombreCarro);
}
