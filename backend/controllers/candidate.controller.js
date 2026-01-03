import Candidate from "../models/candidate.model.js";
import Party from "../models/party.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export async function createCandidate(req,res) {
    try {
        const { userId, partyCode } = req.body;
        if (!userId || !partyCode) {
            return res.status(400).json({
                success: false,
                message: "Required Fields is not provide"
            })
        }
        const isVaildUser = await User.findById(userId);
        if (!isVaildUser) {
            return res.status(404).json({
                success: false,
                message: "User Id is invaild."
            })
        }
        const isVaildParty = await Party.findOne({ partyCode })
        if (!isVaildParty) {
            return res.status(404).json({
                success: false,
                message: "Party Code is Invaild"
            })
        }
        const isCandidateExist = await Candidate.findOne({ user: userId })
        if (isCandidateExist) {
            return res.status(409).json({
                success: false,
                message: "Candidate is already Exsit"
            })
        }
        const createdCandidate = await Candidate.create({
            user: userId,
            partyCode
        })
        return res.status(201).json({
            success: true,
            message: "Successful candidate created ",
            data: createdCandidate
        })
        
    }catch (err) {
        return res.status(500).json({
            success: false,
            message: "while creating candidate Error occured.",
            error: err.message
        })
    }
}


export async function getTotalVotes(req, res) {
    try {
        const { id: userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID"
            });
        }

        const candidate = await Candidate
            .findOne({ user: userId })
            .select("voteCount");

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        return res.status(200).json({
            success: true,
            votes: candidate.voteCount || 0
        });

    } catch (error) {
        console.error("Get Total Votes Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch total votes"
        });
    }
}

export async function getCandidates(req, res) {
    try {
        const candidates = await Candidate.find();
        if (!candidates) {
            return res.status(404).json({
                success: false,
                message: "Candidates not found."
            })
        }
        return res.status(200).json({
            success: true,
            message: "Candidates List.",
            data: candidates
        })
    } catch (err) {
        return res.status(500).json({
            succes: false,
            message: "Error occured while getting candidates.",
            error: err.message
        })
    }
}

export async function getLeaderboard(req, res) {
    try {
        const candidates = await Candidate.aggregate([
            {
                $sort: { "totalVotes": -1 }
            }
        ])
        if (!candidates) {
            return res.status(404).json({
                succes: false,
                message: "No Candidates Found."
            })
        }
        return res.status(200).json({
            success: true,
            message: "Here is Candidates leaderboard.",
            data: candidates
        })
    } catch (err) {
        return res.status(500).json({
            succes: false,
            message: "Error occured while showing leaderboard.",
            error: err.message
        })
    }
}