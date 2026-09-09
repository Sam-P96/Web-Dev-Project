import mongoose from "mongoose";

/* 
Field
  car
  seller
  worker
  scheduledAt   TBD the format, but talked to Aakash about this, and that Aakash and Duy will work this out, then I can store it here
  location
  notes
  status        default is "booked"
*/


const appointmentSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    scheduledAt: { type: Date, required: true },
    location: { type: String},
    notes: { type: String},
    status: {
      type: String,
      enum: ["booked", "confirmed", "completed", "cancelled"],
      default: "booked"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);