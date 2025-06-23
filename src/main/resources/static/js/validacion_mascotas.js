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
        html = `<table class="table table-striped table-bordered align-middle"><thead><tr><th>ID</th><th>Mascota</th><th>Tipo</th><th>Usuario</th><th>Fecha</th><th>Estado</th></tr></thead><tbody><tr><td colspan="6" class="text-center">No hay trámites de mascotas registrados.</td></tr></tbody></table>`;
        idsMascotasValidos = [];
        div.innerHTML = html;
        return;
    }
    idsMascotasValidos = tramites.map(t => t.id);
    html = '<table class="table table-striped table-bordered align-middle"><thead><tr><th>ID</th><th>Mascota</th><th>Tipo</th><th>Usuario</th><th>Fecha</th><th>Estado</th></tr></thead><tbody>';
    tramites.forEach(t => {
        // Suponiendo que la descripción es "Mascota: X, Tipo: Y"
        let mascota = '', tipo = '';
        if (t.descripcion) {
            const match = t.descripcion.match(/Mascota:\s*([^,]+),\s*Tipo:\s*(.+)/i);
            if (match) {
                mascota = match[1].trim();
                tipo = match[2].trim();
            } else {
                mascota = t.descripcion;
            }
        }
        html += `<tr><td>${t.id}</td><td>${mascota}</td><td>${tipo}</td><td>${t.usuario?.nombre || t.usuario?.id}</td><td>${t.fechaCreacion || ''}</td><td>${t.estado || 'PENDIENTE'}</td></tr>`;
    });
    html += '</tbody></table>';
    div.innerHTML = html;
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
