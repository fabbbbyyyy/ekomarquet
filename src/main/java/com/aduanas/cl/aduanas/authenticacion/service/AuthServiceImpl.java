package com.aduanas.cl.aduanas.authenticacion.service;

import com.aduanas.cl.aduanas.authenticacion.model.Usuario;
import com.aduanas.cl.aduanas.authenticacion.repository.UsuarioRepository;
import com.aduanas.cl.aduanas.authenticacion.utils.JwtUtil;
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

