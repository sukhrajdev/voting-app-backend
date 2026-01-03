import {
    createCandidate,
    getTotalVotes,
    getCandidates,
    getLeaderboard
} from "../controllers/candidate.controller.js";

import express from "express";
import authMiddleware from "../middlewares/auth.controller.js";

const candidateRouter = express.Router();

candidateRouter.post("/register", createCandidate);
candidateRouter.get("/votes/:id",
    getTotalVotes
)
candidateRouter.get("/get", getCandidates);
candidateRouter.get("/leaderboard", getLeaderboard);
export default candidateRouter;