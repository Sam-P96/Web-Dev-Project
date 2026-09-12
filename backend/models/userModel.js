import mongoose from "mongoose";
import userSchema from "../src/models/User.js";
import User from "../src/models/User.js";


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

let userArray = [];
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

const REQUIRED_FIELDS = ['name', 'email', 'password'];

const ALLOWED_UPDATE_FIELDS = [
    'name', 'email', 'password', 'phone', 'address', 'age'
];

const SIGNUP_ROLES = ['client', 'worker'];




const getAll = async () => {
    return await User.find();
};

const addOne = async (data) => {
    const missing = REQUIRED_FIELDS.filter(field => !data[field]);
    if (missing.length > 0) {
        return { error: `Missing required fields: ${missing.join(', ')}` };
    }

    //Block bad POST with role !SIGNUP_ROLES
    if (!SIGNUP_ROLES.includes(data.role)) {
        return { error: `Invalid role. Allowed ${SIGNUP_ROLES.join(', ')}` }
    }

    try {
        const newUser = await User.create({
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
            address: data.address,
            age: data.age,
            role: data.role ?? "client"
        });
        return newUser;
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

    const user = await User.findById(id);
    return user ?? false;
};

const updateById = async (id, updatedData) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;

    const allowed = {};
    ALLOWED_UPDATE_FIELDS.forEach((field) => {
        if (updatedData[field] !== undefined) {
            allowed[field] = updatedData[field];
        }
    });

    const user = await User.findByIdAndUpdate(id, allowed, {
        new: true,
        runValidators: true
    });

    return user ?? false;
};

const deleteById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;

    const user = await User.findByIdAndDelete(id);
    return user ? true : false;
};






export {
    addOne,
    getAll,
    findById,
    updateById,
    deleteById
};