import express from "express";

const app = express();
const PUERTO = 8080;

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js"

app.use(express.json());

app.use("/", productsRouter);
app.use("/", cartsRouter);

app.listen(PUERTO, () => {
    console.log("Escuchando por el puerto 8080");
})