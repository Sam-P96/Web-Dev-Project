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
CarRouter.get('/cars', getAllCar);

//POST /cars
CarRouter.post('/cars', createNewCar);

//GET /cars/:carId
CarRouter.get('/cars/:carId', findCarById);

//PUT /cars/:carId
CarRouter.put('/cars/:carId', updateCarById);

//DELETE /cars/:carId
CarRouter.delete('/cars/:carId', deleteCarById);

export default CarRouter;
