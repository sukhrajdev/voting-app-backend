import {
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    forgetPassword,
    resendVerifyEmail
    
}
    from "../controllers/user.controller.js";
import express from "express";
import authMiddleware from "../middlewares/auth.controller.js"
import { authLimiter } from "../middlewares/Authlimiter.middleware.js";

const userRouter = express.Router()

userRouter.post("/register",
    authLimiter,
    registerUser

)
userRouter.post("/login",
    authLimiter,
    loginUser
)
userRouter.post("/logout",
    authMiddleware,
    logoutUser
)

userRouter.put("/update", 
    authMiddleware,
    updateUser
)
userRouter.put("/forget-password",
    authMiddleware,
    authLimiter,
    forgetPassword
)


userRouter.post("/resend-email",
    authLimiter,
    resendVerifyEmail)

export default userRouter