import Party from "../models/party.model.js";
import User from "../models/user.model.js";
import Candidate from "../models/candidate.model.js";

export async function createParty(req, res) {
  try {
    const { partyName } = req.body;
    if (!partyName) {
      return res.status(400).json({
        success: false,
        message: "Party name is not defined",
      });
    }
    const createdParty = await Party.create({
      partyName,
    });
    if (!createdParty) {
      return res.status(400).json({
        success: false,
        message: "Create Party is Failed.Try Again",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Party Created Successful.Now you can join",
      data: createdParty,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "while creating party Error occured.",
      error: err.message,
    });
  }
}

export async function joinParty(req, res) {
  try {
    const { candidateId, partyCode } = req.body;
    if (!candidateId || !partyCode) {
      return res.status(400).json({
        message: "Candidate Id and Party Code are required",
      });
    }
    const candidate = await Candidate.findOne({ _id: candidateId }); // in future update this
    if (!candidate) {
      return res.status(400).json({
        success: false,
        message: "Candidate not found",
      });
    }
    const party = await Party.findOne({ partyCode });
    if (!party) {
      return res.status(400).json({
        success: false,
        message: "Party not find.Please check your Party code",
      });
    }
    if (party.partyMembers.includes(candidate._id)) {
      return res.status(409).json({
        success: false,
        message: "Candidate already joined this party",
      });
    }
    party.partyMembers.push(candidate._id);
    party.totalMembers = party.partyMembers.length;
    await party.save();

    candidate.isApproved = true,
    candidate.save()

    return res.status(200).json({
      success: true,
      message: "Party Join Successful",
      data: party,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "while joining party Error occured.",
      error: err.message,
    });
  }
}

export async function getPartyMembers(req, res) {
  try {
    const { partyCode } = req.body; // update this into middleware
    if (!partyCode) {
      return res.status(400).json({
        success: false,
        message: "User Id is not provide",
      });
    }
    const party = await Party.findOne({ partyCode });
    if (!party) {
      return res.status(400).json({
        success: false,
        message: "Party not found invaild Party Code.",
      });
    }
    const listOfPartyMembersId = party.partyMembers;

    if (!listOfPartyMembersId) {
      return res.status(400).json({
        success: false,
        message: "No Members Join Party",
      });
    }
    let listOfPartyMembers = await Promise.all(
      listOfPartyMembersId.map((memberId) =>
        Candidate.findById(memberId).select("username")
      )
    );
    if (!listOfPartyMembers) {
      return res.status(400).json({
        success: false,
        message: "No Members Join Party",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Party Members Extract Successful",
      listOfPartyMembers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "while extarcting party members Error occured.",
      error: err.message,
    });
  }
}
export async function getPartyInfo(req, res) {
  try {
    const { partyCode } = req.body;
    if (!partyCode) {
      return res.status(400).json({
        success: false,
        message: "Party code is not provide",
      });
    }
    const party = await Party.findOne({ partyCode });
    if (!party) {
      return res.status(400).json({
        success: false,
        message: "Party Code is Invaild",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Party details extract successful",
      party,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "while extracting party Info Error occured.",
      error: err.message,
    });
  }
}

export async function getAllPartyInfo(req,res) {
    try {
        const getParties = await Party.find();
        if (!getParties) {
            return res.status(400).json({
                success: false,
                message: "No Party yet"
            })
        }
        return res.status(200).json({
            success: true,
            message: "All party info",
            parties: getParties
        })
    }catch (err) {
        return res.status(500).json({
            success: false,
            message: "while extract all party Error occured.",
            error: err.message
        })
    }
}

export async function updateParty(req,res) {
  try {
    const { partyCode } = req.params.partyCode;
    const { partyName } = req.body;
    if (!partyCode || !partyName) {
      return res.status(404).json({
        success: false,
        message: "Required fields or parameters is not found."
      })
    }
    const party = await Party.findOne({ partyCode });
    if (!party) {
      return res.status(404).json({
        success: false,
        message: "Party not found."
      })
    }
    party.partyName = partyName;
    await party.save()
    return res.status(200).json({
      success: true,
      message: "Party Updated Successful."
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error occured while updating party.",
      error: err.message
    })
  }
}

export async function deleteParty(req, res) {
  try {
    const partyId = req.params.partyId;
    if (!partyId) {
      return res.status(404).json({
        success: false,
        message: "Party Id could not found."
      })
    }
    const party = await Party.findByIdAndDelete(partyId);
    if (!party) {
      return res.status(404).json({
        success: false,
        message: "Party Id is invaild."
      })
    }
    return res.status(200).json({
      success: true,
      message: "Party delete successful.",
      data: party
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error occured while deleting party.",
      error: err.message
    })
  }
}