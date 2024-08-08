const socket = io();

// Recibimos el array de productos
socket.on("products", (data) => {
    const listaProductos = document.getElementById("lista-productos");

    listaProductos.innerHTML = '';
    data.forEach(producto => {
        listaProductos.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${producto.title}</h5>
                        <p class="card-text">${producto.description}</p>
                        <p class="card-text"><small class="text-muted">${producto.category}</small></p>
                        <p class="card-text"><strong>Precio: $${producto.price}</strong></p>
                        <button class="btn btn-danger" onclick="eliminarProducto('${producto.id}')">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
    });
});

function eliminarProducto(productId) {
    socket.emit("eliminarProducto", productId);
}

socket.on("productoEliminado", (productId) => {
    socket.emit("requestProductos");
});