import { Router } from "express";
import ProductModel from "../models/product.model.js"
import fs from "fs";

const router = Router();
const productsPath = "./src/data/products.json";

// RUTAS
// Muestra todos los productos de la base
router.get("/views/home", async (req, res) => {
    try {
        const data = await fs.promises.readFile(productsPath, 'utf-8');
        const products = JSON.parse(data);
        res.render("home", { products });
    } catch (error) {
        res.status(500).send({status: "error", message: "Error al leer el archivo"});
    }
})

// Muestra todos los productos de la base en tiempo real
router.get("/views/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts");
})

// Agrega un producto
router.post("/views/realtimeproducts", async (req, res) => {
    try {
        const newProduct = new ProductModel(req.body);
        await newProduct.save();
        const products = await ProductModel.find();

        // Emitir los productos actualizados a través de socket.io
        req.io.emit("products", products);

        res.status(201).send("Producto agregado exitosamente");
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).send("Error al agregar el producto");
    }
});

export default router;