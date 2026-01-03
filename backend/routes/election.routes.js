import express from "express";
import {
    registerElection,
    getAllElection,
    getActiveElection,
    getLatestElection,
    getElectionInfo,
    postponeElection,
    deleteElection
} from "../controllers/election.controller.js";


const electionRouter = express.Router();

electionRouter.post("/register", registerElection);
electionRouter.get("/", getAllElection);
electionRouter.get("/active", getActiveElection);
electionRouter.get("/latest", getLatestElection);
electionRouter.get("/get/:electionId", getElectionInfo);
electionRouter.put("/:id/postpone", postponeElection);
electionRouter.delete("/delete/:electionId", deleteElection);

export default electionRouter