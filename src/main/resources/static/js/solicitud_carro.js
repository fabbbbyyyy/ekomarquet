// solicitud_carro.js

document.addEventListener('DOMContentLoaded', function() {
    mostrarUsuarioAutenticado();
    cargarCarrosDropdown();
    setFechaYHoraActual();
    setResponsableDesdeJWT();

    // Buscar docente por RUT
    document.getElementById('rut-docente').addEventListener('blur', async function() {
        let rut = this.value.trim();
        const nombreInput = document.getElementById('nombre-docente');
        const errorDiv = document.getElementById('rut-error');
        if (!rut) return;
        errorDiv.style.display = 'none';
        nombreInput.value = '';
        // Eliminar dígito verificador si el usuario lo ingresa (por si acaso)
        rut = rut.replace(/[-‐–—][0-9kK]$/, '');
        // Eliminar todos los puntos para la búsqueda
        let rutSinPuntos = rut.replace(/\./g, '');
        // Solo números
        rutSinPuntos = rutSinPuntos.replace(/\D/g, '');
        console.log('Buscando RUT (sin puntos):', rutSinPuntos);
        try {
            const token = localStorage.getItem('jwt');
            let resp = await fetch(`/api/v1/docentes/rut/${rutSinPuntos}`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            console.log('Respuesta API:', resp.status);
            if (resp.ok) {
                const usuario = await resp.json();
                console.log('Usuario encontrado:', usuario);
                nombreInput.value = usuario.nombre + (usuario.apellido ? ' ' + usuario.apellido : '');
            } else {
                errorDiv.textContent = 'RUT no encontrado';
                errorDiv.style.display = 'block';
            }
        } catch (e) {
            errorDiv.textContent = 'Error al buscar RUT';
            errorDiv.style.display = 'block';
            console.error('Error al buscar RUT:', e);
        }
    });

    // Autocompletar sala y equipos al seleccionar carro
    document.getElementById('nombre-carro').addEventListener('change', function() {
        const selected = this.value;
        const carro = window._carrosList ? window._carrosList.find(c => c.nombreCarro === selected) : null;
        if (carro) {
            document.getElementById('sala').value = carro.sala;
            document.getElementById('cantidad-equipos').value = carro.cantidadEquipos;
        } else {
            document.getElementById('sala').value = '';
            document.getElementById('cantidad-equipos').value = '';
        }
    });

    // Estado préstamo siempre PRESTADO
    document.getElementById('estado-prestamo').value = 'PRESTADO';

    // Al enviar el formulario
    document.getElementById('form-solicitud-carro').addEventListener('submit', async function(e) {
        e.preventDefault();
        const token = localStorage.getItem('jwt');
        const data = {
            rutDocente: parseInt(this['rut-docente'].value),
            nombreDocente: this['nombre-docente'].value,
            nombreCarro: this['nombre-carro'].value,
            cantidadEquipos: parseInt(this['cantidad-equipos'].value),
            sala: this['sala'].value,
            fechaDia: this['fecha-dia'].value,
            horaPrestamo: this['hora-prestamo'].value,
            horaEntrega: this['hora-entrega'].value,
            nombreResponsable: this['nombre-responsable'].value,
            estadoPrestamo: 'PRESTADO'
        };
        const mensajeDiv = document.getElementById('mensaje-solicitud-carro');
        mensajeDiv.textContent = '';
        try {
            const response = await fetch('/api/v1/registro-carros', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                mensajeDiv.textContent = 'Registro exitoso';
                mensajeDiv.className = 'alert alert-success';
                this.reset();
                setFechaYHoraActual();
                setResponsableDesdeJWT();
                document.getElementById('estado-prestamo').value = 'PRESTADO';
            } else {
                const errorText = await response.text();
                mensajeDiv.textContent = 'Error: ' + errorText;
                mensajeDiv.className = 'alert alert-danger';
            }
        } catch (e) {
            mensajeDiv.textContent = 'Error de red: ' + e.message;
            mensajeDiv.className = 'alert alert-danger';
        }
    });
});

function cargarCarrosDropdown() {
    const select = document.getElementById('nombre-carro');
    fetch('/api/v1/carros', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    })
    .then(r => r.json())
    .then(carros => {
        window._carrosList = carros;
        select.innerHTML = '<option value="">Seleccione un carro</option>' + carros.map(c => `<option value="${c.nombreCarro}">${c.nombreCarro}</option>`).join('');
    });
}

function setFechaYHoraActual() {
    const now = new Date();
    const fecha = now.toISOString().slice(0,10);
    const hora = now.toISOString().slice(0,16);
    document.getElementById('fecha-dia').value = fecha;
    document.getElementById('hora-prestamo').value = hora;
}

function setResponsableDesdeJWT() {
    const token = localStorage.getItem('jwt');
    if (!token) return;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.nombre) {
            document.getElementById('nombre-responsable').value = payload.nombre;
        }
    } catch {}
}

function mostrarUsuarioAutenticado() {
    const token = localStorage.getItem('jwt');
    if (!token) return;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const div = document.getElementById('usuario-autenticado');
        if (payload) {
            div.innerHTML = `<b>Usuario:</b> ${payload.sub || payload.email || ''}`;
        }
    } catch {}
}
