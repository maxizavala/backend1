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

document.getElementById("addProductForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const newProduct = {
        id: uuid.v4(),
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        price: parseFloat(document.getElementById("price").value),
        stock: parseInt(document.getElementById("stock").value, 10),
        category: document.getElementById("category").value,
    };

    socket.emit("agregarProducto", newProduct);

    document.getElementById("addProductForm").reset();
    $('#addProductModal').modal('hide');

});

socket.on("productoEliminado", (productId) => {
    socket.emit("requestProductos");
});