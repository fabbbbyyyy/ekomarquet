package com.carros.cl.carritos.Carros.service;

import com.carros.cl.carritos.Carros.model.RegistroCarro;
import com.carros.cl.carritos.Carros.repository.RegistroCarroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegistroCarroService {
    @Autowired
    private RegistroCarroRepository registroCarroRepository;

    public RegistroCarro save(RegistroCarro registroCarro) {
        return registroCarroRepository.save(registroCarro);
    }

    public List<RegistroCarro> findAll() {
        return registroCarroRepository.findAll();
    }

    public RegistroCarro findById(Long id) {
        return registroCarroRepository.findById(id).orElse(null);
    }
}
