import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    partyCode: {
        type: String,
        required: true
    },
    voteCount: {
        type: Number,
        default: 0
    }
})
const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;