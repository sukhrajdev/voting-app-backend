import express from "express";
import {
    registerVoter,
    voteCandidate
} from "../controllers/voter.controller.js";

const voterRouter = express.Router();

voterRouter.post("/register", registerVoter);
voterRouter.post("/vote", voteCandidate);

export default voterRouter