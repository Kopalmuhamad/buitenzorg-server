import express from "express"
import { getCurrentUser, loginUser, logoutUser, registerUser, updateUser } from "../controllers/authController.js"
import { protectedMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/getCurrentUser", protectedMiddleware, getCurrentUser)
router.get("/logout", protectedMiddleware, logoutUser)
router.put("/update", protectedMiddleware, updateUser)

export default router