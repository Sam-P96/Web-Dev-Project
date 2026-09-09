import mongoose from "mongoose"

/*This is for the worker to make a price offer for a car a seller submits if the seller originally declined 
the AI generated offer estimate. Maybe this could be used in junction with a form for the worker to fill in. 
Note: I bet we could make an auto reply or auto fill for the worker wtih AI if we have time. 

fIELDS:
    car
    worker
    amount
    message     
    status      whether or not the offer made it through, so pending, accepted, rejected, the thing is.. for legal reasons
                there should not be shown as accepted unless its confirmed in person, so there should ALWAYS be a disclaimer
                where its said "accepted if..... meets a specific criteria" might have to make something for the message for that
    respondAt   This i the date

*/

const offerSchema = new mongoose.Schema(
    {
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },
    respondedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);