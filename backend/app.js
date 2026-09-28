import 'dotenv/config';
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
// cors = cross origin resource sharing (browser security rule)
import cors from "cors";
import connectDB from "./db.js";


//ROUTERS
import userRouter from "./routes/userRouter.js";
import AppointmentRouter from "./routes/appointmentRouter.js";
import CarRouter from "./routes/carRouter.js";
import OfferRouter from "./routes/offerRouter.js";
import aiRouter from './routes/aiRouter.js'

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
app.use("/", OfferRouter);
app.use('/ai', aiRouter);

const port = process.env.PORT || 3000;

//Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
