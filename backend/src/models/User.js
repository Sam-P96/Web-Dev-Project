import mongoose from "mongoose";

/* Base schema was suggested by claude, made some modifications.
Fields:
    name
    email
    password
    phone
    address
    age
    role                Focus on worker and client for now, we'll figure out admin later cus they're relatively similar to worker
    browsing history    This should be an array of car IDs

Refer to https://mongoosejs.com/docs/guide.html if needed.
*/


const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    age: { type: Number},
    role: { type: String, enum: ["client", "worker", "admin"], default: "client" },
    browsingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);