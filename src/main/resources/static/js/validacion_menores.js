document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('jwt')) {
        window.location.href = '/login.html';
        return;
    }
    // Control de sesión universal
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
    if (payload.rolId != 3 && payload.rolId != 1) {
        if(document.getElementById('panel-accion-menor'))
            document.getElementById('panel-accion-menor').style.display = 'none';
        document.body.insertAdjacentHTML('beforeend', '<p style="color:red">Acceso solo para funcionarios o administradores.</p>');
        return;
    }
    let tramitesMenoresCache = [];
    let idsMenoresValidos = [];

    function renderTablaMenores(tramites) {
        const div = document.getElementById('tramites-menores');
        let html = '';
        if (!tramites.length) {
            html = `<table class="table table-striped table-bordered align-middle"><thead><tr><th>ID</th><th>Nombre</th><th>Edad</th><th>Usuario</th><th>Fecha</th><th>Estado</th></tr></thead><tbody><tr><td colspan="6" class="text-center">No hay trámites de menores registrados.</td></tr></tbody></table>`;
            idsMenoresValidos = [];
            div.innerHTML = html;
            return;
        }
        idsMenoresValidos = tramites.map(t => t.id);
        html = '<table class="table table-striped table-bordered align-middle"><thead><tr><th>ID</th><th>Nombre</th><th>Edad</th><th>Usuario</th><th>Fecha</th><th>Estado</th></tr></thead><tbody>';
        tramites.forEach(t => {
            // Suponiendo que la descripción es "Nombre: X, Edad: Y"
            let nombre = '', edad = '';
            if (t.descripcion) {
                const match = t.descripcion.match(/Nombre:\s*([^,]+),\s*Edad:\s*(.+)/i);
                if (match) {
                    nombre = match[1].trim();
                    edad = match[2].trim();
                } else {
                    nombre = t.descripcion;
                }
            }
            html += `<tr><td>${t.id}</td><td>${nombre}</td><td>${edad}</td><td>${t.usuario?.nombre || t.usuario?.id || ''}</td><td>${t.fechaCreacion || ''}</td><td>${t.estado || 'PENDIENTE'}</td></tr>`;
        });
        html += '</tbody></table>';
        div.innerHTML = html;
    }

    function cargarTramitesMenores() {
        fetch('/api/v1/tramites/tipo/1', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        })
        .then(r => r.json())
        .then(tramites => {
            tramitesMenoresCache = tramites;
            renderTablaMenores(tramitesMenoresCache);
        })
        .catch(() => {
            document.getElementById('tramites-menores').innerHTML = '<p style="color:red">Error al cargar los trámites.</p>';
        });
    }

    function actualizarEstadoMenor(nuevoEstado) {
        const id = document.getElementById('accion-id-menor').value.trim();
        const resultado = document.getElementById('accion-resultado-menor');
        if (!id || !idsMenoresValidos.includes(Number(id))) {
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
                cargarTramitesMenores();
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

    // Inicialización de tabla y controles
    cargarTramitesMenores();
    document.getElementById('btn-aceptar-menor').onclick = function() {
        actualizarEstadoMenor('ACEPTADO');
    };
    document.getElementById('btn-rechazar-menor').onclick = function() {
        actualizarEstadoMenor('RECHAZADO');
    };
});
