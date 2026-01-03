import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,                  // 5 requests
  message: {
    success: false,
    message: "Too many login attempts. Try again after 10 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const resendLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1,
  message: {
    success: false,
    message: "Too many login attempts. Try again Later."
  },
  standardHeaders: true,
  legacyHeaders: false
})
