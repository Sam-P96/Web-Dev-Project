0;import mongoose from "mongoose";
import Offer from "../src/models/Offer.js";


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

let offerArray = [];
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

const REQUIRED_FIELDS = ['car', 'worker', 'amount', 'message'];

// workers for offer can change (in case this is needed in a hypothetical scenario)
const ALLOWED_UPDATE_FIELDS = [
    'worker', 'amount', 'message', 'status'
];




const getAll = async () => {
    return await Offer.find();
};

const addOne = async (data) => {
    const missing = REQUIRED_FIELDS.filter(field => !data[field]);
    if (missing.length > 0) {
        return { error: `Missing required fields: ${missing.join(', ')}` };
    }

    try {
        const newOffer = await Offer.create({
            car: data.car,
            worker: data.worker,
            amount: data.amount,
            message: data.message,
            status: data.status,
            respondedAt: data.respondedAt,
        });
        return newOffer;
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

    const offer = await Offer.findById(id);
    return offer ?? false;
};

const updateById = async (id, updatedData) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;

    const allowed = {};
    ALLOWED_UPDATE_FIELDS.forEach((field) => {
        if (updatedData[field] !== undefined) {
            allowed[field] = updatedData[field];
        }
    });

    const offer = await Offer.findByIdAndUpdate(id, allowed, {
        new: true,
        runValidators: true
    });

    return offer ?? false;
};

const deleteById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;

    const offer = await Offer.findByIdAndDelete(id);
    return offer ? true : false;
};






export {
    addOne,
    getAll,
    findById,
    updateById,
    deleteById
};