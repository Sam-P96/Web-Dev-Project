import mongoose from "mongoose";
import Appointment from "../src/models/Appointment.js";


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

let appointmentArray = [];
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

const REQUIRED_FIELDS = ['car', 'seller', 'scheduledAt'];

const ALLOWED_UPDATE_FIELDS = [
    'worker', 'scheduledAt', 'location', 'notes', 'status'
];

const SIGNUP_ROLES = ['client', 'worker'];




const getAll = async () => {
    return await Appointment.find();
};

const addOne = async (data) => {
    const missing = REQUIRED_FIELDS.filter(field => !data[field]);
    if (missing.length > 0) {
        return { error: `Missing required fields: ${missing.join(', ')}` };
    }

    try {
        const newAppointment = await Appointment.create({
            car: data.car,
            seller: data.seller,
            worker: data.worker ?? null,
            scheduledAt: data.scheduledAt,
            location: data.location,
            notes: data.notes,
            status: data.status ?? "booked"
        });
        return newAppointment;
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

    const appointment = await Appointment.findById(id);
    return appointment ?? false;
};

const updateById = async (id, updatedData) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;

    const allowed = {};
    ALLOWED_UPDATE_FIELDS.forEach((field) => {
        if (updatedData[field] !== undefined) {
            allowed[field] = updatedData[field];
        }
    });

    const appointment = await Appointment.findByIdAndUpdate(id, allowed, {
        new: true,
        runValidators: true
    });

    return appointment ?? false;
};

const deleteById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;

    const appointment = await Appointment.findByIdAndDelete(id);
    return appointment ? true : false;
};






export {
    addOne,
    getAll,
    findById,
    updateById,
    deleteById
};