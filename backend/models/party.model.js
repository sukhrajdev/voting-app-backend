import mongoose from "mongoose";

const partyId = crypto.randomUUID();


const partySchema = mongoose.Schema({
    partyName: {
        type: String,
        required: true,
        unique: true,
        minlength:3
    },
    partyCode: {
        type: String,
        unique: true,
        default: partyId
    },
    partyMembers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User" ,
        default: []
    },
    totalMembers: {
        type: Number,
        default: 0
    }
},{timestamps: true})

const Party = mongoose.model("Party", partySchema)

partySchema.index({ partyName: 1 }, { unique: true });

export default Party;