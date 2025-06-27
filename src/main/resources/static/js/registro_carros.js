// registro_carros.js

function checkAuth() {
    const token = localStorage.getItem('jwt');
    if (!token) {
        window.location.href = '/login.html';
        return null;
    }
    return token;
}

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

function mostrarUsuarioAutenticado() {
    const token = checkAuth();
    if (!token) return;
    const payload = parseJwt(token);
    const div = document.getElementById('usuario-autenticado');
    if (payload) {
        div.innerHTML = `<b>Usuario:</b> ${payload.sub || payload.email || ''}`;
    }
}

async function cargarRegistros() {
    const token = checkAuth();
    try {
        const response = await fetch('/api/v1/registro-carros', {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if (!response.ok) throw new Error('No se pudo cargar el listado');
        const registros = await response.json();
        mostrarTablaRegistros(registros);
    } catch (error) {
        document.getElementById('tabla-registro-carros').innerHTML = `<tr><td colspan="11" style="color:red">${error.message}</td></tr>`;
    }
}

// Renderiza la tabla de registros de carros con select de estado y color
function mostrarTablaRegistros(registros) {
    let html = `<thead>
        <tr>
            <th>ID</th><th>Docente</th><th>RUT</th><th>Carro</th><th>Equipos</th><th>Sala</th><th>Fecha</th><th>Préstamo</th><th>Entrega</th><th>Responsable</th><th>Estado</th><th>Acción</th>
        </tr>
    </thead>
    <tbody>`;
    registros.forEach(reg => {
        let estadoClass = reg.estadoPrestamo === 'PRESTADO' ? 'select-prestado' : (reg.estadoPrestamo === 'ENTREGADO' ? 'select-entregado' : '');
        html += `<tr data-id="${reg.id}">
            <td>${reg.id}</td>
            <td>${reg.nombreDocente}</td>
            <td>${reg.rutDocente}</td>
            <td>${reg.nombreCarro}</td>
            <td>${reg.cantidadEquipos}</td>
            <td>${reg.sala}</td>
            <td>${reg.fechaDia}</td>
            <td>${reg.horaPrestamo ? reg.horaPrestamo.replace('T', ' ') : ''}</td>
            <td>${reg.horaEntrega ? reg.horaEntrega.replace('T', ' ') : ''}</td>
            <td>${reg.nombreResponsable}</td>
            <td>
                <select class="form-select form-select-sm estado-prestamo-select" data-id="${reg.id}" data-estado="${reg.estadoPrestamo}">
                    <option value="PRESTADO" ${reg.estadoPrestamo === 'PRESTADO' ? 'selected' : ''}>Prestado</option>
                    <option value="ENTREGADO" ${reg.estadoPrestamo === 'ENTREGADO' ? 'selected' : ''}>Entregado</option>
                </select>
            </td>
            <td><button class="btn btn-primary btn-sm btn-guardar-estado" data-id="${reg.id}">Guardar</button></td>
        </tr>`;
    });
    html += '</tbody>';
    document.getElementById('tabla-registro-carros').innerHTML = html;
    // Asignar color después de renderizar
    document.querySelectorAll('.estado-prestamo-select').forEach(select => {
        if (select.getAttribute('data-estado') === 'PRESTADO') {
            select.classList.add('select-prestado');
        } else if (select.getAttribute('data-estado') === 'ENTREGADO') {
            select.classList.add('select-entregado');
        }
    });
    agregarEventosCambioEstado();
}

function agregarEventosCambioEstado() {
    document.querySelectorAll('.btn-guardar-estado').forEach(btn => {
        btn.addEventListener('click', async function() {
            const id = this.getAttribute('data-id');
            const select = document.querySelector(`select[data-id='${id}']`);
            const nuevoEstado = select.value;
            const token = checkAuth();
            this.disabled = true;
            this.textContent = 'Guardando...';
            try {
                const response = await fetch(`/api/v1/registro-carros/${id}/estado`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(nuevoEstado)
                });
                if (response.ok) {
                    // Cambia el color del select según el nuevo estado
                    select.classList.remove('select-prestado', 'select-entregado');
                    if (nuevoEstado === 'PRESTADO') {
                        select.classList.add('select-prestado');
                    } else if (nuevoEstado === 'ENTREGADO') {
                        select.classList.add('select-entregado');
                    }
                    mostrarExito(this.closest('tr'), 'Estado actualizado');
                } else {
                    const errorText = await response.text();
                    mostrarError(this.closest('tr'), 'Error: ' + errorText);
                }
            } catch (e) {
                mostrarError(this.closest('tr'), 'Error de red: ' + e.message);
            } finally {
                this.disabled = false;
                this.textContent = 'Guardar';
            }
        });
    });
    // Cambia el color dinámicamente al cambiar el select
    document.querySelectorAll('.estado-prestamo-select').forEach(select => {
        select.addEventListener('change', function() {
            this.classList.remove('select-prestado', 'select-entregado');
            if (this.value === 'PRESTADO') {
                this.classList.add('select-prestado');
            } else if (this.value === 'ENTREGADO') {
                this.classList.add('select-entregado');
            }
        });
    });
}

function mostrarExito(tr, mensaje) {
    let msg = tr.querySelector('.estado-msg');
    if (!msg) {
        msg = document.createElement('span');
        msg.className = 'estado-msg text-success ms-2';
        tr.querySelector('td:last-child').appendChild(msg);
    }
    msg.textContent = mensaje;
    msg.style.display = 'inline';
    setTimeout(() => { msg.style.display = 'none'; }, 4000);
}

function mostrarError(tr, mensaje) {
    let msg = tr.querySelector('.estado-msg');
    if (!msg) {
        msg = document.createElement('span');
        msg.className = 'estado-msg text-danger ms-2';
        tr.querySelector('td:last-child').appendChild(msg);
    }
    msg.textContent = mensaje;
    msg.style.display = 'inline';
    setTimeout(() => { msg.style.display = 'none'; }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarUsuarioAutenticado();
    cargarRegistros();
    setTimeout(function() {
        var logoutBtn = document.getElementById('dropdown-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('jwt');
                window.location.href = '/login.html';
            });
        }
    }, 200);
});
