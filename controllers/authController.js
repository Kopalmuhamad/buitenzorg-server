import { asyncHandler } from "../middlewares/asyncHandler.js"
import User from "../models/userModel.js"
import jwt from "jsonwebtoken"

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '6d'
    })
}

const createResToken = (user, statusCode, res) => {
    const token = signToken(user._id)

    const isDev = process.env.NODE_ENV === "development" ? false : true

    const cookieOption = {
        expires: new Date(
            Date.now() + 6 * 24 * 60 * 60 * 1000
        ),
        http: true,
        security: !isDev
    }

    res.cookie('jwt', token, cookieOption)

    user.password = undefined

    res.status(statusCode).json({
        data: user
    })
}

export const registerUser = asyncHandler(async (req, res) => {
    const isOwner = (await User.countDocuments() === 0)

    const role = isOwner ? "owner" : "user"

    const createUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: role
    })

    createResToken(createUser, 201, res)
})

export const loginUser = asyncHandler(async (req, res) => {
    // Step 1: Validation input
    if (!req.body.email || !req.body.password) {
        res.status(400)
        throw new Error('Please add email and password')
    }

    // Step 2: Check if user exists
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        res.status(400)
        throw new Error('User not found')
    }

    // Step 3: Check if password is correct
    if (user && (await user.comparePassword(req.body.password))) {
        createResToken(user, 200, res)
    } else {
        res.status(400)
        throw new Error('Invalid Password')
    }

})

export const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password')

    if (user) {
        res.json({
            data: user
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(Date.now())
    })

    res.status(200).json({
        message: "Logout success"
    })
})

export const updateUser = asyncHandler(async (req, res) => {
    // Step 1: Find user by ID
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Step 2: Update only the fields provided (excluding password unless explicitly changed)
    const updates = {
        username: req.body.username || user.username,
        email: req.body.email || user.email,
        address: req.body.address || user.address,
        image: req.body.image || user.image
    };

    // Step 3: Handle password update separately (hash the new password if provided)
    if (req.body.password) {
        const salt = await bcryptjs.genSalt(10);
        updates.password = await bcryptjs.hash(req.body.password, salt);
    }

    // Step 4: Use findByIdAndUpdate to update the user without affecting unchanged fields
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
        new: true,
        runValidators: true
    }).select('-password');

    // Step 5: Return the updated user data
    res.status(200).json({
        data: updatedUser
    });
});
