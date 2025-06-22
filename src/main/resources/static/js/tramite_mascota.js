document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('jwt')) {
        window.location.href = '/login.html';
        return;
    }
    const payload = JSON.parse(atob(localStorage.getItem('jwt').split('.')[1]));
    const userId = payload.userId ? Number(payload.userId) : null;
    if (![1,3,4,5].includes(payload.rolId) || !userId) {
        document.getElementById('usuario-autenticado').style.display = 'none';
        document.body.insertAdjacentHTML('beforeend', '<p style="color:red">Acceso solo para funcionarios, viajeros, administradores o transportistas.</p>');
        return;
    }
    const form = document.getElementById('form-tramite-mascota');
    const mensaje = document.getElementById('mensaje-tramite-mascota');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        mensaje.textContent = '';
        const nombre = document.getElementById('nombre-mascota').value.trim();
        const tipo = document.getElementById('tipo-mascota').value.trim();
        if (!nombre || !tipo) {
            mensaje.style.color = 'red';
            mensaje.textContent = 'Debe ingresar nombre y tipo de la mascota.';
            return;
        }
        const tramite = {
            tipoTramite: 4,
            descripcion: `Mascota: ${nombre}, Tipo: ${tipo}`,
            usuario: { id: userId },
            fechaCreacion: new Date().toISOString(),
            estado: 'NO_REVISADO'
        };
        try {
            const response = await fetch('/api/v1/tramites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                },
                body: JSON.stringify(tramite)
            });
            if (response.ok) {
                mensaje.style.color = 'green';
                mensaje.textContent = 'Trámite de mascota registrado correctamente.';
                form.reset();
            } else {
                const error = await response.text();
                mensaje.style.color = 'red';
                mensaje.textContent = 'Error: ' + error;
                console.error('Error al registrar trámite:', error);
            }
        } catch (error) {
            mensaje.style.color = 'red';
            mensaje.textContent = 'Error de conexión con el servidor';
        }
    });
});
