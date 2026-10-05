import * as Car from "../models/carModel.js";
// imports all as Car

const getAllCar = async (req, res) => {
    const getAllResponse = await Car.getAll()
    res.json(getAllResponse);
};

const createNewCar = async (req, res) => {
    const image = req.file ? `/uploads/cars/${req.file.filename}` : undefined; //because image comes from file = tested from the console.log below
    // Owner comes from the token, never from req.body (can't create cars for someone else)
    const data = { ...req.body, image, client: req.user._id }

    const newCar = await Car.addOne(data)
    //   console.log('BODY:', req.body);
    //   console.log('FILE:', req.file);

    if (newCar.error) {
        res.status(400).json({ error: newCar.error });
    } else {
        res.status(201).json(newCar);
    }
};

const findCarById = async (req, res) => {
    const carId = req.params.carId;
    const car = await Car.findById(carId);

    if (!car) res.status(404).json({ error: "Car not found"});
    else res.json(car); 
};

const updateCarById = async (req, res) => {
    const carId = req.params.carId;
    const car = await Car.findById(carId);
    const updatedData = req.body;

    if(!car) res.status(404).json({ error: "Car not found"});
    
    else {
        const  updatedCar = await Car.updateById(carId, updatedData);
        res.json(updatedCar);
    }
}

const deleteCarById = async (req, res) => {
    const carId = req.params.carId;
    const car = await Car.findById(carId);

    if (!car) res.status(404).json({ error: "Car not found"})
    
    else {
        const isDeleted = await Car.deleteById(carId);
        if (isDeleted) res.status(200).json({message: "Delete car successfully"})
        else res.status(500).json({ error: "Delete failed"});
    }
}

const deleteCarById2 = async (req, res) => {
    const carId = req.params.carId;
    const car = await Car.findById(carId);

    if (!car) res.status(404).json({ error: "Car not found"})

    // only the owner (or admin) can delete the car
    else if (req.user.role !== "admin" && car.client?._id.toString() !== req.user._id.toString()) {
        res.status(403).json({ error: "Forbidden" })
    }

    else {
        const isDeleted = await Car.deleteById(carId);
        if (isDeleted) res.status(200).json({message: "Delete car successfully"})
        else res.status(500).json({ error: "Delete failed"});
    }
}

// For Ridhi's search page. Filters come from the URL (?make=Audi&maxPrice=25000...), empty ones are skipped
const searchCars = async (req, res) => {
    const results = await Car.search(req.query)
    res.json(results);
};

export {
  getAllCar,
  createNewCar,
  findCarById,
  updateCarById,
  deleteCarById,
  deleteCarById2,
  searchCars
};