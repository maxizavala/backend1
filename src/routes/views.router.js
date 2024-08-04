import { Router } from "express";
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

export default router;