import { Router } from "express";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const cartPath = "./src/data/carts.json";

// RUTAS
// Crea un carrito
router.post("/api/carts", (req, res) => {
    try {

        // Nuevo carrito
        const newCart = {
            id: uuidv4(),
            products: []
        };

        saveCart(newCart);
        res.send({status: "success", message: "Carrito creado exitosamente"});
    } catch (error) {
        res.status(500).send({status: "error", message: "Error al guardar el carrito"});
    }
})

// Muestra productos del carrito
router.get("/api/carts/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const data = await fs.promises.readFile(cartPath, 'utf-8');
        const carts = JSON.parse(data);
        const cart = carts.find(p => p.id == id);
        if (cart) {
            res.send(cart);
        } else {
            res.status(404).send({status: "error", message: "Carrito no encontrado"});
        }
    } catch (error) {
        res.status(500).send({status: "error", message: "Error al leer el archivo"});
    }
})

// FUNCIONES
const saveCart = async (newCart) => {
    try {
        const data = await fs.promises.readFile(cartPath, 'utf-8');
        const carts = JSON.parse(data);
        carts.push(newCart);
        await fs.promises.writeFile(cartPath, JSON.stringify(carts, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error al guardar el carrito:', error);
    }
};

export default router;