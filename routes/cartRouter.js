import express from "express"
import { createCart, deleteCart, getAllCart, getDetailCart, updateCart } from "../controllers/cartController.js"

const router = express.Router()

router.post("/cart", createCart)
router.get("/carts", getAllCart)
router.get("/cart/:id", getDetailCart)
router.put("/cart/:id", updateCart)
router.delete("/cart/:id", deleteCart)

export default router