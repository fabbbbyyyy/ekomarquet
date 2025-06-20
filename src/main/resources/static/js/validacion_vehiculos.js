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
    if (![1,2,4,5].includes(payload.rolId)) {
        document.getElementById('contenido-validacion-registros').style.display = 'none';
        document.body.insertAdjacentHTML('beforeend', '<p style="color:red">Acceso solo para administradores, inspectores, viajeros o transportistas.</p>');
        return;
    }
    let tramitesVehiculoCache = [];
    let idsVehiculoValidos = [];

    function renderTablaVehiculos(tramites) {
        const div = document.getElementById('tramites-vehiculos');
        if (!tramites.length) {
            div.innerHTML = '<p>No hay trámites de vehículos registrados.</p>';
            idsVehiculoValidos = [];
            return;
        }
        idsVehiculoValidos = tramites.map(t => t.id);
        let html = '<table><tr><th>ID</th><th>Descripción</th><th>Usuario</th><th>Fecha</th><th>Estado</th></tr>';
        tramites.forEach(t => {
            html += `<tr><td>${t.id}</td><td>${t.descripcion}</td><td>${t.usuario?.nombre || t.usuario?.id}</td><td>${t.fechaCreacion || ''}</td><td>${t.estado || 'PENDIENTE'}</td></tr>`;
        });
        html += '</table>';
        div.innerHTML = html;
    }

    function cargarTramitesVehiculo() {
        fetch('/api/v1/tramites/tipo/2', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        })
        .then(r => r.json())
        .then(tramites => {
            tramitesVehiculoCache = tramites;
            renderTablaVehiculos(tramitesVehiculoCache);
        })
        .catch(() => {
            document.getElementById('tramites-vehiculos').innerHTML = '<p style="color:red">Error al cargar los trámites.</p>';
        });
    }

    function actualizarEstadoVehiculo(nuevoEstado) {
        const id = document.getElementById('accion-id-vehiculo').value.trim();
        const resultado = document.getElementById('accion-resultado-vehiculo');
        if (!id || !idsVehiculoValidos.includes(Number(id))) {
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
                cargarTramitesVehiculo();
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

    // UI para aceptar/rechazar trámites de vehículo
    window.addEventListener('DOMContentLoaded', function() {
        cargarTramitesVehiculo();
        // Agregar controles para cambiar estado
        const div = document.getElementById('tramites-vehiculos');
        const controles = document.createElement('div');
        controles.innerHTML = `
            <div style="margin-top:15px;">
                <label for="accion-id-vehiculo">ID de trámite a validar:</label>
                <input type="number" id="accion-id-vehiculo" min="1" style="width:80px;">
                <button id="btn-aceptar-vehiculo">Aceptar</button>
                <button id="btn-rechazar-vehiculo">Rechazar</button>
                <span id="accion-resultado-vehiculo" style="margin-left:10px;"></span>
            </div>
        `;
        div.parentNode.insertBefore(controles, div.nextSibling);
        document.getElementById('btn-aceptar-vehiculo').onclick = function() {
            actualizarEstadoVehiculo('ACEPTADO');
        };
        document.getElementById('btn-rechazar-vehiculo').onclick = function() {
            actualizarEstadoVehiculo('RECHAZADO');
        };
    });
});
