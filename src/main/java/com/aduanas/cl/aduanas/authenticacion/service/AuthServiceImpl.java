package com.aduanas.cl.aduanas.authenticacion.service;

import com.aduanas.cl.aduanas.authenticacion.model.Usuario;
import com.aduanas.cl.aduanas.authenticacion.repository.UsuarioRepository;
import com.aduanas.cl.aduanas.authenticacion.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public String login(String correo, String contra) {
        Usuario usuario = usuarioRepository.findByCorreo(correo);
        if (usuario != null) {
            String hashEnBD = usuario.getContra();
            // Si la contraseña NO está encriptada
            if (hashEnBD != null && !hashEnBD.startsWith("$2a$")) {
                if (hashEnBD.equals(contra)) {
                    // Encriptar y actualizar en BD
                    String hashNuevo = passwordEncoder.encode(contra);
                    usuario.setContra(hashNuevo);
                    usuarioRepository.save(usuario);
                    hashEnBD = hashNuevo;
                } else {
                    return null;
                }
            }
            // Validar con bcrypt
            if (passwordEncoder.matches(contra, hashEnBD)) {
                return jwtUtil.generateToken(usuario);
            }
        }
        return null;
    }

    @Override
    public Usuario getUsuarioByCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }
}
