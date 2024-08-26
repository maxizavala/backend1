import { Router } from "express";
import ProductModel from "../models/product.model.js";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const productsPath = "./src/data/products.json";

// RUTAS
// Muestra todos los productos de la base segun cantidad definida en limit
router.get("/api/products", async (req, res) => {
    try {
        let limit = parseInt(req.query.limit);

        // Si no se define un límite, usa todos los productos
        const products = await ProductModel.find().limit(limit);

        res.send(products);
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al obtener los productos desde la base de datos" });
    }
});

// Muestra un producto por id
router.get("/api/products/:id", async (req, res) => {
    try {
        let id = req.params.id;

        // Buscar el producto en MongoDB por su ID
        const product = await ProductModel.findById(id);

        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ status: "error", message: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al obtener el producto desde la base de datos" });
    }
});

// Agrega un producto
router.post("/api/products", async (req, res) => {
    try {
        let { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

        // Verifica los campos obligatorios
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).send({ status: 'error', message: 'Faltan campos obligatorios' });
        }

        const newProduct = new ProductModel({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        });

        // Guardar el nuevo producto en MongoDB
        await newProduct.save();

        res.send({ status: "success", message: "Producto agregado exitosamente" });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al guardar el producto en la base de datos" });
    }
});

// Edita un producto
router.put("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, price, stock, category } = req.body;

    try {
        // Buscar y actualizar el producto por su ID
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { title, description, price, stock, category },
            { new: true, runValidators: true } // Opciones: retorna el documento actualizado y valida los datos
        );

        if (updatedProduct) {
            res.send({ status: "success", message: "Producto actualizado", product: updatedProduct });
        } else {
            res.status(400).send({ status: "error", message: "No se pudo actualizar el producto" });
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al actualizar el producto en la base de datos" });
    }
});

// Elimina un producto
router.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Buscar y eliminar el producto por su ID
        const deletedProduct = await ProductModel.findByIdAndDelete(productId);

        if (deletedProduct) {
            res.send({ status: 'success', message: 'Producto eliminado exitosamente' });
        } else {
            res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al eliminar el producto de la base de datos' });
    }
});

export default router;