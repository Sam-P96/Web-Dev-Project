// app.js does not load .env or connect to the DB (index.js does), so tests do it here
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../db.js";

beforeAll(async () => {
  await connectDB(); // NODE_ENV=test -> MONGODB_URI_TEST (see db.js)
});

afterAll(async () => {
  await mongoose.connection.close();
});
