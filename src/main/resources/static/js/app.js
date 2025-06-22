// app.js

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
        div.innerHTML = `<b>Usuario:</b> ${payload.sub} | <b>Rol:</b> ${payload.rolId == 1 ? 'Administrador' : 'Usuario'}`;
    }
}

async function cargarUsuarios() {
    const token = checkAuth();
    if (!token) {
        document.getElementById('usuarios').innerHTML = '<p style="color:red">Acceso denegado. Debes iniciar sesión como administrador.</p>';
        return;
    }
    const payload = parseJwt(token);
    if (!payload || payload.rolId != 1) {
        document.getElementById('usuarios').innerHTML = '<p style="color:red">Acceso denegado. Solo los administradores pueden ver esta página.</p>';
        return;
    }
    try {
        const response = await fetch('/api/v1/usuarios', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'same-origin'
        });
        if (response.status === 403) {
            document.getElementById('usuarios').innerHTML = '<p style="color:red">No tienes permisos de administrador.</p>';
            return;
        }
        if (!response.ok) throw new Error('Error en la respuesta');
        const usuarios = await response.json();
        const usuariosDiv = document.getElementById('usuarios');
        usuariosDiv.innerHTML = '';
        usuarios.forEach(usuario => {
            const usuarioDiv = document.createElement('div');
            usuarioDiv.classList.add('usuario');
            usuarioDiv.innerHTML = `
                <p>ID: ${usuario.id}</p>
                <p>Nombre: ${usuario.nombre}</p>
                <p>Correo: ${usuario.correo}</p>
                <p>RUT: ${usuario.rut}</p>
                <p>Apellido: ${usuario.apellido}</p>
                <p>Rol: ${usuario.rol && usuario.rol.nombre ? usuario.rol.nombre : usuario.rolId}</p>
            `;
            usuariosDiv.appendChild(usuarioDiv);
        });
    } catch (error) {
        document.getElementById('usuarios').innerHTML = '<p style="color:red">Error al cargar usuarios</p>';
    }
}

// Nueva función para integración con usuarios.html
function obtenerUsuarios(callback) {
    const token = checkAuth();
    if (!token) return callback([]);
    const payload = parseJwt(token);
    if (!payload || payload.rolId != 1) return callback([]);
    fetch('/api/v1/usuarios', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'same-origin'
    })
    .then(response => {
        if (!response.ok) return [];
        return response.json();
    })
    .then(usuarios => {
        // Normaliza el formato para la tabla
        const lista = usuarios.map(usuario => ({
            id: usuario.id,
            nombre: usuario.nombre || usuario.firstName || '',
            correo: usuario.correo || usuario.email || '',
            rolId: usuario.rolId || (usuario.rol && usuario.rol.id) || '',
        }));
        callback(lista);
    })
    .catch(() => callback([]));
}

function cerrarSesion() {
    localStorage.removeItem('jwt');
    window.location.href = '/login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('usuarios.html')) {
        mostrarUsuarioAutenticado();
        document.getElementById('btn-cerrar-sesion').addEventListener('click', cerrarSesion);
        cargarUsuarios();
    }
});
