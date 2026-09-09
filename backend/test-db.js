// This is for testing the db, delete ot when nolonger needed. 
// Maybe keep this here for troubleshooting for a bit

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./src/config/db.js";
import "./src/models/User.js";
import "./src/models/Car.js";
import "./src/models/Offer.js";
import "./src/models/Appointment.js";

await connectDB();
console.log("Models registered:", Object.keys(mongoose.models));
await mongoose.connection.close();