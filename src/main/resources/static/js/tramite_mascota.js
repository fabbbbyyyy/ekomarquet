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
    if (!(payload.rolId == 1 || payload.rolId == 3 || payload.rolId == 4)) {
        document.getElementById('contenido-tramite-mascota').style.display = 'none';
        document.body.insertAdjacentHTML('beforeend', '<p style="color:red">Acceso solo para funcionarios, viajeros o administradores.</p>');
        return;
    }
    cargarTramitesMascota();
    document.getElementById('form-tramite-mascota').onsubmit = function(e) {
        e.preventDefault();
        registrarTramiteMascota();
    };
});

function cargarTramitesMascota() {
    fetch('/api/v1/tramites/tipo/4', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    })
    .then(r => r.json())
    .then(tramites => {
        renderTablaMascota(tramites);
    })
    .catch(() => {
        document.getElementById('tramites-mascota').innerHTML = '<p style="color:red">Error al cargar los trámites.</p>';
    });
}

function renderTablaMascota(tramites) {
    const div = document.getElementById('tramites-mascota');
    if (!tramites.length) {
        div.innerHTML = '<p>No hay trámites de mascotas registrados.</p>';
        return;
    }
    let html = '<table><tr><th>ID</th><th>Descripción</th><th>Usuario</th><th>Fecha</th><th>Estado</th></tr>';
    tramites.forEach(t => {
        html += `<tr><td>${t.id}</td><td>${t.descripcion}</td><td>${t.usuario?.nombre || t.usuario?.id}</td><td>${t.fechaCreacion || ''}</td><td>${t.estado || 'PENDIENTE'}</td></tr>`;
    });
    html += '</table>';
    div.innerHTML = html;
}

function registrarTramiteMascota() {
    const nombre = document.getElementById('nombre-mascota').value.trim();
    const tipo = document.getElementById('tipo-mascota').value.trim();
    const mensaje = document.getElementById('mensaje-tramite-mascota');
    if (!nombre || !tipo) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Debe ingresar nombre y tipo de mascota.';
        return;
    }
    const payload = JSON.parse(atob(localStorage.getItem('jwt').split('.')[1]));
    fetch('/api/v1/tramites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        body: JSON.stringify({
            tipoTramite: 4,
            descripcion: `Mascota: ${nombre}, Tipo: ${tipo}`,
            usuario: { id: payload.userId }
        })
    })
    .then(async r => {
        if (r.ok) {
            mensaje.style.color = 'green';
            mensaje.textContent = 'Trámite de mascota registrado correctamente.';
            document.getElementById('form-tramite-mascota').reset();
            cargarTramitesMascota();
        } else {
            const msg = await r.text();
            mensaje.style.color = 'red';
            mensaje.textContent = msg || 'Error al registrar el trámite.';
        }
    })
    .catch(() => {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Error de red al registrar el trámite.';
    });
}
