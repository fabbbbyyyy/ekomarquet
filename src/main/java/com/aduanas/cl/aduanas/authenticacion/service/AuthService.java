package com.aduanas.cl.aduanas.authenticacion.service;

import com.aduanas.cl.aduanas.authenticacion.model.Usuario;

public interface AuthService {
    String login(String correo, String contra);
    Usuario getUsuarioByCorreo(String correo);
}

