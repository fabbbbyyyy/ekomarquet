package com.carros.cl.carritos.Carros.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "registro_carros")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistroCarro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre completo del docente (nombre + apellido)
    @Column(nullable = false)
    private String nombreDocente;

    // Rut del docente (sin dv)
    @Column(nullable = false)
    private int rutDocente;

    // Nombre del carro
    @Column(nullable = false)
    private String nombreCarro;

    // Cantidad de equipos prestados
    @Column(nullable = false)
    private int cantidadEquipos;

    @Column(nullable = false)
    private String sala;

    @Column(nullable = false)
    private LocalDate fechaDia;

    @Column(nullable = false)
    private LocalDateTime horaPrestamo;

    @Column(nullable = false)
    private LocalDateTime horaEntrega;

    // Nombre completo del responsable)
    @Column(nullable = false)
    private String nombreResponsable;

    @Column(nullable = false)
    private String estadoPrestamo;
}
