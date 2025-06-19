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
    fetch('/api/v1/tramites/tipo/2', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    })
    .then(r => r.json())
    .then(tramites => {
        const div = document.getElementById('tramites-vehiculos');
        if (!tramites.length) {
            div.innerHTML = '<p>No hay trámites de vehículos registrados.</p>';
            return;
        }
        let html = '<table><tr><th>ID</th><th>Descripción</th><th>Usuario</th><th>Fecha</th></tr>';
        tramites.forEach(t => {
            html += `<tr><td>${t.id}</td><td>${t.descripcion}</td><td>${t.usuario?.nombre || t.usuario?.id}</td><td>${t.fechaCreacion || ''}</td></tr>`;
        });
        html += '</table>';
        div.innerHTML = html;
    })
    .catch(() => {
        document.getElementById('tramites-vehiculos').innerHTML = '<p style="color:red">Error al cargar los trámites.</p>';
    });
});
