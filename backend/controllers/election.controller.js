import Election from "../models/election.model.js";

export async function registerElection(req, res) {
  try {
    const { startDate, endDate } = req.body;

    // 1. Required fields validation
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    // 2. Convert to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 3. Invalid date check
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    // 4. Date logic validation
    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be greater than end date",
      });
    }

    if (start.getTime() === end.getTime()) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date cannot be the same",
      });
    }

    // 5. Determine active status
    const isActive = start <= new Date();

    // 6. Create election AFTER validation
    const election = await Election.create({
      startDate: start,
      endDate: end,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Election created successfully",
      data: election,
    });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Error occurred while creating election",
    });
  }
}


export async function getAllElection(req, res) {
  try {
    const elections = await Election.find();
    if (!elections) {
      return res.status(404).json({
        success: false,
        message: "No Elections in Database.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successful list all Elections.",
      elections,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error occured while listing Elections.",
      error: err.message,
    });
  }
}

export async function getActiveElection(req, res) {
  // const elections = await Election.find();
  const activeElection = await Election.findOne({ isActive: true });

  // const active = elections.find(e => e.isActive);

  if (!activeElection) {
    return res.status(404).json({
      success: false,
      message: "No active election",
    });
  }

  return res.json({
    success: true,
    data: activeElection,
  });
}

export async function getLatestElection(req, res) {
  try {
    const election = await Election.findOne()
      .sort({ createdAt: -1 }) // latest first
      .lean({ virtuals: true }); // include isActive

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "No election found",
      });
    }

    return res.status(200).json({
      success: true,
      data: election,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest election",
    });
  }
}

export async function getElectionInfo(req, res) {
  try {
    const { electionId } = req.params.electionId;
    if (!electionId) {
      return res.status(404).json({
        success: false,
        message: "Election Id is not provide.",
      });
    }
    const election = await Election.findOne({ _id: electionId });
    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election is not Found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Election data is collect Successful.",
      data: election,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error occured while getting info of election.",
      error: err.message,
    });
  }
}

export async function postponeElection(req, res) {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid election ID",
      });
    }

    if (!startDate && !endDate) {
      return res.status(400).json({
        success: false,
        message: "At least one date must be provided",
      });
    }

    const election = await Election.findById(id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found",
      });
    }

    // ❗ Optional business rule
    if (election.endDate < new Date()) {
      return res.status(409).json({
        success: false,
        message: "Ended elections cannot be postponed",
      });
    }

    // Apply updates
    if (startDate) election.startDate = new Date(startDate);
    if (endDate) election.endDate = new Date(endDate);

    // Triggers schema validation
    await election.save();

    return res.status(200).json({
      success: true,
      message: "Election postponed successfully",
      data: election,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteElection(req, res) {
  try {
    const electionId = req.params.electionId;
    if (!electionId) {
      return res.status(404).json({
        success: false,
        message: "Election id could not found.",
      });
    }
    const election = await Election.findByIdAndDelete(electionId);
    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election Id is invaild.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Election delete successful.",
      data: election,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error occured while deleting election.",
      error: err.message,
    });
  }
}
