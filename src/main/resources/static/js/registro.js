// registro.js

document.getElementById('registro-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const rut = document.getElementById('rut').value;
    const correo = document.getElementById('correo').value;
    const contra = document.getElementById('contra').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const rolId = document.getElementById('rol').value;
    const mensaje = document.getElementById('mensaje-registro');
    mensaje.style.color = 'green';
    mensaje.textContent = '';

    const usuario = {
        rut,
        correo,
        contra,
        nombre,
        apellido,
        rol: { id: rolId }
    };

    try {
        const response = await fetch('/api/v1/usuarios/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });
        if (response.ok) {
            mensaje.textContent = '¡Registro exitoso! Ahora puedes iniciar sesión.';
            document.getElementById('registro-form').reset();
        } else {
            const error = await response.text();
            mensaje.style.color = 'red';
            mensaje.textContent = 'Error: ' + error;
        }
    } catch (error) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Error de conexión con el servidor';
    }
});

