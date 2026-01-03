import express from "express";
import {
    createParty,
    joinParty,
    getPartyMembers,
    getPartyInfo,
    getAllPartyInfo,
    updateParty,
    deleteParty
} from "../controllers/party.controller.js";

const partyRouter = express.Router();

partyRouter.post("/register", createParty);
partyRouter.post("/join", joinParty);
partyRouter.patch("/update/:partyCode", updateParty);
partyRouter.get("/members", getPartyMembers);
partyRouter.get("/getInfo", getPartyInfo);
partyRouter.get("/", getAllPartyInfo);
partyRouter.delete("/delete/:partyId", deleteParty);

export default partyRouter
