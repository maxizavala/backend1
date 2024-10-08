import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import ProductModel from "./models/product.model.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js";

const app = express();
const PUERTO = 8080;

await mongoose.connect("mongodb+srv://maximilianozavala:maxicoder@cluster0.lapab.mongodb.net/Desafio?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB', err));

// Configuracion handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Midlewares
app.use(express.json());
app.use(express.static("./src/public"));
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Rutas
app.use("/", productsRouter);
app.use("/", cartsRouter);
app.use("/", viewsRouter);


const httpServer = app.listen(PUERTO, () => {
    console.log("Escuchando por el puerto 8080");
})

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    const products = await ProductModel.find();

    socket.emit("products", products);

    socket.on("agregarProducto", async (newProduct) => {
        try {
            const product = new ProductModel(newProduct);
            await product.save();
            const products = await ProductModel.find();

            io.emit("products", products);
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    });

    socket.on("eliminarProducto", async (productId) => {
        try {
            // Eliminar el producto de MongoDB
            await ProductModel.findByIdAndDelete(productId);

            // Obtener la lista actualizada de productos después de la eliminación
            const products = await ProductModel.find();

            // Emitir la lista actualizada de productos
            io.emit("products", products);
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    });

    socket.on("requestProductos", async () => {
        const products = await ProductModel.find();
        io.emit("products", products);
    });
});