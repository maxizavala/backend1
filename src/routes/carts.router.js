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

// Agrega un producto a un carrito especifico
router.post("/api/carts/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = await getCartById(cartId);

        if (!cart) {
            return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(p => p.product === productId);

        if (productIndex !== -1) {
            // Producto ya existe en el carrito, incrementar cantidad
            cart.products[productIndex].quantity += 1;
        } else {
            // Producto no existe en el carrito, agregar nuevo
            cart.products.push({ product: productId, quantity: 1 });
        }

        await updateCart(cart);
        res.send({ status: "success", message: "Producto agregado exitosamente" });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al agregar el producto" });
    }
});


// FUNCIONES
// Guarda un carrito
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

// Obtiene el carrito por id
const getCartById = async (id) => {
    try {
        const data = await fs.promises.readFile(cartPath, 'utf-8');
        const carts = JSON.parse(data);
        return carts.find(cart => cart.id === id);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        return null;
    }
};

// Actualiza un producto dentro de un carrito
const updateCart = async (updatedCart) => {
    try {
        const data = await fs.promises.readFile(cartPath, 'utf-8');
        let carts = JSON.parse(data);

        carts = carts.map(cart => cart.id === updatedCart.id ? updatedCart : cart);

        await fs.promises.writeFile(cartPath, JSON.stringify(carts, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
    }
};

export default router;