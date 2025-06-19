// login.js

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const correo = document.getElementById('correo').value;
    const contra = document.getElementById('contra').value;
    const mensajeError = document.getElementById('mensaje-error');
    mensajeError.textContent = '';

    try {
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contra })
        });
        if (response.ok) {
            const token = await response.text();
            localStorage.setItem('jwt', token);
            window.location.href = '/dashboard.html'; // Redirigir al dashboard tras login
        } else {
            mensajeError.textContent = 'Credenciales inválidas';
        }
    } catch (error) {
        mensajeError.textContent = 'Error de conexión con el servidor';
    }
});
