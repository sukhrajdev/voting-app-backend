import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    authToken: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},{timestamps: true})

userSchema.pre("save", async function (){
    if (!this.isModified("password")) {
        return ;
    }
    const salt = await bcrypt.genSalt(12)
    const hashed_password = await bcrypt.hash(this.password, salt)
    this.password = hashed_password;
})

userSchema.methods.comparePassword = async function comparePassword(userPassword) {
    return await bcrypt.compare(userPassword,this.password);
}

const User = mongoose.model("User",userSchema);

export default User;