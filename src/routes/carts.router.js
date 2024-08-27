import { Router } from "express";
import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

const router = Router();

// RUTAS
// Crea un carrito
router.post("/api/carts", async (req, res) => {
    try {
        const newCart = new CartModel({
            products: []
        });

        await newCart.save();
        res.send({status: "success", message: "Carrito creado exitosamente", cartId: newCart._id});
    } catch (error) {
        res.status(500).send({status: "error", message: "Error al guardar el carrito"});
    }
});

// Muestra productos del carrito
router.get("/api/carts/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // Busca el carrito en la base de datos por su ID
        const cart = await CartModel.findById(id).populate('products.productId');

        if (cart) {
            res.send(cart);
        } else {
            res.status(404).send({status: "error", message: "Carrito no encontrado"});
        }
    } catch (error) {
        res.status(500).send({status: "error", message: "Error al consultar el carrito"});
    }
});

// Agrega un producto a un carrito específico
router.post("/api/carts/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        // Verifica si el carrito existe
        const cart = await CartModel.findById(cartId);

        if (!cart) {
            return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
        }

        // Verifica si el producto existe en la base de datos
        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

        if (productIndex !== -1) {
            // Producto ya existe en el carrito, incrementar cantidad
            cart.products[productIndex].quantity += 1;
        } else {
            // Producto no existe en el carrito, agregar nuevo
            cart.products.push({ productId: productId, quantity: 1 });
        }

        await cart.save();
        res.send({ status: "success", message: "Producto agregado exitosamente" });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al agregar el producto" });
    }
});



export default router;