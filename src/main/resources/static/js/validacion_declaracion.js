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
        document.getElementById('contenido-validacion-declaracion').style.display = 'none';
        document.body.insertAdjacentHTML('beforeend', '<p style="color:red">Acceso solo para inspectores o administradores.</p>');
        return;
    }
    cargarTramites();

    document.getElementById('btn-aceptar').onclick = function() {
        actualizarEstado('ACEPTADO');
    };
    document.getElementById('btn-rechazar').onclick = function() {
        actualizarEstado('RECHAZADO');
    };
});

let tramitesCache = [];
let idsValidos = [];

function renderTabla(tramites) {
    const div = document.getElementById('tramites-declaracion');
    let html = '';
    if (!tramites.length) {
        html = `<table class="table table-striped table-bordered align-middle"><thead><tr><th>Producto</th><th>Cantidad</th><th>País de origen</th><th>Usuario</th><th>Fecha</th><th>Estado</th></tr></thead><tbody><tr><td colspan="6" class="text-center">No hay declaraciones SAG registradas.</td></tr></tbody></table>`;
        idsValidos = [];
        div.innerHTML = html;
        return;
    }
    idsValidos = tramites.map(t => t.id);
    html = '<table class="table table-striped table-bordered align-middle"><thead><tr><th>Producto</th><th>Cantidad</th><th>País de origen</th><th>Usuario</th><th>Fecha</th><th>Estado</th></tr></thead><tbody>';
    tramites.forEach(t => {
        // Suponiendo que la descripción es "Producto: X, Cantidad: Y, País de origen: Z"
        let producto = '', cantidad = '', pais = '';
        if (t.descripcion) {
            const match = t.descripcion.match(/Producto:\s*([^,]+),\s*Cantidad:\s*([^,]+),\s*País de origen:\s*(.+)/i);
            if (match) {
                producto = match[1].trim();
                cantidad = match[2].trim();
                pais = match[3].trim();
            } else {
                producto = t.descripcion;
            }
        }
        html += `<tr><td>${t.id}</td><td>${producto}</td><td>${cantidad}</td><td>${pais}</td><td>${t.usuario?.nombre || t.usuario?.id}</td><td>${t.fechaCreacion || ''}</td><td>${t.estado || 'PENDIENTE'}</td></tr>`;
    });
    html += '</tbody></table>';
    div.innerHTML = html;
}

function cargarTramites() {
    fetch('/api/v1/tramites/tipo/3', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    })
    .then(r => r.json())
    .then(tramites => {
        tramitesCache = tramites;
        renderTabla(tramitesCache);
    })
    .catch(() => {
        document.getElementById('tramites-declaracion').innerHTML = '<p style="color:red">Error al cargar las declaraciones.</p>';
    });
}

function actualizarEstado(nuevoEstado) {
    const id = document.getElementById('accion-id').value.trim();
    const resultado = document.getElementById('accion-resultado');
    if (!id || !idsValidos.includes(Number(id))) {
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
            cargarTramites();
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
