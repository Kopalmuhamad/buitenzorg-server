import { asyncHandler } from "../middlewares/asyncHandler.js"

export const createCart = asyncHandler(async (req, res) => {
    res.json({
        message: "Create cart"
    })
})

export const getAllCart = asyncHandler(async (req, res) => {
    res.json({
        message: "Get all cart"
    })
})

export const getDetailCart = asyncHandler(async (req, res) => {
    res.json({
        message: "Get detail cart"
    })
})

export const updateCart = asyncHandler(async (req, res) => {
    res.json({
        message: "Update cart"
    })
})

export const deleteCart = asyncHandler(async (req, res) => {
    res.json({
        message: "Delete cart"
    })
})