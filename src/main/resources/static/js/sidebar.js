// sidebar.js
// Genera los enlaces de navegación en la sidebar de la plantilla index_tempate.html usando la lógica de dashboard.js

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

function getIconoSidebar(id) {
    switch (id) {
        case 'enlace-inicio': return 'bi-house-fill';
        case 'enlace-usuarios': return 'bi-people-fill';
        case 'enlace-gestion-roles': return 'bi-shield-lock-fill';
        case 'enlace-validacion-menores': return 'bi-person-badge-fill';
        case 'enlace-analisis-ia': return 'bi-cpu-fill';
        case 'enlace-colas': return 'bi-list-ol';
        case 'enlace-monitoreo-demoras': return 'bi-clock-history';
        case 'enlace-informes': return 'bi-bar-chart-fill';
        case 'enlace-menores': return 'bi-person-lines-fill';
        case 'enlace-mascota': return 'bi-paw-fill';
        case 'enlace-vehiculo': return 'bi-truck-front-fill';
        case 'enlace-sag': return 'bi-file-earmark-text-fill';
        case 'enlace-ocr': return 'bi-file-earmark-richtext-fill';
        case 'enlace-validacion-vehiculos': return 'bi-car-front-fill';
        case 'enlace-validacion-declaracion': return 'bi-file-check-fill';
        case 'enlace-validacion-mascotas': return 'bi-shield-check';
        case 'enlace-tramite-mascota': return 'bi-clipboard-plus';
        default: return 'bi-dot';
    }
}

function generarEnlacesSidebar() {
    const enlaces = [
        { id: 'enlace-inicio', href: '/index.html', texto: 'Ir al inicio', mostrar: () => true },
        { id: 'enlace-usuarios', href: '/usuarios.html', texto: 'Administrar Usuarios', mostrar: p => p.rolId == 1 },
        { id: 'enlace-gestion-roles', href: '/gestion_roles.html', texto: 'Gestión de Roles', mostrar: p => p.rolId == 1 },
        { id: 'enlace-analisis-ia', href: '/analisis_ia.html', texto: 'Análisis IA', mostrar: p => p.rolId == 1 || p.rolId == 3 },
        { id: 'enlace-colas', href: '/gestion_colas.html', texto: 'Gestión de Colas', mostrar: p => p.rolId == 1 },
        { id: 'enlace-monitoreo-demoras', href: '/monitoreo_demoras.html', texto: 'Monitoreo de Demoras', mostrar: p => p.rolId == 1 || p.rolId == 3 || p.rolId == 4 || p.rolId == 5 },
        { id: 'enlace-informes', href: '/informes.html', texto: 'Informes', mostrar: p => p.rolId == 1 },
        { id: 'enlace-menores', href: '/tramite_menores.html', texto: 'Trámite Menores', mostrar: p => [1,4,5].includes(p.rolId) },
        { id: 'enlace-tramite-mascota', href: '/tramite_mascota.html', texto: 'Trámite Mascota', mostrar: p => p.rolId == 5 || p.rolId == 4 || p.rolId == 1 },
        { id: 'enlace-vehiculo', href: '/tramite_vehiculo.html', texto: 'Trámite Vehículo', mostrar: p => p.rolId == 1 || p.rolId == 4 || p.rolId == 5 },
        { id: 'enlace-sag', href: '/declaracion_sag.html', texto: 'Declaración SAG', mostrar: p => [1,4,5].includes(p.rolId) },
        { id: 'enlace-ocr', href: '/ocr.html', texto: 'Ingresar OCR', mostrar: p => [1,4,5].includes(p.rolId) },
        { id: 'enlace-validacion-vehiculos', href: '/validacion_vehiculos.html', texto: 'Validación Vehiculos', mostrar: p => p.rolId == 1 || p.rolId == 2 },
        { id: 'enlace-validacion-declaracion', href: '/validacion_declaracion.html', texto: 'Validación Declaración', mostrar: p => p.rolId == 1 || p.rolId == 2 },
        { id: 'enlace-validacion-mascotas', href: '/validacion_mascotas.html', texto: 'Validación Mascotas', mostrar: p => p.rolId == 2 || p.rolId == 1 },
        { id: 'enlace-validacion-menores', href: '/validacion_menores.html', texto: 'Validación Menores', mostrar: p => p.rolId == 1 || p.rolId == 3 },
    ];
    const token = checkAuth();
    if (!token) return;
    const payload = parseJwt(token);
    const contenedor = document.getElementById('sidebar-links');
    if (!contenedor) return;
    contenedor.innerHTML = '';
    let enlacesVisibles = enlaces.filter(e => e.mostrar(payload));
    enlacesVisibles.forEach(enlace => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        const a = document.createElement('a');
        a.className = 'nav-link';
        a.href = enlace.href;
        a.id = enlace.id;
        // Agregar icono
        const icon = document.createElement('i');
        icon.className = getIconoSidebar(enlace.id) + ' me-2';
        a.appendChild(icon);
        a.appendChild(document.createTextNode(enlace.texto));
        li.appendChild(a);
        contenedor.appendChild(li);
    });
    // Botón de cerrar sesión
    const liSesion = document.createElement('li');
    liSesion.className = 'nav-item mt-auto';
    const btnCerrar = document.createElement('button');
    btnCerrar.id = 'btn-cerrar-sesion';
    btnCerrar.className = 'btn btn-danger w-100';
    btnCerrar.textContent = 'Cerrar sesión';
    btnCerrar.onclick = function() {
        localStorage.removeItem('jwt');
        window.location.href = '/login.html';
    };
    liSesion.appendChild(btnCerrar);
    contenedor.appendChild(liSesion);
}

document.addEventListener('DOMContentLoaded', function() {
    generarEnlacesSidebar();
    // Ocultar el enlace de Trámite Menores en el sidebar si existe (para tramite_menores.html)
    if (window.location.pathname.endsWith('/tramite_menores.html')) {
        setTimeout(function() {
            var enlaceMenores = document.getElementById('enlace-menores');
            if (enlaceMenores) enlaceMenores.style.display = 'none';
        }, 200);
    }
    if (window.location.pathname.endsWith('/validacion_mascotas.html')) {
        setTimeout(function() {
            var enlaceValidacionMascotas = document.getElementById('enlace-validacion-mascotas');
            if (enlaceValidacionMascotas) enlaceValidacionMascotas.style.display = 'none';
        }, 200);
    }
    if (window.location.pathname.endsWith('/validacion_menores.html')) {
        setTimeout(function() {
            var enlaceValidacionMenores = document.getElementById('enlace-validacion-menores');
            if (enlaceValidacionMenores) enlaceValidacionMenores.style.display = 'none';
        }, 200);
    }
    if (window.location.pathname.endsWith('/validacion_vehiculos.html')) {
        setTimeout(function() {
            var enlaceValidacionVehiculos = document.getElementById('enlace-validacion-vehiculos');
            if (enlaceValidacionVehiculos) enlaceValidacionVehiculos.style.display = 'none';
        }, 200);
    }
});