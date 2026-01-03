import Voter from "../models/voter.model.js";
import Election from "../models/election.model.js";
import User from "../models/user.model.js";
import Candidate from "../models/candidate.model.js";

export async function registerVoter(req, res) {
  try {
    const { userId, electionId } = req.body;
    if (!userId || !electionId) {
      return res.status(404).json({
        success: false,
        message: "Required fileds not found.",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election is not found.",
      });
    }

    if (!election.isActive) {
      return res.status(400).json({
        success: false,
        message: "Election is not active.",
      });
    }

    const voter = await Voter.findOne({ user: userId });

    if (voter) {
      return res.status(400).json({
        success: false,
        message: "Voter already register",
      });
    }

    await Voter.create({
      user: userId,
      election: electionId,
    });
    return res.status(201).json({
      success: true,
      message: "Voter created successful.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "error occured while creating voter.",
      error: err.message,
    });
  }
}

export async function voteCandidate(req, res) {
  try {
    const { voterId, candidateId } = req.body;

    const voter = await Voter.findById(voterId);
    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    if (voter.hasVoted) {
      return res.status(403).json({
        message: "You have already voted in this election.",
      });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }



    candidate.voteCount += 1;
    voter.hasVoted = true;

    await Promise.all([candidate.save(), voter.save()]);

    return res.status(200).json({
      success: true,
      message: "Vote submitted successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}


