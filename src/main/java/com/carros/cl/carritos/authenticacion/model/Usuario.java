package com.carros.cl.carritos.authenticacion.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,length = 10,unique = true)
    private String rut;

    @Column(nullable = false, unique = true)
    private String correo;

    @Column(nullable = false)
    private String contra;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rol_id",nullable = false)
    private Rol rol;
}