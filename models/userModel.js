import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        minLength: [3, "Username must be at least 3 characters"],
        unique: [true, "Username is already axist"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email is already axist"],
        validate: {
            validator: validator.isEmail,
            message: "email not valid"
        },
        unique: true
    },
    address: {
        type: String,
    },
    image: {
        type: String
    },
    role: {
        type: String,
        enum: ["owner", "user"],
        default: "user"

    }
});

userSchema.pre("save", async function (next) {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
