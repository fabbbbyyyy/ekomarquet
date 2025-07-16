// tramite_menores.js

document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('jwt')) {
        window.location.href = '/login.html';
        return;
    }
    const payload = JSON.parse(atob(localStorage.getItem('jwt').split('.')[1]));
    const userId = payload.userId ? Number(payload.userId) : null;
    if (![1,4,5].includes(payload.rolId) || !userId) {
        document.getElementById('contenido-tramite-menores').style.display = 'none';
        document.body.insertAdjacentHTML('beforeend', '<p style="color:red">Acceso solo para administradores, viajeros o transportistas, y usuario debe estar autenticado correctamente.</p>');
        return;
    }
    const form = document.getElementById('form-tramite-menores');
    const mensaje = document.getElementById('mensaje-tramite-menores');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        mensaje.textContent = '';
        const nombre = document.getElementById('nombre-menor').value;
        const edad = document.getElementById('edad-menor').value;
        const rut = document.getElementById('rut-menor').value;
        const documento = document.getElementById('doc-menor').value;
        const visa = document.getElementById('visa-menor').checked ? 'si' : 'no';
        if (Number(edad) >= 18) {
            mensaje.style.color = 'red';
            mensaje.textContent = 'El menor ya es mayor de edad. Solo se permiten menores de 18 años.';
            return;
        }
        const tramite = {
            tipoTramite: 1,
            descripcion: `Nombre: ${nombre}, Edad: ${edad}, RUT: ${rut}, Documento: ${documento}, Visa: ${visa}`,
            usuario: { id: userId },
            fechaCreacion: new Date().toISOString(),
            estado: 'NO_REVISADO'
        };
        console.log('Trámite a enviar:', tramite);
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
                mensaje.textContent = 'Tramite menor registrado correctamente';
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
