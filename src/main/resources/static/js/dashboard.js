// dashboard.js

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

function getNombreRol(rolId) {
    switch (rolId) {
        case 1: return 'Administrador';
        case 2: return 'Inspector';
        case 3: return 'Funcionario';
        case 4: return 'Viajero';
        case 5: return 'Transportista';
        default: return 'Usuario';
    }
}

function mostrarUsuarioAutenticado() {
    const token = checkAuth();
    if (!token) return;
    const payload = parseJwt(token);
    const div = document.getElementById('usuario-autenticado');
    if (payload) {
        div.innerHTML = `<b>Usuario:</b> ${payload.sub} | <b>Rol:</b> ${getNombreRol(payload.rolId)}`;
    }
}

function generarEnlacesDashboard() {
    const enlaces = [
        { id: 'enlace-inicio', href: '/index.html', texto: 'Ir al inicio', mostrar: () => true },
        { id: 'enlace-usuarios', href: '/usuarios.html', texto: 'Administrar Usuarios', mostrar: p => p.rolId == 1 },
        // Enlace solo visible para el administrador
        { id: 'enlace-gestion-roles', href: '/gestion_roles.html', texto: 'Gestión de Roles', mostrar: p => p.rolId == 1 },
        { id: 'enlace-validacion-menores', href: '/validacion_menores.html', texto: 'Validación Menores', mostrar: p => p.rolId == 1 || p.rolId == 3 },
        { id: 'enlace-analisis-ia', href: '/analisis_ia.html', texto: 'Análisis IA', mostrar: p => p.rolId == 1 || p.rolId == 3 },
        { id: 'enlace-colas', href: '/gestion_colas.html', texto: 'Gestión de Colas', mostrar: p => p.rolId == 1 },
        { id: 'enlace-monitoreo-demoras', href: '/monitoreo_demoras.html', texto: 'Monitoreo de Demoras', mostrar: p => p.rolId == 1 || p.rolId == 3 || p.rolId == 4 || p.rolId == 5 },
        { id: 'enlace-informes', href: '/informes.html', texto: 'Informes', mostrar: p => p.rolId == 1 },
        { id: 'enlace-menores', href: '/tramite_menores.html', texto: 'Trámite Menores', mostrar: p => [1,4,5].includes(p.rolId) },
        { id: 'enlace-mascota', href: '/registro_mascota.html', texto: 'Registro de Mascotas', mostrar: p => p.rolId == 1 || p.rolId == 4 || p.rolId == 5 },
        { id: 'enlace-vehiculo', href: '/tramite_vehiculo.html', texto: 'Trámite Vehículo', mostrar: p => p.rolId == 1 || p.rolId == 4 || p.rolId == 5 },
        { id: 'enlace-sag', href: '/declaracion_sag.html', texto: 'Declaración SAG', mostrar: p => [1,4,5].includes(p.rolId) },
        { id: 'enlace-ocr', href: '/ocr.html', texto: 'Ingresar OCR', mostrar: p => [1,4,5].includes(p.rolId) },
        { id: 'enlace-validacion-vehiculos', href: '/validacion_vehiculos.html', texto: 'Validación Vehiculos', mostrar: p => p.rolId == 1 || p.rolId == 2 },
        { id: 'enlace-validacion-declaracion', href: '/validacion_declaracion.html', texto: 'Validación Declaración', mostrar: p => p.rolId == 1 || p.rolId == 2 },
        { id: 'enlace-validacion-mascotas', href: '/validacion_mascotas.html', texto: 'Validación Mascotas', mostrar: p => p.rolId == 2 },
        { id: 'enlace-tramite-mascota', href: '/tramite_mascota.html', texto: 'Trámite Mascota', mostrar: p => p.rolId == 3 || p.rolId == 4 },
    ];
    const token = localStorage.getItem('jwt');
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const contenedor = document.getElementById('enlaces-dashboard');
    contenedor.innerHTML = '';
    let enlacesVisibles = enlaces.filter(e => e.mostrar(payload));
    enlacesVisibles = enlacesVisibles.filter(e => e.id !== 'enlace-mascota');
    enlacesVisibles.forEach((enlace, idx) => {
        const a = document.createElement('a');
        a.href = enlace.href;
        a.id = enlace.id;
        a.textContent = enlace.texto;
        contenedor.appendChild(a);
        if (idx < enlacesVisibles.length - 1) {
            contenedor.appendChild(document.createTextNode(' | '));
        }
    });
    // Botón de cerrar sesión
    const spanSesion = document.createElement('span');
    spanSesion.id = 'enlaces-sesion';
    spanSesion.style.display = 'inline';
    const btnCerrar = document.createElement('button');
    btnCerrar.id = 'btn-cerrar-sesion';
    btnCerrar.style.marginLeft = '10px';
    btnCerrar.textContent = 'Cerrar sesión';
    btnCerrar.onclick = function() {
        localStorage.removeItem('jwt');
        window.location.href = '/login.html';
    };
    spanSesion.appendChild(btnCerrar);
    contenedor.appendChild(spanSesion);
}

document.addEventListener('DOMContentLoaded', function() {
    mostrarUsuarioAutenticado();
    generarEnlacesDashboard();
    document.getElementById('btn-cerrar-sesion').addEventListener('click', function() {
        localStorage.removeItem('jwt');
        window.location.href = '/login.html';
    });
});
