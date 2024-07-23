import { Router } from "express";

const router = Router();

router.get("/api/carts", (req, res) => {
    res.send("carts");
})

router.post("/api/carts", (req, res) => {
    res.send({status: "success", message: "carts"});
})

export default router;