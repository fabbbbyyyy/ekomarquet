package com.carros.cl.carritos.authenticacion.service;

import com.carros.cl.carritos.authenticacion.model.Usuario;

public interface AuthService {
    String login(String correo, String contra);
    Usuario getUsuarioByCorreo(String correo);
}

