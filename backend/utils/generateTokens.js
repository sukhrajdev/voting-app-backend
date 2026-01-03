import jwt from "jsonwebtoken";

export function generateToken(userId) {
    let accessToken = jwt.sign({
        id: userId
        },
        process.env.ACCESS_JWT_SECRET,
        {
        expiresIn: process.env.ACCESS_JWT_EXPIRES_IN
    })
    let refreshToken = jwt.sign({
        id: userId
    },
        process.env.REFRESH_JWT_SECRET,
        {
        expiresIn: process.env.REFRESH_JWT_EXPIRES_IN
        })
    return { refreshToken, accessToken}
}