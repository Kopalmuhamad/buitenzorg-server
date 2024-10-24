import express from "express"
import { createOrder, currentUserOrder, deleteOrder, getAllOrder, getDetailOrder, updateOrder } from "../controllers/orderController.js"
import { adminMiddleware, protectedMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/order", protectedMiddleware, createOrder)
router.get("/orders", protectedMiddleware, adminMiddleware, getAllOrder)
router.get("/order/currentUser", protectedMiddleware, currentUserOrder)
router.get("/order/:id", protectedMiddleware, adminMiddleware, getDetailOrder)
router.put("/order/:id", protectedMiddleware, adminMiddleware, updateOrder)
router.delete("/order/:id", deleteOrder)

export default router