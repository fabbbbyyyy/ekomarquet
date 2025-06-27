package com.carros.cl.carritos.Carros.service;

import com.carros.cl.carritos.Carros.model.Carro;
import com.carros.cl.carritos.Carros.repository.CarroRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class CarroService {
    @Autowired
    private CarroRepository carroRepository;

    public List<Carro> findAll() {
        return carroRepository.findAll();
    }

    public Carro findById(long id) {
        return carroRepository.findById(id).orElse(null);
    }

    public Carro save(Carro carro) {
        return carroRepository.save(carro);
    }

    public void delete(Long id) {
        carroRepository.deleteById(id);
    }

    public Carro findByNombreCarro(String nombreCarro) {
        return carroRepository.findByNombreCarro(nombreCarro);
    }
}
