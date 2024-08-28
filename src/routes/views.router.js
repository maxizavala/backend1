import { Router } from "express";
import ProductModel from "../models/product.model.js";
import CartModel from "../models/cart.model.js";

const router = Router();

// RUTAS
// Muestra todos los productos de la base
router.get("/views/home", async (req, res) => {
    try {
        const { page = 1, limit = 9 } = req.query;

        // Pagina los resultados
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            lean: true
        };

        const products = await ProductModel.paginate({}, options);

        res.render("home", { 
            products: products.docs,
            totalPages: products.totalPages,
            currentPage: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage
        });
    } catch (error) {
        res.status(500).send({status: "error", message: "Error al obtener los productos desde la base de datos"});
    }
});

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

// Vista del carrito
router.get("/views/cart/:cid", async (req, res) => {
    const cartId = req.params.cid;
    
    try {
        const cart = await CartModel.findById(cartId)
            .populate('products.productId')
            .lean()
            
        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }

        const products = cart.products.map(p => p.productId);

        res.render("cart", { products });
    } catch (error) {
        res.status(500).send("Error al obtener los productos del carrito");
    }
});

export default router;