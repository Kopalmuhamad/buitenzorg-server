import { query } from "express"
import { asyncHandler } from "../middlewares/asyncHandler.js"
import Product from "../models/productModel.js"

export const createProduct = asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body)

    res.status(201).json({
        message: "Create product success",
        data: newProduct
    })
})

export const getAllProduct = asyncHandler(async (req, res) => {
    // Req query
    const queryObj = { ...req.query }

    // Function for ignoring if we have req for page, limit, and sort
    const excludeFields = ["page", "sort", "limit", "name"]
    excludeFields.forEach((el) => delete queryObj[el])

    let query;
    if (req.query.name) {
        query = Product.find({
            name: {
                $regex: req.query.name,
                $options: "i"
            }
        })
    } else {
        query = Product.find(queryObj)
    }

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')  // Default sort by latest created products
    }

    // Pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 30
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    let countProduct = await Product.countDocuments()
    if (req.query.page) {
        const numProduct = await Product.countDocuments()
        if (skip >= numProduct) {
            res.status(404)
            throw new Error("This page does not exist")
        }
    }

    const products = await query

    res.json({
        message: "Get all products",
        data: products,
        count: countProduct
    })
})

export const getDetailProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        res.status(404)
        throw new Error("Product not found")
    }
    res.json({
        message: "Get detail product",
        data: product
    })
})

export const updateProduct = asyncHandler(async (req, res) => {
    // Step 1: Find the product by ID
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    // Step 2: Update the product with the new data
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Return the updated document
        runValidators: true // Ensure the update respects the validation rules in the schema
    });

    // Step 3: Return the updated product
    res.status(200).json({
        message: "Product updated successfully",
        data: updatedProduct
    });
})

export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
        res.status(404)
        throw new Error("Product not found")
    }

    res.json({
        message: "Delete product success"
    })
})

export const fileUpload = asyncHandler(async (req, res) => {
    const file = req.file
    if (!file) {
        res.status(400)
        throw new Error("Please upload a file")
    }

    const imageFileName = file.filename
    const pathImageFile = `/uploads/${imageFileName}`

    res.status(200).json({
        message: "Upload file success",
        data: pathImageFile
    })
})