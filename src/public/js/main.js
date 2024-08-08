const socket = io();

// Recibimos el array de productos
socket.on("products", (data) => {
    const listaProductos = document.getElementById("lista-productos");

    listaProductos.innerHTML = '';
    data.forEach(producto => {
        listaProductos.innerHTML += `
            <li>
                <h2>${producto.title}</h2>
                <p>${producto.description}</p>
                <p>${producto.category}</p>
                <p>Precio: $${producto.price}</p>
            </li>
        `;
    });
});