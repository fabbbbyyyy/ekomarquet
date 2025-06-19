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
    if (payload.rolId != 2 && payload.rolId != 1) {
        document.getElementById('contenido-validacion-declaracion').style.display = 'none';
        document.body.insertAdjacentHTML('beforeend', '<p style="color:red">Acceso solo para inspectores o administradores.</p>');
        return;
    }
    fetch('/api/v1/tramites/tipo/3', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    })
    .then(r => r.json())
    .then(tramites => {
        const div = document.getElementById('tramites-declaracion');
        if (!tramites.length) {
            div.innerHTML = '<p>No hay declaraciones SAG registradas.</p>';
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
        document.getElementById('tramites-declaracion').innerHTML = '<p style="color:red">Error al cargar las declaraciones.</p>';
    });
});

