import mongoose from "mongoose";

const voterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    election: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
        required: true
    },
    hasVoted: {
        type: Boolean,
        default: false
    }

},{timestamps: true})

voterSchema.index(
    { user: 1, election: 1 },
    {unique: true}
)

const Voter = mongoose.model("Voter", voterSchema);

export default Voter;