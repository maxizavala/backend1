import { Router } from "express";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

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
        let { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

        // Verifica ls campos obligatorios
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).send({ status: 'error', message: 'Faltan campos obligatorios' });
        }

        // Nuevo producto
        const newProduct = {
            id: uuidv4(),
            title: title,
            description: description,
            code: code,
            proce: price,
            status: status,
            stock: stock,
            category: category,
            thumbnails: thumbnails
        };

        saveProduct(newProduct);
        res.send({status: "success", message: "Producto agregado exitosamente"});
    } catch (error) {
        res.status(500).send({status: "error", message: "Error al guardar el producto"});
    }
})

// Edita un producto
router.put("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, price, stock, category } = req.body;

    try {
        const data = await fs.promises.readFile(productsPath, 'utf-8');    
        const products = JSON.parse(data);

        const productIndex = products.findIndex(product => product.id == id);

        if (productIndex !== -1) {
            products[productIndex].title = title;
            products[productIndex].description = description;
            products[productIndex].price = price;
            products[productIndex].stock = stock;
            products[productIndex].category = category;

            // Guardar los cambios en el archivo
            fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf-8');

            res.send({status: "success", message: "Producto actualizado"});
        } else {
            res.status(400).send({status: "error", message: "No se pudo actualizar el producto"});
        }
    } catch (error) {
        res.status(500).send({status: "error", message: "Error al leer o escribir en el archivo"});
    }
});

// Elimina un producto
router.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        const data = await fs.promises.readFile(productsPath, 'utf-8');
        const products = JSON.parse(data);

        const updatedProducts = products.filter(product => product.id !== productId);

        // Guardar los cambios en el archivo
        await fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2), 'utf-8');

        res.send({ status: 'success', message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al eliminar el producto' });
    }
});


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