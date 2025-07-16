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
        const transporte = document.getElementById('transporte-mascota').value.trim();
        const microchip = document.getElementById('microchip-mascota').value.trim();
        const peso = document.getElementById('peso-mascota').value.trim();
        const rutDuenio = document.getElementById('rut-duenio').value.trim();
        const certificadoSalud = document.getElementById('certificado-salud').checked ? 'si' : 'no';
        const cartillaVacunacion = document.getElementById('cartilla-vacunacion').checked ? 'si' : 'no';
        if (!nombre || !tipo || !transporte || !microchip || !peso || !rutDuenio) {
            mensaje.style.color = 'red';
            mensaje.textContent = 'Debe completar todos los campos obligatorios.';
            return;
        }
        if (isNaN(Number(peso)) || Number(peso) <= 0) {
            mensaje.style.color = 'red';
            mensaje.textContent = 'El peso debe ser un número mayor a 0.';
            return;
        }
        const tramite = {
            tipoTramite: 4,
            descripcion: `Mascota: ${nombre}, Tipo: ${tipo}, Transporte: ${transporte}, Microchip: ${microchip}, Peso: ${peso}, RUT Dueño: ${rutDuenio}, Certificado Salud: ${certificadoSalud}, Cartilla Vacunación: ${cartillaVacunacion}`,
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
