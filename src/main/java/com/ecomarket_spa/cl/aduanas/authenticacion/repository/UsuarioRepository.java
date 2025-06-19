package com.ecomarket_spa.cl.aduanas.authenticacion.repository;

import com.ecomarket_spa.cl.aduanas.authenticacion.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByCorreo(String correo);
}
