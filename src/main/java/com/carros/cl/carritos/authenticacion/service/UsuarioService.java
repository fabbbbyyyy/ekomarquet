package com.carros.cl.carritos.authenticacion.service;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.carros.cl.carritos.authenticacion.model.Usuario;
import com.carros.cl.carritos.authenticacion.repository.UsuarioRepository;

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