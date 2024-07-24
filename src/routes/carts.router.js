import { Router } from "express";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const cartPath = "./src/data/carts.json";

// RUTAS
// Crea un carrito
router.post("/api/carts", (req, res) => {
    try {
        let { products = [] } = req.body;

        // Nuevo carrito
        const newCart = {
            id: uuidv4(),
            products: products
        };

        saveCart(newCart);
        res.send({status: "success", message: "Carrito creado exitosamente"});
    } catch (error) {
        res.status(500).send({status: "error", message: "Error al guardar el carrito"});
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