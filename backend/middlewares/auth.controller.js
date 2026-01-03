import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);

        if (!decoded || !decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });
        }

        req.user = {
            id: decoded.id,
        };

        return next();

    } catch (error) {
        console.error("Auth Middleware Error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token"
        });
    }
};

export default authMiddleware;
