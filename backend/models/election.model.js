import mongoose from "mongoose";

const electionSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * REAL-TIME VALIDATION
 * Works for create + update
 */
// electionSchema.pre("save", function () {
//   if (this.endDate <= this.startDate) {
//     return next(new Error("End date must be after start date"));
//   }
  
//   ;
// });

// electionSchema.pre(
//   ["findOneAndUpdate", "updateOne", "updateMany"],
//   function () {
//     const update = this.getUpdate();
//     const startDate = update.startDate || update.$set?.startDate;
//     const endDate = update.endDate || update.$set?.endDate;

//     if (
//       startDate &&
//       endDate &&
//       new Date(endDate) <= new Date(startDate)
//     ) {
//       throw new Error("End date must be after start date");
//     }
//   }
// );



/**
 * REAL-TIME VIRTUAL FIELD
 * Timezone-safe (UTC)
 */
// electionSchema.virtual("isActive").get(function () {
//   const now = Date.now(); // UTC timestamp
//   return (
//     now >= this.startDate.getTime() &&
//     now <= this.endDate.getTime()
//   );
// });

/**
 * OPTIONAL: real-time status
 */
// electionSchema.virtual("status").get(function () {
//   const now = Date.now();

//   if (now < this.startDate.getTime()) return "upcoming";
//   if (now > this.endDate.getTime()) return "ended";
//   return "active";
// });

const Election = mongoose.model("Election", electionSchema);
export default Election;
