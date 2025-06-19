package com.ecomarket_spa.cl.aduanas.authenticacion.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ecomarket_spa.cl.aduanas.authenticacion.model.Usuario;
import com.ecomarket_spa.cl.aduanas.authenticacion.repository.UsuarioRepository;

import java.util.List;


@Service
@Transactional
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    public List<Usuario> findAll(){
        return usuarioRepository.findAll();
    }
    public Usuario findById(long id){
        return usuarioRepository.findById(id).get();
    }
    public Usuario save(Usuario usuario){
        return usuarioRepository.save(usuario);
    }
    public void delete(Long id){
        usuarioRepository.deleteById(id);
    }
    public Usuario findByCorreo(String correo){
        return usuarioRepository.findByCorreo(correo);
    }
}
