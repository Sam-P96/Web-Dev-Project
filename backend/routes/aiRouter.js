import express from 'express';
import estimateCarPrice from '../controllers/estimateController.js';

const aiRouter = express.Router();

aiRouter.post('/estimate-price', estimateCarPrice);

export default aiRouter;