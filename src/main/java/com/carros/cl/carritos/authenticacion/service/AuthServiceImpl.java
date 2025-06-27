package com.carros.cl.carritos.authenticacion.service;

import com.carros.cl.carritos.authenticacion.model.Usuario;
import com.carros.cl.carritos.authenticacion.repository.UsuarioRepository;
import com.carros.cl.carritos.authenticacion.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public String login(String correo, String contra) {
        Usuario usuario = usuarioRepository.findByCorreo(correo);
        if (usuario != null && usuario.getContra().equals(contra)) {
            return jwtUtil.generateToken(usuario);
        }
        return null;
    }

    @Override
    public Usuario getUsuarioByCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }
}

