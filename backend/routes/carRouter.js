import express from 'express';
import {
  getAllCar,
  createNewCar,
  findCarById,
  updateCarById,
  deleteCarById,
} from '../controllers/carControllers.js';

const CarRouter = express.Router();
//ROUTES

//GET /cars
CarRouter.get('/', getAllCar);

//POST /cars
CarRouter.post('/', createNewCar);

//GET /cars/:carId
CarRouter.get('/:carId', findCarById);

//PUT /cars/:carId
CarRouter.put('/:carId', updateCarById);

//DELETE /cars/:carId
CarRouter.delete('/:carId', deleteCarById);

export default CarRouter;
