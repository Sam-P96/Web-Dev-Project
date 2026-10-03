import 'dotenv/config';
import express from "express";
import morgan from "morgan";
// cors = cross origin resource sharing (browser security rule)
import cors from "cors";


//ROUTERS
import userRouter from "./routes/userRouter.js";
import AppointmentRouter from "./routes/appointmentRouter.js";
import CarRouter from "./routes/carRouter.js";
import OfferRouter from "./routes/offerRouter.js";
import chatRouter from "./routes/chatRouter.js"
import aiRouter from './routes/aiRouter.js'

// app.js only builds the Express app (no DB connect, no listen)
// so tests can import it with Supertest. Server start lives in index.js.
const app = express();

// Request log is noise in test output
if (process.env.NODE_ENV !== 'test') app.use(morgan('tiny'));
app.use(cors());


// Middleware to parse JSON
app.use(express.json());


//ROUTES
app.use('/api/ai', aiRouter);
app.use("/api/users", userRouter);
app.use("/api/appointments", AppointmentRouter);
app.use("/api/cars", CarRouter);
app.use("/api/offers", OfferRouter);
app.use("/api/chat", chatRouter)

// Express' defaults answer with an HTML page (and a stack trace in dev) -> keep the { error } shape everywhere
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// 4 arguments = error handler. Catches e.g. malformed JSON (400) and too large bodies (413)
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  // err.expose is set by body-parser for client errors whose message is safe to show
  res.status(status).json({ error: status < 500 && err.expose ? err.message : "Internal server error" });
});

export default app;
