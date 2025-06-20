package com.aduanas.cl.aduanas.tramites.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "tramites")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tramite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1: Menores, 2: Vehículo, 3: Declaración SAG
    @Column(nullable = false)
    private Integer tipoTramite;

    @Column(nullable = false)
    private String descripcion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private com.aduanas.cl.aduanas.authenticacion.model.Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private EstadoTramite estado = EstadoTramite.NO_REVISADO;

    // Puedes agregar más campos según necesidad
}
