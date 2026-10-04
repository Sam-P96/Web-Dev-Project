import express from 'express';
import {
  getAllCar,
  createNewCar,
  findCarById,
  updateCarById,
  deleteCarById,
  searchCars,
} from '../controllers/carControllers.js';
import { requireAuth } from '../middleware/requireAuth.js';

import upload from '../middleware/uploadMiddleware.js';

const CarRouter = express.Router();
//ROUTES

// GET is public (browse cars); writes need a logged-in user

//GET /cars
CarRouter.get('/', getAllCar);

//POST /cars
// requireAuth runs first, so a logged-out request never saves a file
CarRouter.post('/', requireAuth, upload.single('carImage'), createNewCar); // route specific middleware

//GET /cars/search?make=&model=&minPrice=&maxPrice=&minYear=&maxYear=  (must stay above /:carId, or "search" is treated as an id)
CarRouter.get('/search', searchCars);

//GET /cars/:carId
CarRouter.get('/:carId', findCarById);

//PUT /cars/:carId
CarRouter.put('/:carId', requireAuth, updateCarById);

//DELETE /cars/:carId
CarRouter.delete('/:carId', requireAuth, deleteCarById);

export default CarRouter;