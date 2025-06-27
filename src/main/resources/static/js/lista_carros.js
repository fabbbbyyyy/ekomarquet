// lista_carros.js

// Verifica si el usuario está autenticado mediante JWT en localStorage
function checkAuth() {
    const token = localStorage.getItem('jwt');
    if (!token) {
        window.location.href = '/login.html';
        return null;
    }
    return token;
}

// Decodifica el JWT para obtener el payload (datos del usuario)
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

// Muestra el usuario autenticado en la interfaz
function mostrarUsuarioAutenticado() {
    const token = checkAuth();
    if (!token) return;
    const payload = parseJwt(token);
    const div = document.getElementById('usuario-autenticado');
    if (payload) {
        div.innerHTML = `<b>Usuario:</b> ${payload.sub || payload.email || ''}`;
    }
}

// Carga la lista de carros desde la API
async function cargarCarros() {
    const token = checkAuth();
    try {
        const response = await fetch('/api/v1/carros', {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if (!response.ok) throw new Error('No se pudo cargar la lista de carros');
        const carros = await response.json();
        mostrarTablaCarros(carros);
    } catch (error) {
        document.getElementById('tabla-carros').innerHTML = `<tr><td colspan="6" style="color:red">${error.message}</td></tr>`;
    }
}

// Muestra la tabla de carros con botones para editar nombre, sala y cantidad de equipos
function mostrarTablaCarros(carros) {
    let html = `<thead>
        <tr>
            <th>ID</th><th>Nombre</th><th>Sala</th><th>Cant. Equipos</th><th>Acciones</th>
        </tr>
    </thead>
    <tbody>`;
    carros.forEach(carro => {
        html += `<tr data-id="${carro.id}">
            <td>${carro.id}</td>
            <td><span class="carro-nombre" data-id="${carro.id}">${carro.nombreCarro}</span></td>
            <td><span class="carro-sala" data-id="${carro.id}">${carro.sala}</span></td>
            <td><span class="carro-equipos" data-id="${carro.id}">${carro.cantidadEquipos}</span></td>
            <td>
                <button class="btn btn-outline-primary btn-sm btn-editar-nombre" data-id="${carro.id}">Editar Nombre</button>
                <button class="btn btn-outline-secondary btn-sm btn-editar-sala" data-id="${carro.id}">Editar Sala</button>
                <button class="btn btn-outline-success btn-sm btn-editar-equipos" data-id="${carro.id}">Editar Equipos</button>
                <span class="text-danger ms-2 error-msg" style="display:none;"></span>
            </td>
        </tr>`;
    });
    html += '</tbody>';
    document.getElementById('tabla-carros').innerHTML = html;
    agregarEventosEdicion();
}

function limpiarErrores(tr) {
    const error = tr.querySelector('.error-msg');
    if (error) {
        error.style.display = 'none';
        error.textContent = '';
    }
}

function mostrarError(tr, mensaje) {
    const error = tr.querySelector('.error-msg');
    if (error) {
        error.textContent = mensaje;
        error.style.display = 'inline';
    }
}

function cerrarEdicionesActivas() {
    document.querySelectorAll('.input-nombre, .input-sala, .input-equipos').forEach(input => {
        const tr = input.closest('tr');
        if (input.classList.contains('input-nombre')) {
            const span = tr.querySelector('.carro-nombre');
            span.textContent = input.defaultValue;
        } else if (input.classList.contains('input-sala')) {
            const span = tr.querySelector('.carro-sala');
            span.textContent = input.defaultValue;
        } else if (input.classList.contains('input-equipos')) {
            const span = tr.querySelector('.carro-equipos');
            span.textContent = input.defaultValue;
        }
        limpiarErrores(tr);
    });
}

// Agrega eventos a los botones de edición
function agregarEventosEdicion() {
    document.querySelectorAll('.btn-editar-nombre').forEach(btn => {
        btn.addEventListener('click', function() {
            cerrarEdicionesActivas();
            const id = this.getAttribute('data-id');
            const tr = this.closest('tr');
            limpiarErrores(tr);
            const span = tr.querySelector('.carro-nombre');
            const valorActual = span.textContent;
            if (tr.querySelector('.input-nombre')) return;
            span.innerHTML = `<input type="text" class="form-control form-control-sm input-nombre" value="${valorActual}" style="width:auto;display:inline-block;"> <span style='display:inline-block;width:0.7rem;'></span><button class='btn btn-success btn-xs btn-guardar-nombre ms-1' style='font-size:0.8rem;padding:0.15rem 0.5rem;'>Guardar</button> <button class='btn btn-secondary btn-xs btn-cancelar-nombre ms-1' style='font-size:0.8rem;padding:0.15rem 0.5rem;'>Cancelar</button>`;
            tr.querySelector('.btn-guardar-nombre').onclick = function() {
                const nuevoNombre = tr.querySelector('.input-nombre').value.trim();
                if (!nuevoNombre) {
                    mostrarError(tr, 'El nombre no puede estar vacío.');
                    return;
                }
                // Obtener los valores actuales de los otros campos
                const sala = tr.querySelector('.carro-sala').textContent;
                const cantidadEquipos = parseInt(tr.querySelector('.carro-equipos').textContent);
                actualizarCarro(id, { nombreCarro: nuevoNombre, sala, cantidadEquipos });
            };
            tr.querySelector('.btn-cancelar-nombre').onclick = function() {
                span.textContent = valorActual;
                limpiarErrores(tr);
            };
        });
    });
    document.querySelectorAll('.btn-editar-sala').forEach(btn => {
        btn.addEventListener('click', function() {
            cerrarEdicionesActivas();
            const id = this.getAttribute('data-id');
            const tr = this.closest('tr');
            limpiarErrores(tr);
            const span = tr.querySelector('.carro-sala');
            const valorActual = span.textContent;
            if (tr.querySelector('.input-sala')) return;
            span.innerHTML = `<input type="text" class="form-control form-control-sm input-sala" value="${valorActual}" style="width:auto;display:inline-block;"> <span style='display:inline-block;width:0.7rem;'></span><button class='btn btn-success btn-xs btn-guardar-sala ms-1' style='font-size:0.8rem;padding:0.15rem 0.5rem;'>Guardar</button> <button class='btn btn-secondary btn-xs btn-cancelar-sala ms-1' style='font-size:0.8rem;padding:0.15rem 0.5rem;'>Cancelar</button>`;
            tr.querySelector('.btn-guardar-sala').onclick = function() {
                const nuevaSala = tr.querySelector('.input-sala').value.trim();
                if (!nuevaSala) {
                    mostrarError(tr, 'La sala no puede estar vacía.');
                    return;
                }
                // Obtener los valores actuales de los otros campos
                const nombreCarro = tr.querySelector('.carro-nombre').textContent;
                const cantidadEquipos = parseInt(tr.querySelector('.carro-equipos').textContent);
                actualizarCarro(id, { nombreCarro, sala: nuevaSala, cantidadEquipos });
            };
            tr.querySelector('.btn-cancelar-sala').onclick = function() {
                span.textContent = valorActual;
                limpiarErrores(tr);
            };
        });
    });
    document.querySelectorAll('.btn-editar-equipos').forEach(btn => {
        btn.addEventListener('click', function() {
            cerrarEdicionesActivas();
            const id = this.getAttribute('data-id');
            const tr = this.closest('tr');
            limpiarErrores(tr);
            const span = tr.querySelector('.carro-equipos');
            const valorActual = span.textContent;
            if (tr.querySelector('.input-equipos')) return;
            span.innerHTML = `<input type="number" min="0" class="form-control form-control-sm input-equipos" value="${valorActual}" style="width:auto;display:inline-block;"> <span style='display:inline-block;width:0.7rem;'></span><button class='btn btn-success btn-xs btn-guardar-equipos ms-1' style='font-size:0.8rem;padding:0.15rem 0.5rem;'>Guardar</button> <button class='btn btn-secondary btn-xs btn-cancelar-equipos ms-1' style='font-size:0.8rem;padding:0.15rem 0.5rem;'>Cancelar</button>`;
            tr.querySelector('.btn-guardar-equipos').onclick = function() {
                const nuevaCantidad = tr.querySelector('.input-equipos').value.trim();
                if (nuevaCantidad === '' || isNaN(nuevaCantidad) || parseInt(nuevaCantidad) < 0) {
                    mostrarError(tr, 'Ingrese un número válido de equipos.');
                    return;
                }
                // Obtener los valores actuales de los otros campos
                const nombreCarro = tr.querySelector('.carro-nombre').textContent;
                const sala = tr.querySelector('.carro-sala').textContent;
                actualizarCarro(id, { nombreCarro, sala, cantidadEquipos: parseInt(nuevaCantidad) });
            };
            tr.querySelector('.btn-cancelar-equipos').onclick = function() {
                span.textContent = valorActual;
                limpiarErrores(tr);
            };
        });
    });
}

// Actualiza el carro en la API
async function actualizarCarro(id, cambios) {
    const token = checkAuth();
    try {
        const response = await fetch(`/api/v1/carros/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(cambios)
        });
        const tr = document.querySelector(`tr[data-id='${id}']`);
        if (!response.ok) {
            const errorText = await response.text();
            mostrarError(tr, 'Error al actualizar: ' + errorText);
        } else {
            mostrarExito(tr, 'Actualización exitosa');
            // Espera 4 segundos antes de recargar la tabla para que el mensaje sea visible
            setTimeout(() => cargarCarros(), 4000);
        }
    } catch (e) {
        const tr = document.querySelector(`tr[data-id='${id}']`);
        mostrarError(tr, 'Error de red o inesperado: ' + e.message);
    }
}

function mostrarExito(tr, mensaje) {
    const error = tr.querySelector('.error-msg');
    if (error) {
        // Cierra cualquier campo de edición activo en la fila inmediatamente
        ['input-nombre', 'input-sala', 'input-equipos'].forEach(clase => {
            const input = tr.querySelector('.' + clase);
            if (input) {
                const span = input.parentElement;
                let nuevoValor = input.value;
                span.textContent = nuevoValor;
            }
        });
        error.textContent = mensaje;
        error.style.display = 'inline';
        error.classList.remove('text-danger');
        error.classList.add('text-success');
        setTimeout(() => {
            error.style.display = 'none';
            error.classList.remove('text-success');
            error.classList.add('text-danger');
        }, 4000);
    }
}

// Inicializa la vista al cargar el DOM

document.addEventListener('DOMContentLoaded', () => {
    mostrarUsuarioAutenticado();
    cargarCarros();
    // Asegura que el botón de cerrar sesión funcione
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
