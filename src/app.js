import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import fs from 'fs';

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js";

const app = express();
const PUERTO = 8080;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Midlewares
app.use(express.json());
app.use(express.static("./src/public"));

// Rutas
app.use("/", productsRouter);
app.use("/", cartsRouter);
app.use("/", viewsRouter);


const httpServer = app.listen(PUERTO, () => {
    console.log("Escuchando por el puerto 8080");
})

const io = new Server(httpServer);

const usuarios = [
    { id: 1, nombre: "Juan", apellido: "Sanchez" },
    { id: 2, nombre: "Lorena", apellido: "Lopez" },
    { id: 3, nombre: "Sebastian", apellido: "Rodriguez" },
    { id: 4, nombre: "Micaela", apellido: "Fernandez" }
];

io.on("connection", async (socket) => {
    const data = await fs.promises.readFile('./src/data/products.json', 'utf-8');
    let products = JSON.parse(data);

    socket.emit("products", products);

    socket.on("agregarProducto", async (newProduct) => {
        try {
            products.push(newProduct);
            await fs.promises.writeFile('./src/data/products.json', JSON.stringify(products, null, 2));

            io.emit("productos", products);
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    });

    socket.on("eliminarProducto", async (productId) => {
        try {
            products = products.filter(producto => producto.id !== productId.toString());
            await fs.promises.writeFile('./src/data/products.json', JSON.stringify(products, null, 2));
    
            io.emit("productos", products);
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    });

    socket.on("requestProductos", async () => {
        products = JSON.parse(await fs.promises.readFile('./src/data/products.json', 'utf-8'));
        io.emit("productos", products);
    });
});