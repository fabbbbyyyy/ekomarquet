package com.aduanas.cl.aduanas.tramites.service;

import com.aduanas.cl.aduanas.tramites.model.Tramite;
import com.aduanas.cl.aduanas.tramites.repository.TramiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class TramiteService {
    @Autowired
    private TramiteRepository tramiteRepository;

    public List<Tramite> findAll() {
        return tramiteRepository.findAll();
    }

    public Tramite findById(Long id) {
        return tramiteRepository.findById(id).orElse(null);
    }

    public Tramite save(Tramite tramite) {
        return tramiteRepository.save(tramite);
    }

    public void delete(Long id) {
        tramiteRepository.deleteById(id);
    }

    public List<Tramite> findByTipoTramite(Integer tipoTramite) {
        return tramiteRepository.findByTipoTramite(tipoTramite);
    }

    public List<Tramite> findByUsuarioId(Long usuarioId) {
        return tramiteRepository.findByUsuarioId(usuarioId);
    }
}

