package com.carros.cl.carritos.Carros.repository;

import com.carros.cl.carritos.Carros.model.RegistroCarro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroCarroRepository extends JpaRepository<RegistroCarro, Long> {
}
