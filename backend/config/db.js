import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database Connected Successful! ✅")
    } catch (err) {
        console.log(`Database Connectin Failed! ❌ ${err.message}`)
    }
}