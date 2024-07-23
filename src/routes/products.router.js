import express, { Router } from "express";
import fs from "fs";

const router = Router();
const productsPath = "./src/data/products.json";

// RUTAS
// Muestra todos los productos de la base segun cantidad definida en limit
router.get("/api/products", async (req, res) => {
    try {
        let limit = parseInt(req.query.limit);
        const data = await fs.promises.readFile(productsPath, 'utf-8');
        const products = JSON.parse(data);
        res.send(products.slice(0, limit));
    } catch (error) {
        res.status(500).send({status: "error", message: "Error al leer el archivo"});
    }
})

// Muestra un producto por id
router.get("/api/products/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const data = await fs.promises.readFile(productsPath, 'utf-8');
        const products = JSON.parse(data);
        const product = products.find(p => p.id == id);
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({status: "error", message: "Producto no encontrado"});
        }
    } catch (error) {
        res.status(500).send({status: "error", message: "Error al leer el archivo"});
    }
})

// Agrega un producto
router.post("/api/products", (req, res) => {
    try {
        let newProduct = req.body;
        saveProduct(newProduct);
        res.send({status: "success", message: "Producto agregado exitosamente"});
    } catch (error) {
        res.status(500).send({status: "error", message: "Error al guardar el producto"});
    }
})


// FUNCIONES
const saveProduct = async (newProduct) => {
    try {
        const data = await fs.promises.readFile(productsPath, 'utf-8');
        const products = JSON.parse(data);
        products.push(newProduct);
        await fs.promises.writeFile(productsPath, JSON.stringify(products, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error al guardar el producto:', error);
    }
};

export default router;