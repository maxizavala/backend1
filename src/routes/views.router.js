import { Router } from "express";

const router = Router();

// Rutas
router.get("/views/home", (req, res) => {
    res.render("home");
})

export default router;