import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

//Example model
/*
{
    "name": "Mon",
    "phone_number": "0123456789",
    "email": "email@example.com",
    "username": "callmemon",
    "password": "1234",
    "date_of_birth": "2022-02-22",
    "role": "buyer",
    "account_verified": true,
}
*/

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true},
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    age: { type: Number},
    role: { type: String, enum: ["client", "worker", "admin"], default: "client" },
    browsingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }]
  },
  { timestamps: true }
);

//prevent showing password in response
userSchema.set('toJSON', {
    transform: (doc, ret ) => {
        delete ret.password;
        return ret
    },
});
const User = mongoose.model("User", userSchema)


// Require Fields
const REQUIRED_FIELDS = ['name', 'email', 'password'];

const ALLOWED_UPDATE_FIELDS = [
    'name', 'email', 'phone', 'address', 'age'
];

const getAll = async () => {
    return await User.find();
};

const signup = async (data) => {
    const missing = REQUIRED_FIELDS.filter(field => !data[field]);
    if (missing.length > 0) {
        return { error: `Missing required fields: ${missing.join(', ')}` };
    }

    const email = String(data.email).toLowerCase().trim() ;

    //Check unique email before signing up
    const exists = await User.findOne({ email });
    if (exists) {
        return {error: "Email existed!"}
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt)

        const newUser = await User.create({
            name: data.name,
            email: email,
            password: hashedPassword,
            phone: data.phone,
            address: data.address,
            age: data.age,
            role: "client" // Always client: never trust role from req.body (prevents privilege escalation)
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

// Minimal user for requireAuth: only what authorization needs, never the password hash
const findAuthUserById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    return await User.findById(id).select("_id role");
};

const updateById = async (id, updatedData) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;

    const allowed = {};
    ALLOWED_UPDATE_FIELDS.forEach((field) => {
        if (updatedData[field] !== undefined) {
            allowed[field] = updatedData[field];
        }
    });

    try {
        const user = await User.findByIdAndUpdate(id, allowed, {
            returnDocument: 'after',
            runValidators: true
        });
        return user ?? false;
    } catch (err) {
        // email is unique: changing to an email already in use
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return { error: `${field} already in use` };
        }
        return { error: err.message };
    }
};

const deleteById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;

    const user = await User.findByIdAndDelete(id);
    return user ? true : false;
};

const login = async (email, password) => {
    if (!email || !password) {
        return {error: 'Email and password are required!'}
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() })

    if (!user) {
        return { error: 'Invalid credentials'}
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return {error: 'Invalid credentials'};
    }

    return user;
};


export {
    signup,
    getAll,
    findById,
    findAuthUserById,
    updateById,
    deleteById,
    login
};