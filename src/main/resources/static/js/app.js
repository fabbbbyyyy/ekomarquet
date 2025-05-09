async function cargarUsuarios() {
    const contenedor = document.getElementById("usuarios");
    contenedor.innerHTML = "<p>Cargando...</p>";

    try {
        const response = await fetch("http://localhost:8080/api/v1/usuarios");
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const usuarios = await response.json();

        if (usuarios.length === 0) {
            contenedor.innerHTML = "<p>No hay usuarios registrados</p>";
        } else {
            contenedor.innerHTML = usuarios.map(usuario => `
                <div class="usuario">
                    <h3>${usuario.nombre} ${usuario.apellido}</h3>
                    <p>RUT: ${usuario.rut}</p>
                    <p>Rol: ${usuario.rol.nombre}</p>
                </div>
            `).join("");
        }
    } catch (error) {
        contenedor.innerHTML = `
            <p class="error">Error al cargar usuarios: ${error.message}</p>
        `;
        console.error("Detalle del error:", error);
    }
}

async function cargarProductos() {
    // 1. Obtenemos el contenedor de forma segura
    const contenedor = document.getElementById('productos-container');

    // 2. Verificamos que el elemento existe
    if (!contenedor) {
        console.error('Error: No se encontró el elemento con ID "productos-container"');
        alert('Error: Elemento contenedor no encontrado');
        return;
    }

    // 3. Mostramos estado de carga
    contenedor.innerHTML = `
        <div class="text-center my-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando productos...</p>
        </div>
    `;

    try {
        // 4. Hacemos la petición a la API
        const response = await fetch('http://localhost:8080/api/v1/productos');

        // 5. Verificamos si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }

        // 6. Procesamos los datos
        const productos = await response.json();

        // 7. Verificamos que sea un array
        if (!Array.isArray(productos)) {
            throw new Error('La respuesta no contiene un listado válido');
        }

        // 8. Generamos el HTML según los resultados
        if (productos.length === 0) {
            contenedor.innerHTML = `
                <div class="alert alert-info">
                    No hay productos disponibles
                </div>
            `;
        } else {
            contenedor.innerHTML = `
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productos.map(producto => `
                            <tr>
                                <td>${producto.id}</td>
                                <td>${producto.nombre}</td>
                                <td>$${producto.precio.toLocaleString('es-CL')}</td>
                                <td>${producto.stock}</td>
                                <td>${producto.descripcion || 'N/A'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        contenedor.innerHTML = `
            <div class="alert alert-danger">
                Error al cargar productos: ${error.message}
            </div>
        `;
    }
}