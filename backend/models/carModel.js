import mongoose from "mongoose";
import Car from "../src/models/Car.js";


//Data model
/*
{
    "full_name": "Mon",
    "phone_number": "0123456789",
    "email": "email@example.com",
    "username": "callmemon",
    "password": "1234",
    "date_of_birth": "2022-02-22"
    "role": "buyer"
    "account_verified": true,
}
*/

let carArray = [];
let nextId = 1;

// Old REQUIRED FIELD by Duy (maybe remove, we need to discuss)
// const REQUIRED_FIELDS = [
//     'full_name', 'phone_number', 'email', 'username', 'password', 'role'
// ];
// const OPTIONAL_FIELDS = [
//     'date_of_birth'
// ];
// const ALLOWED_UPDATE_FIELDS = [
//     'full_name', 'phone_number', 'email', 'password', 'date_of_birth', 'account_verified'
// ]
// const SIGNUP_ROLES = ['seller', 'buyer'];

// new Require Fields

const REQUIRED_FIELDS = ['seller', 'make', 'model', 'year', 'mileage'];

// seller is deliberately NOT updatable — you don't hand off ownership via PUT
const ALLOWED_UPDATE_FIELDS = [
    'make', 'model', 'year', 'mileage', 'condition', 'description', 'estimatedPrice'
];




const getAll = async () => {
    return await Car.find();
};

const addOne = async (data) => {
    const missing = REQUIRED_FIELDS.filter(field => !data[field]);
    if (missing.length > 0) {
        return { error: `Missing required fields: ${missing.join(', ')}` };
    }

    try {
        const newCar = await Car.create({
            seller: data.seller,
            make: data.make,
            model: data.model,
            year: data.year,
            mileage: data.mileage,
            condition: data.condition,
            description: data.description,
            estimatedPrice: data.estimatedPrice,
        });
        return newCar;
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return { error: `${field} already in use` };
        }
        return { error: err.message };
    }
};

const findById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;

    const car = await Car.findById(id);
    return car ?? false;
};

const updateById = async (id, updatedData) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;

    const allowed = {};
    ALLOWED_UPDATE_FIELDS.forEach((field) => {
        if (updatedData[field] !== undefined) {
            allowed[field] = updatedData[field];
        }
    });

    const car = await Car.findByIdAndUpdate(id, allowed, {
        new: true,
        runValidators: true
    });

    return car ?? false;
};

const deleteById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;

    const car = await Car.findByIdAndDelete(id);
    return car ? true : false;
};






export {
    addOne,
    getAll,
    findById,
    updateById,
    deleteById
};