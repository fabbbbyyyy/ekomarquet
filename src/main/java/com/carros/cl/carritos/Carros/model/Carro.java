package com.carros.cl.carritos.Carros.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "carros")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Carro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombreCarro;

    @Column(nullable = false)
    private String sala;

    @Column(nullable = false)
    private Integer cantidadEquipos;
}
