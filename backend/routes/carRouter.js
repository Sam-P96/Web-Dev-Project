import express from 'express';
import {
  getAllCar,
  createNewCar,
  findCarById,
  updateCarById,
  deleteCarById,
} from '../controllers/carControllers.js';
import { requireAuth } from '../middleware/requireAuth.js';

const CarRouter = express.Router();
//ROUTES

// GET is public (browse cars); writes need a logged-in user

//GET /cars
CarRouter.get('/', getAllCar);

//POST /cars
CarRouter.post('/', requireAuth, createNewCar);

//GET /cars/:carId
CarRouter.get('/:carId', findCarById);

//PUT /cars/:carId
CarRouter.put('/:carId', requireAuth, updateCarById);

//DELETE /cars/:carId
CarRouter.delete('/:carId', requireAuth, deleteCarById);

export default CarRouter;
