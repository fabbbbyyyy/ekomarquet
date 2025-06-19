document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const correo = document.getElementById('correo').value;
    const contra = document.getElementById('contra').value;

    // Cambia la URL para apuntar al backend correcto
    const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contra })
    });

    const mensaje = document.getElementById('mensaje');
    if (response.ok) {
        const token = await response.text();
        localStorage.setItem('jwt', token);
        mensaje.textContent = 'Login exitoso';
        // Redirige o carga contenido protegido aquí
    } else {
        mensaje.textContent = 'Credenciales inválidas';
    }
});