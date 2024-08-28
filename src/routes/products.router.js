import { Router } from "express";
import ProductModel from "../models/product.model.js";

const router = Router();

// RUTAS
// Muestra todos los productos de la base segun cantidad definida en limit
router.get("/api/products", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : null;
        
        let query = {};
        if (req.query.query) {
            query = JSON.parse(req.query.query || '{}');
        }

        // Opciones para la paginacion
        const options = {
            limit: limit,
            page: page,
            sort: sort ? { price: sort } : undefined,
            lean: true
        };

        // Realiza la busqueda y la paginacion
        const result = await ProductModel.paginate(query, options);

        // Respuesta
        const response = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}${req.query.sort ? `&sort=${req.query.sort}` : ''}${req.query.query ? `&query=${req.query.query}` : ''}` : null,
            nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}${req.query.sort ? `&sort=${req.query.sort}` : ''}${req.query.query ? `&query=${req.query.query}` : ''}` : null
        };

        res.send(response);
    } catch (error) {
        console.error('Error en la ruta /api/products:', error);
        res.status(500).send({ status: "error", message: "Error al obtener los productos desde la base de datos" });
    }
});

// Muestra un producto por id
router.get("/api/products/:id", async (req, res) => {
    try {
        let id = req.params.id;

        // Buscar el producto en MongoDB por ID
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

        // Guarda el nuevo producto en MongoDB
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
        // Busca y actualiza el producto por ID
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { title, description, price, stock, category },
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

        // Busca y elimina el producto por ID
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