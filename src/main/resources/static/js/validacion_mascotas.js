document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('jwt')) {
        window.location.href = '/login.html';
        return;
    }
    var enlacesSesion = document.getElementById('enlaces-sesion');
    if (enlacesSesion) {
        enlacesSesion.style.display = 'inline';
    }
    var btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.onclick = function() {
            localStorage.removeItem('jwt');
            window.location.href = '/index.html';
        };
    }
    const payload = JSON.parse(atob(localStorage.getItem('jwt').split('.')[1]));
    if (payload.rolId != 2 && payload.rolId != 1) {
        document.getElementById('contenido-validacion-mascotas').style.display = 'none';
        document.body.insertAdjacentHTML('beforeend', '<p style="color:red">Acceso solo para inspectores o administradores.</p>');
        return;
    }
    cargarTramitesMascotas();

    document.getElementById('btn-aceptar').onclick = function() {
        actualizarEstadoMascota('ACEPTADO');
    };
    document.getElementById('btn-rechazar').onclick = function() {
        actualizarEstadoMascota('RECHAZADO');
    };
});

let tramitesMascotasCache = [];
let idsMascotasValidos = [];

function renderTablaMascotas(tramites) {
    const div = document.getElementById('tramites-mascotas');
    let html = '';
    if (!tramites.length) {
        html = `<table class="table table-striped table-bordered align-middle"><thead><tr><th>ID</th><th>Mascota</th><th>Tipo</th><th>Usuario</th><th>Fecha</th><th>Estado</th><th>Acción</th></tr></thead><tbody><tr><td colspan="7" class="text-center">No hay trámites de mascotas registrados.</td></tr></tbody></table>`;
        idsMascotasValidos = [];
        div.innerHTML = html;
        return;
    }
    idsMascotasValidos = tramites.map(t => t.id);
    html = '<table class="table table-striped table-bordered align-middle"><thead><tr><th>ID</th><th>Mascota</th><th>Tipo</th><th>Usuario</th><th>Fecha</th><th>Estado</th><th>Acción</th></tr></thead><tbody>';
    tramites.forEach((t, idx) => {
        let mascota = '', tipo = '';
        if (t.descripcion) {
            const match = t.descripcion.match(/Mascota:\s*([^,]+),\s*Tipo:\s*([^,]+)/i);
            if (match) {
                mascota = match[1].trim();
                tipo = match[2].trim();
            } else {
                mascota = t.descripcion;
            }
        }
        // Formatear la fecha a dd/mm/yyyy hh:mm
        let fechaLegible = '';
        if (t.fechaCreacion) {
            const fecha = new Date(t.fechaCreacion);
            if (!isNaN(fecha.getTime())) {
                const dia = String(fecha.getDate()).padStart(2, '0');
                const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                const anio = fecha.getFullYear();
                const horas = String(fecha.getHours()).padStart(2, '0');
                const minutos = String(fecha.getMinutes()).padStart(2, '0');
                fechaLegible = `${dia}/${mes}/${anio} ${horas}:${minutos}`;
            } else {
                fechaLegible = t.fechaCreacion;
            }
        }
        html += `<tr><td>${t.id}</td><td>${mascota}</td><td>${tipo}</td><td>${t.usuario?.nombre || t.usuario?.id}</td><td>${fechaLegible}</td><td>${t.estado || 'PENDIENTE'}</td><td><button class='btn btn-info btn-sm' onclick='mostrarDetalleTramite(${idx})'>Ver detalles</button></td></tr>`;
    });
    html += '</tbody></table>';
    div.innerHTML = html;
}

function mostrarDetalleTramite(idx) {
    const tramite = tramitesMascotasCache[idx];
    if (!tramite) return;
    let detalles = `<div class='mb-2'><strong>ID:</strong> ${tramite.id}</div>`;
    detalles += `<div class='mb-2'><strong>Usuario:</strong> ${tramite.usuario?.nombre || tramite.usuario?.id}</div>`;
    detalles += `<div class='mb-2'><strong>Fecha:</strong> ${tramite.fechaCreacion || ''}</div>`;
    detalles += `<div class='mb-2'><strong>Estado:</strong> ${tramite.estado || 'PENDIENTE'}</div>`;
    if (tramite.descripcion) {
        const partes = tramite.descripcion.split(',');
        detalles += '<hr><h6>Datos de la Mascota</h6>';
        partes.forEach(p => {
            const [clave, valor] = p.split(':');
            if (clave && valor) {
                detalles += `<div class='mb-1'><span class='fw-bold'>${clave.trim()}:</span> <span>${valor.trim()}</span></div>`;
            }
        });
    }
    document.getElementById('modal-detalle-body').innerHTML = detalles;
    const modal = new bootstrap.Modal(document.getElementById('modal-detalle-tramite'));
    modal.show();
}

function cargarTramitesMascotas() {
    fetch('/api/v1/tramites/tipo/4', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    })
    .then(r => r.json())
    .then(tramites => {
        tramitesMascotasCache = tramites;
        renderTablaMascotas(tramitesMascotasCache);
    })
    .catch(() => {
        document.getElementById('tramites-mascotas').innerHTML = '<p style="color:red">Error al cargar los trámites.</p>';
    });
}

function actualizarEstadoMascota(nuevoEstado) {
    const id = document.getElementById('accion-id').value.trim();
    const resultado = document.getElementById('accion-resultado');
    if (!id || !idsMascotasValidos.includes(Number(id))) {
        resultado.style.color = 'red';
        resultado.textContent = 'Ingrese una ID válida que esté en la tabla.';
        return;
    }
    fetch(`/api/v1/tramites/${id}/estado`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        body: JSON.stringify({ estado: nuevoEstado })
    })
    .then(async r => {
        if (r.ok) {
            resultado.style.color = 'green';
            resultado.textContent = `Estado actualizado a ${nuevoEstado}`;
            cargarTramitesMascotas();
        } else if (r.status === 404) {
            resultado.style.color = 'red';
            resultado.textContent = 'ID no encontrada en la base de datos.';
        } else if (r.status === 400) {
            const msg = await r.text();
            resultado.style.color = 'red';
            resultado.textContent = msg || 'Estado inválido.';
        } else {
            const msg = await r.text();
            resultado.style.color = 'red';
            resultado.textContent = msg || 'Error al actualizar el estado.';
        }
    })
    .catch(() => {
        resultado.style.color = 'red';
        resultado.textContent = 'Error de red al actualizar el estado.';
    });
}
