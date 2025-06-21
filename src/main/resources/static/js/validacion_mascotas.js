document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('jwt')) {
        window.location.href = '/login.html';
        return;
    }
    document.getElementById('enlaces-sesion').style.display = 'inline';
    document.getElementById('btn-cerrar-sesion').onclick = function() {
        localStorage.removeItem('jwt');
        window.location.href = '/index.html';
    };
    const payload = JSON.parse(atob(localStorage.getItem('jwt').split('.')[1]));
    if (payload.rolId != 2) {
        document.getElementById('contenido-validacion-mascotas').style.display = 'none';
        document.body.insertAdjacentHTML('beforeend', '<p style="color:red">Acceso solo para inspectores.</p>');
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
    if (!tramites.length) {
        div.innerHTML = '<p>No hay trámites de mascotas registrados.</p>';
        idsMascotasValidos = [];
        return;
    }
    idsMascotasValidos = tramites.map(t => t.id);
    let html = '<table id="tabla-tramites-mascotas" border="1" style="margin-top:20px;width:100%;"><thead><tr><th>ID</th><th>Descripción</th><th>Usuario</th><th>Fecha</th><th>Estado</th></tr></thead><tbody>';
    tramites.forEach(t => {
        html += `<tr><td>${t.id}</td><td>${t.descripcion}</td><td>${t.usuario?.nombre || t.usuario?.id}</td><td>${t.fechaCreacion || ''}</td><td>${t.estado || 'PENDIENTE'}</td></tr>`;
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
