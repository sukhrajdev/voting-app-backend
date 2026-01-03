import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.js";
import "dotenv/config";
import userRouter from "./routes/user.routes.js";
import partyRouter from "./routes/party.routes.js";
import candidateRouter from "./routes/candidate.routes.js";
import electionRouter from "./routes/election.routes.js";
import voterRouter from "./routes/voter.routes.js";
import { resendLimiter } from "./middlewares/Authlimiter.middleware.js";
import { verifyEmail } from "./controllers/user.controller.js";


connectDB()

const app = express();
const port = process.env.PORT || 3000

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use("/api/v1/user", userRouter)
app.use("/api/v1/party", partyRouter);
app.use("/api/v1/candidate", candidateRouter);
app.use("/api/v1/election", electionRouter);
app.use("/api/v1/voter", voterRouter);


app.get("/", (req, res) => {
    res.send("API is running successfully")
})

app.get("/verify-email/:token",
    resendLimiter,
    verifyEmail
);

app.listen(port, () => {
    console.log(`API WAS RUNNING ON PORT ${port}`)
    console.log(`Link: http://localhost:${port} `)
})