package com.ecomarket_spa.cl.aduanas.usuarios.service;

import com.ecomarket_spa.cl.aduanas.usuarios.model.Producto;
import com.ecomarket_spa.cl.aduanas.usuarios.repository.ProductoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ProductoService {
    @Autowired
    private ProductoRepository productoRepository;
    public List<Producto> findAll(){
        return productoRepository.findAll();
    }
    public Producto findById(long id){
        return productoRepository.findById(id).get();
    }
    public Producto save(Producto producto){
        return productoRepository.save(producto);
    }
    public void delete(Long id){
        productoRepository.deleteById(id);
    }
}
