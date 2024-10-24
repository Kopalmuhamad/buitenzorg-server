import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import ExpressMongoSanitize from "express-mongo-sanitize"
import { v2 as cloudinary } from 'cloudinary';

// Import Routes
import authRouter from "./routes/authRouter.js"
import productRouter from "./routes/productRouter.js"
import orderRouter from "./routes/orderRouter.js"
import cartRouter from "./routes/cartRouter.js"
import bodyParser from "body-parser";

// Error Handler
import { notFound, errorHandler } from "./middlewares/errorHandler.js"

dotenv.config()

const app = express()
const port = 8080


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.json())
app.use(helmet())
app.use(ExpressMongoSanitize())
app.use(bodyParser.json());
app.use(express.static("public"))
app.use(cors())
app.use(cookieParser())

app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1", productRouter)
app.use("/api/v1", orderRouter)
app.use("/api/v1", cartRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
    console.log("Server running on localhost:8080")
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err))   