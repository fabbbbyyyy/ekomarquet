document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('jwt')) {
        window.location.href = '/login.html';
        return;
    }
    const payload = JSON.parse(atob(localStorage.getItem('jwt').split('.')[1]));
    const userId = payload.userId ? Number(payload.userId) : null;
    if (![1,4,5].includes(payload.rolId) || !userId) {
        document.getElementById('usuario-autenticado').style.display = 'none';
        document.body.insertAdjacentHTML('beforeend', '<p style="color:red">Acceso solo para administradores, viajeros o transportistas, y usuario debe estar autenticado correctamente.</p>');
        return;
    }
    const form = document.getElementById('form-declaracion-sag');
    const mensaje = document.getElementById('mensaje-declaracion-sag');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        mensaje.textContent = '';
        const producto = document.getElementById('producto-sag').value.trim();
        const cantidad = document.getElementById('cantidad-sag').value.trim();
        const pais = document.getElementById('pais-origen-sag').value.trim();
        if (!producto || !cantidad || !pais) {
            mensaje.style.color = 'red';
            mensaje.textContent = 'Debe ingresar producto, cantidad y país de origen.';
            return;
        }
        const tramite = {
            tipoTramite: 3,
            descripcion: `Producto: ${producto}, Cantidad: ${cantidad}, País de origen: ${pais}`,
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
                mensaje.textContent = 'Declaración SAG registrada correctamente.';
                form.reset();
            } else {
                const error = await response.text();
                mensaje.style.color = 'red';
                mensaje.textContent = 'Error: ' + error;
                console.error('Error al registrar declaración:', error);
            }
        } catch (error) {
            mensaje.style.color = 'red';
            mensaje.textContent = 'Error de conexión con el servidor';
        }
    });
});
