import { asyncHandler } from "../middlewares/asyncHandler.js"
import Order from "../models/orderModel.js"
import Product from "../models/productModel.js"

export const createOrder = asyncHandler(async (req, res) => {
    const { email, firstName, lastName, phone, address, cartItem } = req.body;

    if (!cartItem || cartItem.length === 0) {
        res.status(400);
        throw new Error("Cart item is empty");
    }

    let orderItem = [];
    let total = 0;

    for (const cart of cartItem) {
        const productData = await Product.findOne({ _id: cart.product });
        if (!productData) {
            res.status(404);
            throw new Error("Product not found");
        }

        const { name, price, _id } = productData;
        const singleProduct = {
            quantity: cart.quantity,
            name: name,
            price: price,
            product: _id
        };
        orderItem = [...orderItem, singleProduct];
        total += price * cart.quantity;
    }

    const order = await Order.create({
        email,
        firstName,
        lastName,
        phone,
        address,  // Make sure address is included here
        itemsDetail: orderItem,
        total,
        user: req.user._id
    });

    return res.status(200).json({
        message: "Create order success",
        order,
        total
    });
});


export const getAllOrder = asyncHandler(async (req, res) => {
    const orders = await Order.find();

    return res.status(200).json({
        data: orders,
        message: "Get all order"
    })
})

export const getDetailOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    return res.status(200).json({
        data: order,
        message: "Get detail order"
    })
})

export const currentUserOrder = asyncHandler(async (req, res) => {
    const order = await Order.find({ user: req.user._id });

    return res.status(200).json({
        data: order,
        message: "Get current user order"
    })
})

export const updateOrder = asyncHandler(async (req, res) => {
    res.json({
        message: "Update order"
    })
})

export const deleteOrder = asyncHandler(async (req, res) => {
    res.json({
        message: "Delete order"
    })
})