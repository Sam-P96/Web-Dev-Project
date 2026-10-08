import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
// cors = cross origin resource sharing (browser security rule)
import cors from 'cors';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'));

//ROUTERS
import userRouter from './routes/userRouter.js';
import AppointmentRouter from './routes/appointmentRouter.js';
import CarRouter from './routes/carRouter.js';
import OfferRouter from './routes/offerRouter.js';
import aiRouter from './routes/aiRouter.js';

// app.js only builds the Express app (no DB connect, no listen)
// so tests can import it with Supertest. Server start lives in index.js.
const app = express();

// Request log is noise in test output
if (process.env.NODE_ENV !== 'test') app.use(morgan('tiny'));
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Middleware to parse JSON
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//ROUTES
app.use('/api/ai', aiRouter);
app.use('/api/users', userRouter);
app.use('/api/appointments', AppointmentRouter);
app.use('/api/cars', CarRouter);
app.use('/api/offers', OfferRouter);
app.use(express.static('view'));

export default app;
