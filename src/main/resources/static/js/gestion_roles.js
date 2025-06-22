// gestion_roles.js

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

// Muestra el usuario autenticado y su rol en la interfaz
function mostrarUsuarioAutenticado() {
    const token = checkAuth();
    if (!token) return;
    const payload = parseJwt(token);
    const div = document.getElementById('usuario-autenticado');
    if (payload) {
        div.innerHTML = `<b>Usuario:</b> ${payload.sub} | <b>Rol:</b> ${payload.rolId == 1 ? 'Administrador' : 'Usuario'}`;
    }
}

// Carga la lista de roles desde la API
async function cargarRoles() {
    const token = checkAuth();
    const response = await fetch('/api/v1/roles', {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    if (!response.ok) return [];
    return await response.json();
}

// Carga la lista de usuarios y roles, y muestra la tabla de gestión de roles
async function cargarUsuarios() {
    const token = checkAuth();
    const payload = parseJwt(token);
    // Solo permite acceso a administradores
    if (!payload || payload.rolId != 1) {
        document.getElementById('tabla-usuarios-roles').innerHTML = '<tr><td colspan="7" style="color:red">Acceso denegado. Solo los administradores pueden ver esta página.</td></tr>';
        return;
    }
    try {
        // Carga usuarios y roles en paralelo
        const [usuarios, roles] = await Promise.all([
            fetch('/api/v1/usuarios', {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(r => r.json()),
            cargarRoles()
        ]);
        mostrarTablaUsuarios(usuarios, roles);
    } catch (error) {
        document.getElementById('tabla-usuarios-roles').innerHTML = '<tr><td colspan="7" style="color:red">Error al cargar usuarios o roles</td></tr>';
    }
}

// Muestra la tabla de usuarios con un selector de roles para cada uno
function mostrarTablaUsuarios(usuarios, roles) {
    let html = `<thead>
        <tr>
            <th>ID</th><th>Nombre</th><th>Apellido</th><th>Correo</th><th>RUT</th><th>Rol</th><th>Acción</th>
        </tr>
    </thead>
    <tbody>`;
    usuarios.forEach(usuario => {
        html += `<tr>
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.apellido}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.rut}</td>
            <td>
                <select data-user-id="${usuario.id}" class="form-select selector-rol">
                    ${roles.map(rol => `<option value="${rol.id}" ${usuario.rol && usuario.rol.id === rol.id ? 'selected' : ''}>${rol.nombre}</option>`).join('')}
                </select>
            </td>
            <td><button class="btn btn-primary btn-sm btn-guardar-rol" data-user-id="${usuario.id}">Guardar</button></td>
        </tr>`;
    });
    html += '</tbody>';
    const tabla = document.getElementById('tabla-usuarios-roles');
    tabla.innerHTML = html;
    agregarEventosCambioRol(roles);
}

// Modificado: muestra el error real y deshabilita el botón mientras se procesa
function agregarEventosCambioRol(roles) {
    document.querySelectorAll('.btn-guardar-rol').forEach(btn => {
        btn.addEventListener('click', async function() {
            const userId = this.getAttribute('data-user-id');
            const select = document.querySelector(`select[data-user-id='${userId}']`);
            const nuevoRolId = select.value;
            const rolSeleccionado = roles.find(r => r.id == nuevoRolId);
            if (!rolSeleccionado) return;
            const token = checkAuth();
            this.disabled = true;
            this.textContent = 'Guardando...';
            try {
                const response = await fetch(`/api/v1/usuarios/${userId}/rol`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(rolSeleccionado)
                });
                if (response.ok) {
                    alert('Rol actualizado correctamente');
                } else {
                    const errorText = await response.text();
                    alert('Error al actualizar el rol: ' + errorText);
                }
            } catch (e) {
                alert('Error de red o inesperado: ' + e.message);
            } finally {
                this.disabled = false;
                this.textContent = 'Guardar';
            }
        });
    });
}

// Inicializa la vista al cargar el DOM
// Muestra usuario autenticado, agrega evento de cerrar sesión y carga usuarios

document.addEventListener('DOMContentLoaded', () => {
    mostrarUsuarioAutenticado();
    cargarUsuarios();
});
