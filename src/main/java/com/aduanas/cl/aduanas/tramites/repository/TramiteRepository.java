package com.aduanas.cl.aduanas.tramites.repository;

import com.aduanas.cl.aduanas.tramites.model.Tramite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TramiteRepository extends JpaRepository<Tramite, Long> {
    List<Tramite> findByTipoTramite(Integer tipoTramite);
    List<Tramite> findByUsuarioId(Long usuarioId);
}

