import * as Car from "../models/carModel.js";
// imports all as Car

const getAllCar = async (req, res) => {
    const getAllResponse = await Car.getAll()
    res.json(getAllResponse);
};

const createNewCar = async (req, res) => {
    // Owner comes from the token, never from req.body (can't create cars for someone else)
    const data = { ...req.body, client: req.user._id }
    
    const newCar = await Car.addOne(data)

    if (newCar.error) {
        res.status(400).json({message: newCar.error });
    } else {
        res.status(201).json(newCar);
    }
};

const findCarById = async (req, res) => {
    const carId = req.params.carId;
    const car = await Car.findById(carId);

    if (!car) res.status(404).json({message: "Car not found"});
    else res.json(car); 
};

const updateCarById = async (req, res) => {
    const carId = req.params.carId;
    const car = await Car.findById(carId);
    const updatedData = req.body;

    if(!car) res.status(404).json({message: "Car not found"});
    
    else {
        const  updatedCar = await Car.updateById(carId, updatedData);
        res.json(updatedCar);
    }
}

const deleteCarById = async (req, res) => {
    const carId = req.params.carId;
    const car = await Car.findById(carId);

    if (!car) res.status(404).json({message: "Car not found "})
    
    else {
        const isDeleted = await Car.deleteById(carId);
        if (isDeleted) res.status(200).json({message: "Delete car successfully"})
        else res.status(500).json({message: "Delete failed"}); 
    }
}

export {
  getAllCar,
  createNewCar,
  findCarById,
  updateCarById,
  deleteCarById
};