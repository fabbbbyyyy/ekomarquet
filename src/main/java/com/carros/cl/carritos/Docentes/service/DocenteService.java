package com.carros.cl.carritos.Docentes.service;

import com.carros.cl.carritos.Docentes.model.Docente;
import com.carros.cl.carritos.Docentes.repository.DocenteRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class DocenteService {
    @Autowired
    private DocenteRepository docenteRepository;

    public List<Docente> findAll() {
        return docenteRepository.findAll();
    }

    public Docente findById(Long id) {
        return docenteRepository.findById(id).orElse(null);
    }

    public Docente save(Docente docente) {
        return docenteRepository.save(docente);
    }

    public void delete(Long id) {
        docenteRepository.deleteById(id);
    }

    public Docente findByRut(int rut) {
        return docenteRepository.findByRut(rut);
    }
}
