// const express = require("express");
// const morgan = require('morgan')
// commenting this out for now, theres a new one around line 17
// const app = express(); 

import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
// cors = cross origin resource sharing (browser security rule)
import cors from "cors";
import connectDB from "./src/config/db.js";


//ROUTERS
// const userRouter = require("./routes/userRouter");
import userRouter from "./routes/userRouter.js";
import AppointmentRouter from "./routes/appointmentRouter.js";
import CarRouter from "./routes/carRouter.js";

//load env varaibles
dotenv.config();
await connectDB();
const app = express();

app.use(morgan('tiny'));
app.use(cors());


// Middleware to parse JSON
app.use(express.json());


//ROUTES
app.use("/", userRouter);
app.use("/", AppointmentRouter);
app.use("/", CarRouter);

const port = process.env.PORT || 3000;

//Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
