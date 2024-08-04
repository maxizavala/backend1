import express from "express";
import exphbs from "express-handlebars";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js";

const app = express();
const PUERTO = 8080;

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.json());
app.use(express.static("./src/public"));

app.use("/", productsRouter);
app.use("/", cartsRouter);
app.use("/", viewsRouter);


app.listen(PUERTO, () => {
    console.log("Escuchando por el puerto 8080");
})