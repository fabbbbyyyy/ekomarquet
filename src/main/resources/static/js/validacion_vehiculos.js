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
    if (![1,2,4,5].includes(payload.rolId)) {
        document.getElementById('contenido-validacion-registros').style.display = 'none';
        document.body.insertAdjacentHTML('beforeend', '<p style="color:red">Acceso solo para administradores, inspectores, viajeros o transportistas.</p>');
        return;
    }
    let tramitesVehiculoCache = [];
    let idsVehiculoValidos = [];

    function renderTablaVehiculos(tramites) {
        const tabla = document.getElementById('tabla-tramites-vehiculos');
        let html = '';
        if (!tramites || !tramites.length) {
            html = '<thead><tr><th>ID</th><th>Patente</th><th>Marca</th><th>Modelo</th><th>Usuario</th><th>Fecha</th><th>Estado</th></tr></thead>';
            html += '<tbody><tr><td colspan="7" class="text-center">No hay trámites de vehículos registrados.</td></tr></tbody>';
            idsVehiculoValidos = [];
            tabla.innerHTML = html;
            return;
        }
        idsVehiculoValidos = tramites.map(t => t.id);
        html = `<thead>
            <tr>
                <th>ID</th>
                <th>Patente</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>`;
        tramites.forEach(t => {
            // Suponiendo que la descripción es "Patente: X, Marca: Y, Modelo: Z"
            let patente = '', marca = '', modelo = '';
            if (t.descripcion) {
                const match = t.descripcion.match(/Patente:\s*([^,]+),\s*Marca:\s*([^,]+),\s*Modelo:\s*(.+)/i);
                if (match) {
                    patente = match[1].trim();
                    marca = match[2].trim();
                    modelo = match[3].trim();
                } else {
                    patente = t.descripcion;
                }
            }
            html += `<tr>
                <td>${t.id}</td>
                <td>${patente}</td>
                <td>${marca}</td>
                <td>${modelo}</td>
                <td>${t.usuario?.nombre || t.usuario?.id || ''}</td>
                <td>${t.fechaCreacion ? new Date(t.fechaCreacion).toLocaleString() : ''}</td>
                <td>${t.estado || 'PENDIENTE'}</td>
            </tr>`;
        });
        html += '</tbody>';
        tabla.innerHTML = html;
    }

    function cargarTramitesVehiculo() {
        fetch('/api/v1/tramites/tipo/2', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        })
        .then(async r => {
            if (!r.ok) {
                document.getElementById('tabla-tramites-vehiculos').innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error al cargar los trámites.</td></tr>';
                return;
            }
            let tramites = await r.json();
            // Si la respuesta es null o vacía, forzar array vacío
            if (!tramites) tramites = [];
            renderTablaVehiculos(tramites);
        })
        .catch(() => {
            document.getElementById('tabla-tramites-vehiculos').innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error al cargar los trámites.</td></tr>';
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
        const tabla = document.getElementById('tabla-tramites-vehiculos');
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
        // Insertar controles después de la tabla, dentro de custom-block
        const customBlock = tabla.closest('.custom-block');
        if (customBlock) {
            customBlock.appendChild(controles);
        }
        document.getElementById('btn-aceptar-vehiculo').onclick = function() {
            actualizarEstadoVehiculo('ACEPTADO');
        };
        document.getElementById('btn-rechazar-vehiculo').onclick = function() {
            actualizarEstadoVehiculo('RECHAZADO');
        };
    });
});
